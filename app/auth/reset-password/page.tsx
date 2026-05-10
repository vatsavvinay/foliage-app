'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [formData, setFormData] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) setSubmitError('Missing reset token. Please use the link from your email.');
  }, [token]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const { password, confirm } = formData;

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'At least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Must contain an uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Must contain a lowercase letter';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Must contain a number';
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = 'Must contain a special character (!@#$%^&*)';
    }

    if (!confirm) {
      newErrors.confirm = 'Please confirm your password';
    } else if (password !== confirm) {
      newErrors.confirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: formData.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? 'Failed to reset password.');
        return;
      }

      setDone(true);
      setTimeout(() => router.push('/auth/signin'), 3000);
    } catch {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: 'password' | 'confirm') =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 ${
      errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
    }`;

  if (done) {
    return (
      <div className="max-w-md mx-auto py-8 sm:py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-3">Password updated!</h1>
        <p className="text-gray-600 mb-4">Redirecting you to sign in…</p>
        <Link href="/auth/signin" className="text-green-600 font-medium hover:underline text-sm">
          Sign in now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 sm:py-16 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Set new password</h1>
        <p className="text-gray-600">Choose a strong password for your account.</p>
      </div>

      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {submitError}
          {!token && (
            <p className="mt-2">
              <Link href="/auth/forgot-password" className="underline font-medium">
                Request a new reset link
              </Link>
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1">New password</label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            placeholder="••••••••"
            className={inputClass('password')}
            disabled={isLoading || !token}
            autoComplete="new-password"
            autoFocus
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          <p className="text-xs text-gray-500 mt-1">
            At least 8 characters with uppercase, lowercase, number, and special character
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm new password</label>
          <Input
            type="password"
            value={formData.confirm}
            onChange={(e) => {
              setFormData({ ...formData, confirm: e.target.value });
              if (errors.confirm) setErrors({ ...errors, confirm: undefined });
            }}
            placeholder="••••••••"
            className={inputClass('confirm')}
            disabled={isLoading || !token}
            autoComplete="new-password"
          />
          {errors.confirm && <p className="text-red-600 text-sm mt-1">{errors.confirm}</p>}
        </div>

        <Button type="submit" disabled={isLoading || !token} className="w-full">
          {isLoading ? 'Updating…' : 'Update password'}
        </Button>
      </form>

      <p className="text-sm mt-6 text-center text-gray-600">
        <Link href="/auth/signin" className="text-green-600 font-medium hover:underline">
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
