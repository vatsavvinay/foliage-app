# Security Hardening Guide

## Overview

This document outlines all security measures implemented in the Foliage e-commerce application.

---

## 1. Authentication & Authorization

### NextAuth Configuration (`lib/auth.ts`)

**Key Security Features:**
- ✅ **JWT Strategy**: Stateless token-based authentication
- ✅ **Timing-Safe Password Comparison**: Prevents timing attacks that could reveal if email exists
- ✅ **Email Normalization**: All emails converted to lowercase for consistent lookups
- ✅ **Session Duration**: Reduced from 30 days to 7 days (shorter = lower compromise risk)
- ✅ **Token Updates**: Sessions refresh daily (`updateAge: 24h`)
- ✅ **CSRF Protection**: NextAuth handles CSRF tokens automatically
- ✅ **Secure Redirect Validation**: Prevents open redirect vulnerabilities
- ✅ **Debug Mode**: Disabled in production

### Session Security

```typescript
session: {
  strategy: "jwt",        // Stateless, cannot be revoked mid-session
  maxAge: 7 * 24 * 60 * 60,  // 7 days
  updateAge: 24 * 60 * 60    // Refresh daily
}
```

---

## 2. Role-Based Access Control (RBAC)

### Middleware Protection (`middleware.ts`)

Protects routes before rendering:

- **Admin Routes** (`/admin/*`): Require ADMIN role
- **Auth Routes** (`/auth/*`): Redirect authenticated users away
- **Protected Routes** (`/profile`, `/checkout`): Require authentication

```typescript
// Example: Accessing /admin without auth redirects to signin
// Accessing /admin as CUSTOMER redirects to home
```

### API Route Protection (`lib/api-security.ts`)

**Two wrapper functions:**

1. **`withAuth(handler)`**: Basic authentication check
   ```typescript
   export const GET = withAuth(async (req) => {
     // Only authenticated users reach here
   });
   ```

2. **`withAdminAuth(handler)`**: Authentication + Admin role verification
   ```typescript
   export const DELETE = withAdminAuth(async (req) => {
     // Only admin users reach here
   });
   ```

**Important**: Admin role is verified against **database**, not JWT token, to prevent:
- JWT tampering
- Stale tokens with outdated roles

---

## 3. Password Security

### Requirements

Passwords must include:
- Minimum 8 characters
- Maximum 128 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)

### Hashing

```typescript
// Register: 12 salt rounds (high security, slower to crack)
const hashed = await bcrypt.hash(password, 12);

// Signin: Timing-safe comparison
const valid = await bcrypt.compare(inputPassword, hashedPassword);
```

**Cost**: ~100ms per password hash/compare (intentional slow-down prevents brute force)

---

## 4. Rate Limiting

### Implementation (`lib/rate-limit.ts`)

