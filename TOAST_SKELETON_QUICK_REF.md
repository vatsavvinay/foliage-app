# Toast & Skeleton Quick Reference

## 🎯 Quick Start

### Toast - Copy & Paste

```tsx
import { showToast } from '@/components/ui/Toast';

// Success
showToast.success('Action completed!');

// Error
showToast.error('Something went wrong');

// With description
showToast.success('Saved!', { description: 'Changes updated' });
```

### Skeleton - Copy & Paste

```tsx
import { Suspense } from 'react';
import { SkeletonGrid } from '@/components/ui/Skeleton';

export default function Page() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <YourComponent />
    </Suspense>
  );
}
```

---

## 📋 All Available Functions

### Toasts

| Function | Usage | Example |
|----------|-------|---------|
| `success()` | When action succeeds | `showToast.success('Saved!')` |
| `error()` | When action fails | `showToast.error('Failed to save')` |
| `info()` | General information | `showToast.info('Please check email')` |
| `warning()` | Before destructive action | `showToast.warning('This cannot be undone')` |
| `loading()` | Long operation | `const id = showToast.loading('Processing...')` |
| `dismiss()` | Close specific toast | `showToast.dismiss(toastId)` |
| `dismissAll()` | Close all toasts | `showToast.dismissAll()` |

### Skeletons

| Component | Usage | Props |
|-----------|-------|-------|
| `Skeleton` | Base placeholder | `className`, `animate` |
| `ProductCardSkeleton` | Product card loading | (none) |
| `TextSkeleton` | Text content loading | `lines?: number` |
| `ImageSkeleton` | Image loading | `aspect?: string` |
| `TableRowSkeleton` | Table row loading | `columns?: number` |
| `SkeletonGrid` | Multiple items | `count?: number`, `children?` |

---

## 🚀 Common Patterns

### Form Submission with Toast

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    showToast.success('Submitted!');
  } catch {
    showToast.error('Failed to submit');
  }
};
```

### Loading State with Skeleton

```tsx
<Suspense fallback={<SkeletonGrid count={6} />}>
  <ProductsList />
</Suspense>
```

### Button Click with Loading

```tsx
const [loading, setLoading] = useState(false);

const handleClick = async () => {
  setLoading(true);
  try {
    await action();
    showToast.success('Done!');
  } catch {
    showToast.error('Error!');
  } finally {
    setLoading(false);
  }
};

<button disabled={loading}>{loading ? 'Loading...' : 'Click'}</button>
```

---

## 📁 Implementation Status

### ✅ Already Integrated

- ProductCard → Toast on "Add to cart"
- CartDrawer → Toast on checkout success/error
- SignIn page → Toast on success/error
- Register page → Toast on success/error

### 📝 Ready to Integrate

Add to these pages/components:
- Admin dashboard → SkeletonGrid for loading
- Product detail page → ImageSkeleton + TextSkeleton
- Checkout → Toast progress updates
- Cart operations → Toast on remove/update

---

## 🎨 Styling

### Toast Position (edit `app/layout.tsx`)

```tsx
<Toaster position="bottom-right" /> // Change position here
```

Positions: `top-right`, `top-center`, `top-left`, `bottom-right`, `bottom-center`, `bottom-left`

### Skeleton Colors

Current: Gray-200 with pulse animation
To customize, edit `components/ui/Skeleton.tsx`:

```tsx
className="bg-gray-200 animate-pulse" // Change bg-gray-200 to other color
```

---

## 🔍 Type Checking

```tsx
// Toast has proper types
const showToast: {
  success: (msg: string, opts?: { description?: string }) => void;
  error: (msg: string, opts?: { description?: string }) => void;
  info: (msg: string, opts?: { description?: string }) => void;
  warning: (msg: string, opts?: { description?: string }) => void;
  loading: (msg: string) => string | number;
  dismiss: (id: string | number) => void;
  dismissAll: () => void;
}
```

---

## 🐛 Troubleshooting

**Toast not showing?**
- Check `<Toaster />` is in `app/layout.tsx`
- Verify using `'use client'` in components
- Check browser console for errors

**Skeleton not working?**
- Verify `animate-pulse` in Tailwind config
- Check Suspense boundary is correct
- Ensure component is marked `'use client'` if needed

---

## 📚 Full Docs

See `INTEGRATION_GUIDE.md` for comprehensive documentation with examples.
