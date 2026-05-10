import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/api-security';

// Always return the same message to prevent email enumeration
const OK = { message: 'If an account exists for that email, a reset link has been sent.' };

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateCheck = checkRateLimit(`forgot-password:${ip}`, RATE_LIMIT_PRESETS.passwordReset);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before trying again.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.toLowerCase().trim() : '';

    if (!email || !email.includes('@')) {
      return NextResponse.json(OK); // Reveal nothing
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json(OK); // Reveal nothing
    }

    // Clear any previous tokens for this email before creating a new one
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { token, email, expiresAt },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    await sendPasswordResetEmail({ to: email, resetUrl });

    return NextResponse.json(OK);
  } catch (error) {
    console.error('[forgot-password]', error);
    return NextResponse.json(OK); // Don't leak errors to the client
  }
}
