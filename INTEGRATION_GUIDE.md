# Toast & Skeleton Integration Guide

This guide shows how to use the newly implemented Toast notifications and Skeleton loaders for improved UX.

## Toast Notifications

Toast notifications provide visual feedback for user actions. They auto-dismiss after 3 seconds and appear in the bottom-right corner.

### Basic Usage

```tsx
import { showToast } from '@/components/ui/Toast';

// Success toast
showToast.success('Added to cart');

// Error toast
showToast.error('Something went wrong');

// Info toast
showToast.info('Please check your email');

// Warning toast
showToast.warning('This action cannot be undone');
```

### With Description

```tsx
showToast.success('Order placed successfully!', {
  description: 'You will receive a confirmation email shortly'
});
```

### Loading Toast

```tsx
const toastId = showToast.loading('Processing your order...');

// Later, dismiss or update
showToast.dismiss(toastId);
```

### Using the Hook

```tsx
'use client';

import { useToast } from '@/components/ui/Toast';

export function MyComponent() {
  const toast = useToast();
  
  const handleClick = () => {
    toast.success('Item added!');
  };
  
  return <button onClick={handleClick}>Add Item</button>;
}
```

### Already Integrated In

- ✅ ProductCard - Shows toast when item added to cart
- ✅ CartDrawer - Shows toast on checkout success/error
- ✅ Sign In - Shows toast on success and error
- ✅ Register - Shows toast on success and error

---

## Skeleton Loaders

Skeleton loaders show placeholder content while data is loading, improving perceived performance.

### Using Skeletons with Suspense

```tsx
'use client';

import { Suspense } from 'react';
import { ProductCardSkeleton, SkeletonGrid } from '@/components/ui/Skeleton';

// Show skeletons while loading
export default function ProductsPage() {
  return (
    <Suspense fallback={<SkeletonGrid count={6} />}>
      <ProductList />
    </Suspense>
  );
}

async function ProductList() {
  const products = await fetchProducts();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(p => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
```

### Base Skeleton Component

```tsx
import { Skeleton } from '@/components/ui/Skeleton';

// Basic usage - pulse animation enabled by default
<Skeleton className="h-6 w-3/4" />

// Disable animation
<Skeleton className="h-6 w-3/4" animate={false} />

// Custom sizing
<Skeleton className="h-8 w-full rounded-lg" />
```

### ProductCardSkeleton

Perfect for product listings:

```tsx
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {Array(3).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
</div>
```

### TextSkeleton

For text content:

```tsx
import { TextSkeleton } from '@/components/ui/Skeleton';

// Multiple lines of text
<TextSkeleton lines={3} />

// Custom number of lines
<TextSkeleton lines={5} />
```

### ImageSkeleton

For images:

```tsx
import { ImageSkeleton } from '@/components/ui/Skeleton';

// Default aspect ratio (4/3)
<ImageSkeleton />

// Custom aspect ratio
<ImageSkeleton aspect="16/9" />
<ImageSkeleton aspect="1/1" />
<ImageSkeleton aspect="3/2" />
```

### TableRowSkeleton

For data tables:

```tsx
import { TableRowSkeleton } from '@/components/ui/Skeleton';

<table>
  <tbody>
    {Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} columns={4} />)}
  </tbody>
</table>
```

### SkeletonGrid

Multi-item grid loading:

```tsx
import { SkeletonGrid, ProductCardSkeleton } from '@/components/ui/Skeleton';

// Default: 6 ProductCardSkeletons in 3-column grid
<SkeletonGrid />

// Custom count
<SkeletonGrid count={8} />

// Custom children
<SkeletonGrid count={4}>
  <ImageSkeleton aspect="1/1" />
</SkeletonGrid>
```

---

## Integration Examples

### Product Listing with Loading State