In-memory rate limiter prevents brute force attacks:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/register` | 3 per IP | 1 hour |
| `/api/auth/register` (email-based) | 10 per email | 1 hour |
| Login (via NextAuth) | 5 per IP | 15 minutes |
| API calls | 30 per minute | 1 minute |

**How it works:**
1. Tracks requests by IP and email
2. Resets counter after time window
3. Returns HTTP 429 (Too Many Requests) when limit exceeded
4. Provides `Retry-After` header

```typescript
// Check rate limit
const check = checkRateLimit(`register:${clientIp}`, RATE_LIMIT_PRESETS.register);
if (!check.allowed) {
  return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
}
```

### Production Recommendation

For production deployments, consider:
1. **Redis-backed rate limiting** (shared across servers)
2. **Cloud WAF** (Cloudflare, AWS Shield)
3. **IP reputation services** (check against known bad IPs)

---

## 5. Input Validation

### Validation Schema (`lib/validation.ts`)

Uses **Zod** for runtime type safety:

**Password Schema:**
```typescript
export const PasswordSchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/[A-Z]/)  // uppercase
  .regex(/[a-z]/)  // lowercase
  .regex(/[0-9]/)  // number
  .regex(/[!@#$%^&*]/);  // special char
```

**Email Schema:**
```typescript
export const EmailSchema = z
  .string()
  .email()
  .toLowerCase()
  .max(255);
```

### Per-Field Validation

Both register and signin pages validate inputs:
- Real-time error clearing as user types
- Format validation before submission
- Server-side validation (never trust client)

---

## 6. Secure API Responses

### Security Headers (`lib/api-security.ts`)

All API routes include:

```typescript
'X-Content-Type-Options': 'nosniff',        // Prevent MIME type sniffing
'X-Frame-Options': 'DENY',                  // Prevent clickjacking
'X-XSS-Protection': '1; mode=block',        // Legacy XSS protection
'Strict-Transport-Security': '...',         // Force HTTPS (production)
'Referrer-Policy': 'strict-origin-when-cross-origin',
'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
```

### Error Handling

**Security Best Practices:**
- ❌ Never expose internal error messages
- ❌ Never reveal if email is registered (account enumeration)
- ✅ Generic messages: "Invalid email or password"
- ✅ Log errors server-side for debugging

```typescript
// Bad ❌
if (!user) {
  return { error: 'User not found' };  // Reveals if email is registered
}

// Good ✅
const valid = user && await bcrypt.compare(password, user.password);
if (!valid) {
  return { error: 'Invalid email or password' };  // Same message
}
```

---

## 7. IP Address Handling

### Client IP Extraction (`lib/api-security.ts`)

Handles proxied requests:

```typescript
function getClientIp(req: NextRequest): string {
  // Cloudflare
  if (req.headers.get('cf-connecting-ip')) return ...
  
  // Standard X-Forwarded-For
  if (req.headers.get('x-forwarded-for')) return ...
  
  // Fallback
  return req.ip || 'unknown';
}
```

Used for:
- Rate limiting identification
- Security audit logs
- Suspicious activity detection

---

## 8. Enhanced Auth Utilities (`lib/auth-utils.ts`)

### New Functions

**`hasPermission(userId, permission)`**
- Fine-grained access control
- Extensible permission system
- Prevents privilege escalation

**`logAuthEvent(userId, eventType)`**
- Audit trail for security events
- Sign in, sign out, permission changes

**`invalidateUserSessions(userId)`**
- Force logout (password change, suspicious activity)
- Future: Session versioning

### Example Usage

```typescript
// In page/component
import { requireAdmin } from '@/lib/auth-utils';

export default async function AdminPage() {
  const admin = await requireAdmin();  // Redirects if not admin
  // ...
}
```

---

## 9. Environment Configuration

### Required Environment Variables

```env
# NextAuth
NEXTAUTH_SECRET=<strong-random-string-32chars>
NEXTAUTH_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...  # For migrations

# Optional: Password reset email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Generating NEXTAUTH_SECRET

```bash
# Generate secure random string
openssl rand -base64 32
```

---

## 10. Deployment Security Checklist

### Before Production

- ✅ Set `NEXTAUTH_URL` to production domain
- ✅ Generate new `NEXTAUTH_SECRET` (never reuse)
- ✅ Enable HTTPS (required for Secure cookies)
- ✅ Set `NODE_ENV=production` (disables NextAuth debug)
- ✅ Configure secure database with strong credentials
- ✅ Use environment variables (never hardcode secrets)
- ✅ Enable CORS restrictions if needed
- ✅ Set up audit logging
- ✅ Monitor rate limit hits
- ✅ Enable Web Application Firewall (WAF)

### Ongoing Security

1. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

2. **Monitor logs for suspicious activity**
   - Multiple failed login attempts
   - Rate limit violations
   - Unauthorized access attempts

3. **Review user roles/permissions regularly**

4. **Implement password reset (future)**
   - Email verification
   - Time-limited reset tokens
   - Log password changes

---

## 11. Session Management

### Current Strategy

**JWT (JSON Web Tokens)**
- Stateless (no server database lookup needed)
- Cannot be revoked mid-session (7-day expiry)
- Verified via signature

### For Enhanced Security (Future)

Consider implementing:
1. **Session Versioning**: Invalidate old tokens on critical changes
2. **Refresh Tokens**: Short-lived access tokens + longer-lived refresh
3. **Session Database**: Track active sessions, enable revocation

---

## 12. Testing Security

### Test Cases to Implement

```typescript
// Rate limit
POST /api/auth/register (6 times within 1 hour) → HTTP 429

// Invalid credentials
POST /api/auth/signin { email: "test@test.com", password: "wrong" } → "Invalid email or password"

// Admin protection
GET /api/admin/products (as CUSTOMER) → HTTP 403

// CSRF protection
POST /api/auth/signin (without CSRF token) → NextAuth validates

// SQL injection
POST /api/auth/signin { email: "' OR '1'='1" } → Prisma sanitizes
```

---

## 13. Known Limitations & Future Improvements

### Current Limitations

1. **In-memory rate limiting**: Resets on server restart
   - Solution: Redis-backed rate limiting

2. **No session revocation**: Sessions valid until expiry
   - Solution: Session versioning or database-backed sessions

3. **No 2FA**: Single-factor authentication only
   - Solution: TOTP (Google Authenticator) support

4. **No password reset**: No self-service password reset
   - Solution: Email-based reset tokens

5. **No OAuth**: Only email/password authentication
   - Solution: Google/GitHub OAuth providers

### Recommended Next Steps

1. Implement Redis-backed rate limiting
2. Add password reset endpoint
3. Implement email verification for registrations
4. Add 2FA support
5. Enable CORS restrictions
6. Set up real-time security alerting

---

## 14. Security References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NextAuth Security](https://next-auth.js.org/getting-started/example#securing-pages-and-api-routes)
- [Bcrypt Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Zod Validation](https://zod.dev/)
- [Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Rate_Limiting_Cheat_Sheet.html)

---

## Support

For security issues or vulnerabilities, please report privately to the security team.

Do NOT create public issues for security vulnerabilities.
