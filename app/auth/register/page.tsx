'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/components/ui/Toast';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
  _form?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name is too long';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
      newErrors.name = 'Name contains invalid characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (formData.password.length > 128) {
      newErrors.password = 'Password is too long';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must include lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must include number';
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = 'Password must include special character (!@#$%^&*)';
    }

    // Confirm password validation
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Please confirm password';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast.success('Account created successfully!', {
          description: 'Redirecting to sign in...'
        });
        // Redirect to signin on successful registration
        router.push('/auth/signin?registered=true');
      } else {
        // Handle specific error messages
        if (data.errors) {
          setErrors(data.errors);
          showToast.error('Please fix the errors below');
        } else {
          const errorMsg = data.error || 'Registration failed. Please try again.';
          setSubmitError(errorMsg);
          showToast.error(errorMsg);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = 'An error occurred. Please try again later.';
      setSubmitError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (field: keyof typeof formData) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 ${
      errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
    }`;

  return (
    <div className="max-w-md mx-auto py-8 sm:py-16 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-600">Join us to start shopping</p>
      </div>

      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {submitError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="John Doe"
            className={inputClasses('name')}
            disabled={loading}
            autoComplete="name"
            required
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
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
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="••••••••"
            className={inputClasses('password')}
            disabled={loading}
            autoComplete="new-password"
            required
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          <p className="text-xs text-gray-500 mt-2">
            At least 8 characters with uppercase, lowercase, number, and special character
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <Input
            type="password"
            value={formData.passwordConfirm}
            onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
            placeholder="••••••••"
            className={inputClasses('passwordConfirm')}
            disabled={loading}
            autoComplete="new-password"
            required
          />
          {errors.passwordConfirm && (
            <p className="text-red-600 text-sm mt-1">{errors.passwordConfirm}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || Object.keys(errors).length > 0}
          className="w-full"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-sm mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <a href="/auth/signin" className="text-sage-600 font-medium hover:underline">
          Sign In
        </a>
      </p>
    </div>
  );
}