```tsx
'use client';

import { Suspense } from 'react';
import { SkeletonGrid, ProductCardSkeleton } from '@/components/ui/Skeleton';
import ProductCard from '@/components/storefront/ProductCard';
import { getProducts } from '@/lib/api';

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <Suspense fallback={<SkeletonGrid count={6} />}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}

async function ProductGrid() {
  const products = await getProducts();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(p => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
```

### Form with Toast Feedback

```tsx
'use client';

import { useState } from 'react';
import { showToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(e.currentTarget),
      });
      
      if (!res.ok) throw new Error('Failed to send');
      
      showToast.success('Message sent!', {
        description: 'We will get back to you soon.'
      });
      
      e.currentTarget.reset();
    } catch (err) {
      showToast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="email" name="email" placeholder="Your email" required />
      <Input type="text" name="subject" placeholder="Subject" required />
      <Button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
```

### Data Table with Loading State

```tsx
'use client';

import { Suspense } from 'react';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { getOrders } from '@/lib/api';

export function OrdersTable() {
  return (
    <Suspense fallback={<OrdersTableSkeleton />}>
      <OrdersTableContent />
    </Suspense>
  );
}

function OrdersTableSkeleton() {
  return (
    <table className="w-full">
      <tbody>
        {Array(5).fill(0).map((_, i) => (
          <TableRowSkeleton key={i} columns={4} />
        ))}
      </tbody>
    </table>
  );
}

async function OrdersTableContent() {
  const orders = await getOrders();
  
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            <td>${order.total}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## Best Practices

### Toast Notifications

- Use **success** for completed actions (add to cart, form submission)
- Use **error** for failures and validation errors
- Use **warning** for potentially destructive actions
- Use **info** for helpful information
- Keep messages short and actionable
- Avoid overwhelming users with multiple toasts

### Skeleton Loaders

- Match the aspect ratio and size of actual content
- Use appropriate skeleton components for your content type
- Keep skeleton animation subtle (disabled for some use cases)
- Don't show skeletons for very fast-loading content (<200ms)
- Consider showing actual content fragments while loading

---

## Files Modified

### New Components
- `components/ui/Toast.tsx` - Toast provider and utilities
- `components/ui/Skeleton.tsx` - Skeleton loader components

### Updated Components
- `components/ui/index.ts` - Exports Toast and Skeleton
- `components/storefront/CartDrawer.tsx` - Toast integration
- `components/storefront/ProductCard.tsx` - Toast on add to cart
- `app/auth/signin/page.tsx` - Toast on sign in
- `app/auth/register/page.tsx` - Toast on registration

---

## Customization

### Toast Position (in layout.tsx)

```tsx
<Toaster
  position="top-right"      // or "bottom-right", "top-left", "bottom-left", etc.
  theme="light"             // or "dark"
  richColors                // Enable colorful backgrounds
  duration={3000}           // Auto-dismiss time in ms
  visibleToasts={3}         // Max visible toasts
/>
```

### Skeleton Animation

```tsx
// Disable animation globally
<Skeleton animate={false} className="h-6 w-full" />

// Custom animation classes
<div className="animate-bounce">
  <Skeleton animate={false} className="h-6 w-full" />
</div>
```

---

## Troubleshooting

### Toasts not appearing?

1. Verify `<ToastProvider />` or `<Toaster />` is in your layout
2. Check that you're using `'use client'` in components
3. Ensure Sonner is installed: `npm list sonner`

### Skeletons not animating?

1. Verify Tailwind CSS `animate-pulse` class is available
2. Check that `animate` prop is `true` (default)
3. Confirm Tailwind build includes animations

### TypeScript errors?

1. Ensure `@types/react` is up to date
2. Regenerate types: `npm run generate-types` or `npx tsc --noEmit`

---

## Next Steps

Consider implementing:

- ✅ Toast notifications for checkout process
- ✅ Skeleton loaders in admin dashboard
- ✅ Loading states for user profile
- Animated page transitions
- Optimistic UI updates with toast rollback
- Error boundary integration with toast errors
