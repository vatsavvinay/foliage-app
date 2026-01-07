"use client";

import { useEffect } from "react";
import { useCart, CartItem } from "@/hooks/use-cart";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const {
    items,
    isLoading,
    fetchCart,
    updateQuantity,
    removeItem,
    getTotal,
  } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-heading font-semibold mb-4">Your cart is empty</h1>
        <p className="text-neutral-700 mb-8">
          Add some products to get started!
        </p>
        <Link
          href="/products"
          className="inline-block border-2 border-[var(--ink)] bg-sage-700 text-white px-6 py-3 rounded-full hover:bg-sage-800 shadow-[3px_3px_0_rgba(47,42,36,0.2)]"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-semibold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: CartItem) => (
            <div
              key={item.id}
              className="sketch-card flex gap-4 p-4"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.image || "/images/placeholder.png"}
                  alt={item.name}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg">
                  {item.name}
                </h3>
                <p className="text-sage-700 font-semibold">
                  ${item.price.toFixed(2)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    className="p-1 rounded-full border-2 border-[var(--ink)] hover:bg-[var(--butter)]"
                    disabled={isLoading}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    className="p-1 rounded-full border-2 border-[var(--ink)] hover:bg-[var(--butter)]"
                    disabled={
                      isLoading || (item.quantity >= ((item as CartItem).stock ?? 0))
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {item.quantity >= ((item as CartItem).stock ?? 0) && (
                  <p className="text-sm text-red-600 mt-1">
                    Max stock reached
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                  disabled={isLoading}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sketch-panel p-6 sticky top-4">
            <h2 className="text-xl font-heading font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span>{shipping === 0 ? "FREE" : `${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal < 50 && (
                <p className="text-sm text-sage-700">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>

            <div className="border-t-2 border-[var(--ink)] pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full border-2 border-[var(--ink)] bg-sage-700 text-white text-center py-3 rounded-full hover:bg-sage-800 font-semibold shadow-[3px_3px_0_rgba(47,42,36,0.2)]"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block w-full text-center py-3 text-sage-700 hover:text-sage-800 font-semibold mt-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
