import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './prisma';

export type ApiHandler = (
  req: NextRequest,
  context?: { params?: Record<string, string | string[]> }
) => Promise<Response>;

/**
 * Wrapper to protect API routes with authentication
 * Usage: export const POST = withAuth(handler);
 */
export function withAuth(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, context) => {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401, headers: getSecureHeaders() }
        );
      }
      
      // Attach user info to request for handler to use
      (req as any).user = session.user;
      
      return handler(req, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecureHeaders() }
      );
    }
  };
}

/**
 * Wrapper to protect API routes with admin role check
 * Usage: export const DELETE = withAdminAuth(handler);
 */
export function withAdminAuth(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, context) => {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401, headers: getSecureHeaders() }
        );
      }
      
      // Check admin role in database (more reliable than JWT)
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });
      
      if (user?.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden: Admin access required' },
          { status: 403, headers: getSecureHeaders() }
        );
      }
      
      (req as any).user = session.user;
      
      return handler(req, context);
    } catch (error) {
      console.error('Admin auth middleware error:', error);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecureHeaders() }
      );
    }
  };
}

/**
 * Extract IP address from request
 * Handles proxied requests (X-Forwarded-For, CF-Connecting-IP, etc.)
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const cloudflare = req.headers.get('cf-connecting-ip');
  if (cloudflare) {
    return cloudflare;
  }
  
  return 'unknown';
}

/**
 * Secure response headers for API routes
 */
export function getSecureHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
}
