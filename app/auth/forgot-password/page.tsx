'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      // Always show success — API intentionally reveals nothing
      setSubmitted(true);
    } catch {
      setSubmitted(true); // Still show success to avoid leaking info
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-8 sm:py-16 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Check your email</h1>
          <p className="text-gray-600">
            If an account exists for <strong>{email}</strong>, we've sent a password reset link.
            It expires in 1 hour.
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Didn't receive it? Check your spam folder or{' '}
          <button
            onClick={() => setSubmitted(false)}
            className="text-green-600 font-medium hover:underline"
          >
            try again
          </button>
          .
        </p>
        <Link href="/auth/signin" className="text-sm text-green-600 font-medium hover:underline">
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 sm:py-16 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Forgot password?</h1>
        <p className="text-gray-600">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            placeholder="you@example.com"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 ${
              emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
            autoComplete="email"
            autoFocus
          />
          {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="text-sm mt-6 text-center text-gray-600">
        Remember it?{' '}
        <Link href="/auth/signin" className="text-green-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
