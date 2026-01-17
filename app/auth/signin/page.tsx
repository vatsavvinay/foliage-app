'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('/');

  useEffect(() => {
    const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    setCallbackUrl(sp?.get('callbackUrl') ?? '/');
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    setLoading(false);
    if (res?.ok) {
      const session = await getSession();
      const role = (session?.user as { role?: string })?.role;
      if (callbackUrl && callbackUrl !== '/') {
        router.push(callbackUrl);
      } else if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      setError(res?.error ?? 'Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-2">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <p className="text-sm mt-4">
        No account? <a href="/auth/register" className="text-sage-600 font-medium">Register</a>
      </p>
    </div>
  );
}
