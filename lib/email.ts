interface ResetEmailOptions {
  to: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({ to, resetUrl }: ResetEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL] Password reset link for ${to}:\n  ${resetUrl}`);
    return;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const from = process.env.EMAIL_FROM ?? 'Foliage <noreply@foliage.app>';

  await resend.emails.send({
    from,
    to,
    subject: 'Reset your Foliage password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#16a34a">Reset your password</h2>
        <p>Click the button below to choose a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:0.85em">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
