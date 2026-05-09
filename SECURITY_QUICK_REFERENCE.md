# Security Quick Reference Guide

## Role-Based Access Control

### Protecting Pages (Server Components)

```typescript
// Require authentication
import { requireAuth } from '@/lib/auth-utils';

export default async function ProfilePage() {
  const user = await requireAuth();
  // Redirects to signin if not authenticated
  return <div>Welcome, {user.email}</div>;
}
```

```typescript
// Require admin role
import { requireAdmin } from '@/lib/auth-utils';

export default async function AdminPage() {
  const admin = await requireAdmin();
  // Redirects to home if not admin
  return <div>Admin: {admin.email}</div>;
}
```

### Protecting API Routes

```typescript
// Authenticate only
import { withAuth, getSecureHeaders } from '@/lib/api-security';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
  const user = (req as any).user; // From middleware
  return NextResponse.json({ message: 'Authenticated' }, {
    headers: getSecureHeaders(),
  });
};

export const GET = withAuth(handler);
```

```typescript
// Admin only (includes role check)
import { withAdminAuth, getSecureHeaders } from '@/lib/api-security';

const handler = async (req: NextRequest) => {
  return NextResponse.json({ message: 'Admin access' }, {
    headers: getSecureHeaders(),
  });
};

export const DELETE = withAdminAuth(handler);
```

## Input Validation

### Validating User Input

```typescript
import { validateInput, SignUpSchema, SignInSchema } from '@/lib/validation';

// In API route
const { valid, data, errors } = validateInput(SignUpSchema, req.body);

if (!valid) {
  return NextResponse.json({ errors }, { status: 400 });
}

// data is now type-safe: { name, email, password, passwordConfirm }
```

### Custom Validation Schemas

```typescript
import { z } from 'zod';
import { validateInput } from '@/lib/validation';

const MySchema = z.object({
  username: z.string().min(3).max(20),
  age: z.number().min(18).max(120),
});

const result = validateInput(MySchema, data);
```

## Rate Limiting

### Check Rate Limit in API Route

```typescript
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/api-security';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);
  
  // Check custom limit: 10 per hour
  const limit = checkRateLimit(`myendpoint:${clientIp}`, {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  });
  
  if (!limit.allowed) {
    return new NextResponse('Too many requests', {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((limit.resetTime - Date.now()) / 1000)),
      },
    });
  }
  
  // Process request...
}
```

### Pre-configured Presets

```typescript
// Use existing presets
import { RATE_LIMIT_PRESETS, checkRateLimit } from '@/lib/rate-limit';

const login = checkRateLimit(`login:${ip}`, RATE_LIMIT_PRESETS.login);      // 5/15min
const register = checkRateLimit(`reg:${ip}`, RATE_LIMIT_PRESETS.register);  // 3/hour
const api = checkRateLimit(`api:${ip}`, RATE_LIMIT_PRESETS.api);            // 30/min
const reset = checkRateLimit(`reset:${ip}`, RATE_LIMIT_PRESETS.passwordReset); // 2/hour
```

## Permission Checks

### Fine-Grained Permissions

```typescript
import { hasPermission } from '@/lib/auth-utils';

// In API route or server component
const canRead = await hasPermission(userId, 'read:products');
const canWrite = await hasPermission(userId, 'write:products');
const canManageUsers = await hasPermission(userId, 'manage:users');

if (!canRead) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### Available Permissions

- `read:products` - View product catalog
- `write:products` - Create/edit products (admin)
- `manage:users` - Manage user accounts (admin)
- `view:orders` - View own orders (customer) or all (admin)
- `manage:orders` - Change order status (admin)

## Logging Security Events

### Log Authentication Events

```typescript
import { logAuthEvent } from '@/lib/auth-utils';

// After successful login
await logAuthEvent(userId, 'signin', {
  ip: getClientIp(req),
  userAgent: req.headers.get('user-agent'),
});

// Password changed
await logAuthEvent(userId, 'password_change', {
  ip: getClientIp(req),
  timestamp: new Date(),
});

// Permission updated
await logAuthEvent(userId, 'permission_change', {
  oldRole: 'CUSTOMER',
  newRole: 'ADMIN',
});
```

## Secure Response Headers

### Include in All API Routes

```typescript
import { getSecureHeaders } from '@/lib/api-security';

