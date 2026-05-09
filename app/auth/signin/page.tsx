'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/components/ui/Toast';

const SIGNIN_ERRORS: Record<string, string> = {
  CredentialsSignin: 'Invalid email or password',
  EmailSignInError: 'Failed to send sign in email',
  Callback: 'Session callback error',
  OAuthCallback: 'OAuth callback error',
  OAuthCreateAccount: 'Could not create OAuth account',
  EmailCreateAccount: 'Could not create email account',
  SessionCallback: 'Session callback failed',
  Default: 'An error occurred during sign in',
};

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('/');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get callback URL and error from query params
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      setCallbackUrl(sp.get('callbackUrl') ?? '/');
      
      // Handle NextAuth errors from redirect
      const errorParam = sp.get('error');
      if (errorParam) {
        const errorMessage = SIGNIN_ERRORS[errorParam] || SIGNIN_ERRORS.Default;
        setError(errorMessage);
        showToast.error(errorMessage);
      }
    }
  }, []);

  /**
   * Validate form inputs before submission
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    if (error) {
      setError(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.toLowerCase(),
        password,
        callbackUrl,
      });

      if (res?.ok) {
        try {
          const session = await getSession();
          const role = (session?.user as { role?: string })?.role;
          
          showToast.success('Signed in successfully!');
          
          // Redirect to callback URL, admin dashboard, or home
          if (callbackUrl && callbackUrl !== '/') {
            router.push(callbackUrl);
          } else if (role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        } catch (sessionError) {
          console.error('Error fetching session:', sessionError);
          showToast.error('Failed to fetch session. Redirecting...');
          router.push('/');
        }
      } else {
        // Generic error message to avoid account enumeration
        const errorMsg = 'Invalid email or password';
        setError(errorMsg);
        showToast.error(errorMsg);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      const errorMsg = 'An error occurred. Please try again.';
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (field: string) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 ${
      errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
    }`;

  return (
    <div className="max-w-md mx-auto py-8 sm:py-16 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sign In</h1>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleInputChange('email');
            }}
            placeholder="you@example.com"
            className={inputClasses('email')}
            disabled={loading}
            autoComplete="email"
            required
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handleInputChange('password');
            }}
            placeholder="••••••••"
            className={inputClasses('password')}
            disabled={loading}
            autoComplete="current-password"
            required
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading || Object.keys(errors).length > 0}
          className="w-full"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 space-y-2 text-sm text-center">
        <p className="text-gray-600">
          No account?{' '}
          <a href="/auth/register" className="text-sage-600 font-medium hover:underline">
            Create one
          </a>
        </p>
        {/* <p className="text-gray-600">
          Forgot password?{' '}
          <a href="/auth/reset-password" className="text-sage-600 font-medium hover:underline">
            Reset it
          </a>
        </p> */}
      </div>
    </div>
  );
}
