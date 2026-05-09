import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Next.js middleware for route protection and authorization
 * Runs on every request before routing
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get JWT token from request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  /**
   * Admin routes - require authentication and admin role
   */
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Redirect unauthenticated users to signin
      const url = request.nextUrl.clone();
      url.pathname = '/auth/signin';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    if (token.role !== 'ADMIN') {
      // Redirect non-admin users to home
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  /**
   * Auth routes - redirect authenticated users away
   */
  if (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/register')) {
    if (token) {
      // Redirect authenticated users to home
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  /**
   * Profile routes - require authentication
   */
  if (pathname.startsWith('/profile') || pathname.startsWith('/checkout')) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/signin';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  /**
   * Add security headers to all responses
   */
  const response = NextResponse.next();
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection in older browsers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Enforce HTTPS and HSTS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Control which APIs can be accessed
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // In development, Next.js HMR requires unsafe-eval; production builds do not
  const csp = process.env.NODE_ENV === 'production'
    ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

/**
 * Configure which routes the middleware applies to
 * Exclude static files, images, public assets
 */
export const config = {
  matcher: [
    // Include all routes except static files
    '/((?!api/public|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