export async function GET(req: NextRequest) {
  // Process request...
  
  return NextResponse.json(
    { data: 'something' },
    { headers: getSecureHeaders() }
  );
}

// Returns all security headers automatically:
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 1; mode=block
// Strict-Transport-Security: max-age=...
// Permissions-Policy: geolocation=(), ...
// Referrer-Policy: strict-origin-when-cross-origin
// Content-Security-Policy: default-src 'self'
```

## Client-Side Authentication

### Get Current User

```typescript
'use client';

import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Please sign in</div>;
  
  return <div>Welcome, {session.user?.email}</div>;
}
```

### Sign Out

```typescript
import { signOut } from 'next-auth/react';

<button onClick={() => signOut()}>Sign Out</button>
```

### Redirect on Unauthorized

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') redirect('/auth/signin');
  
  const role = (session?.user as { role?: string })?.role;
  if (role !== 'ADMIN') redirect('/');
  
  return <div>Admin Dashboard</div>;
}
```

## Common Security Patterns

### Prevent Account Enumeration

```typescript
// ❌ BAD: Reveals if email is registered
if (!user) {
  return { error: 'User not found' };
}

// ✅ GOOD: Same error message for all cases
const passwordValid = user && await bcrypt.compare(password, user.password);
if (!passwordValid) {
  return { error: 'Invalid email or password' };
}
```

### Timing-Safe Comparison

```typescript
// ❌ BAD: Different timing for different inputs
if (password === hash) { }

// ✅ GOOD: Always takes same time (prevents timing attacks)
const valid = await bcrypt.compare(password, hash);
```

### Generic Error Messages

```typescript
// ❌ BAD: Information leak
if (!user) return { error: 'Email not found' };
if (!permissions) return { error: 'Admin access required' };

// ✅ GOOD: Same message regardless
if (!authorized) {
  return { error: 'Access denied' };
}
```

### Rate Limit Response

```typescript
// ✅ CORRECT: Include Retry-After header
if (!rateLimit.allowed) {
  return new NextResponse('Too many requests', {
    status: 429,
    headers: {
      'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
    },
  });
}
```

## Environment Variables

### Required in Production

```env
# Authentication
NEXTAUTH_SECRET=<32+ char random string>
NEXTAUTH_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/db_name
DIRECT_URL=postgresql://user:password@host:5432/db_name

# Optional: Email service (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=app-password

# Optional: OAuth (for social sign-in)
GITHUB_ID=your-github-app-id
GITHUB_SECRET=your-github-secret
GOOGLE_ID=your-google-app-id
GOOGLE_SECRET=your-google-secret
```

### Generating NEXTAUTH_SECRET

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Online generator (development only - never for production)
# https://generate-secret.vercel.app/32
```

## Deployment Checklist

- [ ] Set `NEXTAUTH_SECRET` to unique random value
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Set `NODE_ENV=production`
- [ ] Configure strong database credentials
- [ ] Enable rate limiting (Redis for production)
- [ ] Set up security monitoring/alerts
- [ ] Configure backup/disaster recovery
- [ ] Enable audit logging
- [ ] Set up incident response procedures
- [ ] Conduct security review
- [ ] Load test and performance test

## Debugging Security Issues

### Enable NextAuth Debug Logging

```env
# In development only!
DEBUG=next-auth:*
```

```typescript
// In lib/auth.ts
export const authOptions: NextAuthOptions = {
  // ...
  debug: process.env.NODE_ENV === 'development', // Enabled in dev
};
```

### Check Rate Limits

```typescript
// Monitor rate limit store
import { rateLimitStore } from '@/lib/rate-limit';
console.log('Rate limit entries:', rateLimitStore.size);
```

### Verify Role in Database

```typescript
// Check user's actual role
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true, role: true },
});
console.log('User role:', user?.role);
```

---

**Quick Links**:
- [SECURITY.md](./SECURITY.md) - Detailed security documentation
- [SECURITY_IMPLEMENTATION.md](./SECURITY_IMPLEMENTATION.md) - Implementation summary
- [NextAuth Docs](https://next-auth.js.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
