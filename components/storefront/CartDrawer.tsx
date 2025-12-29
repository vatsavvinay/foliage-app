'use client';

import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useCart } from './CartContext';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const { items, isOpen, closeDrawer, addToCart, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [checkoutState, setCheckoutState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const drawerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    function getFocusable() {
      if (!drawer) return [] as HTMLElement[];
      const els = Array.from(drawer.querySelectorAll(focusableSelector)) as HTMLElement[];
      return els.filter((el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusable();
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    if (isOpen) {
      // Save currently focused element to restore later
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Lock scrolling
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus first focusable element in drawer (close button)
      setTimeout(() => {
        const focusables = getFocusable();
        if (closeBtnRef.current) closeBtnRef.current.focus();
        else if (focusables[0]) focusables[0].focus();
      }, 50);

      document.addEventListener('keydown', onKeyDown);

      return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.body.style.overflow = prevOverflow;
        // Restore focus
        try {
          previousActiveElement.current?.focus();
        } catch (e) {
          // ignore
        }
      };
    }
  }, [isOpen, closeDrawer]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckoutState('loading');
    setCheckoutError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      if (res.status === 401) {
        router.push('/auth/signin');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Checkout failed');
      }
      setCheckoutState('success');
      clearCart();
      closeDrawer();
      router.push('/products');
    } catch (err: any) {
      setCheckoutState('error');
      setCheckoutError(err.message || 'Checkout failed');
    } finally {
      setCheckoutState('idle');
    }
  };

  return (
    <div aria-hidden={!isOpen} className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            aria-hidden={!isOpen}
            className={`fixed inset-0 bg-black/40`}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            ref={drawerRef}
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            aria-hidden={!isOpen}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed right-0 top-0 h-full w-full max-w-md md:max-w-lg bg-white shadow-2xl`}
          >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 id="cart-title" className="text-lg font-semibold">
            Your Cart
          </h3>
          <button
            ref={closeBtnRef}
            onClick={closeDrawer}
            aria-label="Close cart"
            className="p-2 hover:bg-neutral-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Polite live region to announce when cart opens */}
        <div className="sr-only" aria-live="polite">
          {isOpen ? 'Cart opened' : 'Cart closed'}
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {items.length === 0 && <p className="text-neutral-600">Your cart is empty.</p>}

          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-neutral-500">{formatPrice(item.price)}</div>
                    </div>
                    <div className="text-sm text-neutral-700">{formatPrice(item.price * item.quantity)}</div>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-neutral-100 rounded"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove one ${item.name}`}
                    >
                      -
                    </button>
                    <div className="text-sm" aria-live="polite">{item.quantity}</div>
                    <button
                      className="px-2 py-1 bg-neutral-100 rounded"
                      onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, slug: item.slug })}
                      aria-label={`Add one ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="text-neutral-600">Subtotal</div>
            <div className="font-semibold">{formatPrice(subtotal)}</div>
          </div>
          {checkoutError && <p className="text-sm text-red-600 mb-2">{checkoutError}</p>}

          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded bg-neutral-100" onClick={clearCart}>
              Empty Bag
            </button>
            <button
              className="flex-1 py-2 rounded bg-sage-600 text-white disabled:opacity-60"
              disabled={items.length === 0 || checkoutState === 'loading'}
              onClick={handleCheckout}
            >
              {checkoutState === 'loading' ? 'Processing…' : 'Go to Checkout'}
            </button>
          </div>
        </div>
      </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
