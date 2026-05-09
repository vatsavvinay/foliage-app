import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { checkRateLimit, RATE_LIMIT_PRESETS, resetRateLimit } from '@/lib/rate-limit';
import { validateInput, SignUpSchema, SignUpInput } from '@/lib/validation';
import { getClientIp, getSecureHeaders } from '@/lib/api-security';

export async function POST(request: NextRequest) {
  try {
    // Extract client IP for rate limiting
    const clientIp = getClientIp(request);
    
    // Check rate limit (3 registrations per hour per IP)
    const rateLimitCheck = checkRateLimit(
      `register:${clientIp}`,
      RATE_LIMIT_PRESETS.register
    );
    
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Too many registration attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000)),
            ...getSecureHeaders(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateInput<SignUpInput>(SignUpSchema, body);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400, headers: getSecureHeaders() }
      );
    }

    const { name, email, password } = validation.data!;

    // Check if user already exists (case-insensitive)
    const normalizedEmail = email.toLowerCase();
    const exists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (exists) {
      // Rate limit email-based brute force (check by email too)
      const emailRateLimit = checkRateLimit(
        `register:email:${normalizedEmail}`,
        { maxRequests: 10, windowMs: 60 * 60 * 1000 } // 10 attempts per hour
      );
      
      if (!emailRateLimit.allowed) {
        return NextResponse.json(
          { error: 'Email has too many registration attempts. Try a different email.' },
          { status: 429, headers: getSecureHeaders() }
        );
      }

      // Don't reveal if email exists (security best practice)
      return NextResponse.json(
        { error: 'An account with this email may already exist. Try signing in instead.' },
        { status: 409, headers: getSecureHeaders() }
      );
    }

    // Hash password with strong salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'CUSTOMER', // Always create new users as customers
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Clear rate limit on successful registration
    resetRateLimit(`register:${clientIp}`);

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201, headers: getSecureHeaders() }
    );
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'Registration failed. Please try again later.' },
      { status: 500, headers: getSecureHeaders() }
    );
  }
}
