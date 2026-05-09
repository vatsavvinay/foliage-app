# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server on http://localhost:3000
npm run build            # Production build
npm run lint             # ESLint
npm run prisma:generate  # Regenerate Prisma client after schema changes
npm run prisma:migrate   # Run pending migrations (dev only)
npm run prisma:studio    # Open Prisma Studio GUI
npm run seed             # Seed the database with sample data
```

There are no automated tests in this project.

## Required Environment Variables

```
DATABASE_URL          # Supabase connection pooler URL (port 6543)
DIRECT_URL            # Supabase direct URL (port 5432, used by Prisma migrations)
NEXTAUTH_URL          # Full URL of the app (e.g. http://localhost:3000)
NEXTAUTH_SECRET       # Random secret for JWT signing
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY  # Uploadcare key for image uploads
```

## Architecture

**Next.js 15 App Router** with React 19. All pages use the `app/` directory convention.

### Route layout

| Path | Purpose |
|------|---------|
| `app/page.tsx` | Homepage (client component — welcome overlay needs `localStorage`) |
| `app/products/page.tsx` | Server component — queries Prisma directly, falls back to `lib/products.ts` static list if DB is unavailable |
| `app/products/[slug]/page.tsx` | Client component — fetches single product via `/api/product?slug=` |
| `app/(storefront)/cart/` | Cart page |
| `app/(storefront)/checkout/` | Checkout — auth-protected via `middleware.ts` |
| `app/orders/[id]/page.tsx` | Order confirmation — server component |
| `app/profile/` | User profile — auth-protected |
| `app/admin/**` | Admin dashboard — requires `ADMIN` role, protected in both middleware and each page's server-side check |
| `app/auth/signin`, `app/auth/register` | Auth pages |

### Auth & roles

- **NextAuth v4** with JWT strategy (`lib/auth.ts`). Sessions last 7 days.
- Two roles: `ADMIN` and `CUSTOMER` (Prisma enum, stored uppercase).
- Role is embedded in the JWT and exposed on `session.user.role`. Always compare against `"ADMIN"` (uppercase).
- `middleware.ts` enforces route-level protection for `/admin`, `/profile`, and `/checkout`.
- Admin API routes use `withAdminAuth()` from `lib/api-security.ts` which re-verifies the role against the DB on every request.
- `lib/auth-utils.ts` provides `getCurrentUser()`, `requireAuth()`, and `requireAdmin()` for server components and API routes.

### Cart system

Cart state is managed by a **Zustand store** in `hooks/use-cart.ts`. The store talks to `/api/cart` and syncs server state into local state after every mutation.

- Authenticated users: cart is stored in DB keyed by `userId`.
- Guests: cart is stored in DB keyed by a `sessionId` UUID set in an `httpOnly` cookie (`cart_session_id`).
- On the first authenticated GET to `/api/cart`, any guest cart is automatically merged into the user's cart and the guest cookie is cleared (`mergeGuestCartToUser` in `lib/cart-service.ts`).

### Checkout flow

`POST /api/checkout` handles the entire checkout atomically in a single `prisma.$transaction`: creates the `Address`, creates the `Order` with `OrderItem`s, and decrements product stock. Stock is validated before the transaction begins. Tax (10%) and shipping ($10 flat, free over $50) are defined in `lib/constants.ts` — update there to change pricing globally.

### Admin API protection

Admin API routes follow this pattern:
```ts
async function handleGET(req: NextRequest) { /* ... */ }
export const GET = withAdminAuth(handleGET);
```

`withAdminAuth` checks the DB for the ADMIN role on every call; it does not rely solely on the JWT.

### Rate limiting

`lib/rate-limit.ts` is an **in-memory** rate limiter. It works correctly in a single-process dev server but does not persist across serverless function instances (e.g. Vercel). For production scale, replace with a Redis-backed implementation (e.g. Upstash).

### Key lib files

| File | Purpose |
|------|---------|
| `lib/constants.ts` | `TAX_RATE`, `SHIPPING_COST`, `FREE_SHIPPING_THRESHOLD` |
| `lib/cart-service.ts` | All DB-level cart operations; used by `/api/cart/*` routes |
| `lib/api-security.ts` | `withAuth`, `withAdminAuth` HOFs; `getSecureHeaders()` |
| `lib/validation.ts` | Zod schemas for auth inputs (`SignUpSchema`, `SignInSchema`) |
| `lib/utils.ts` | `cn()`, `formatPrice()`, `slugify()`, `formatDate()` |

### Schema notes

- `Address.userId` is nullable (`String?`) — required for guest checkout.
- `Product.published` gates storefront visibility; `Product.isActive` gates admin soft-delete. Both must be considered when querying products for the storefront.
- After any schema change run `npm run prisma:generate` and create a migration with `npm run prisma:migrate`.

### Styling

Tailwind CSS v3. Custom colours: `sage-*` (green palette, primary brand colour) and `cream-*` (warm accent). The `font-heading` class references a CSS variable; the `font-sans` class uses `--font-sans` from the Next.js font loader. Use `cn()` from `lib/utils.ts` to merge Tailwind classes.

### Toast notifications

Use `toast` from `sonner` directly. The `showToast` wrapper in `components/ui/Toast.tsx` is a legacy helper — prefer the direct import.
