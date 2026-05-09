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
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">
          Add some products to get started!
        </p>
        <Link
          href="/products"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: CartItem) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 bg-white p-3 sm:p-4 rounded-lg shadow items-start sm:items-center"
            >
              <div className="relative w-20 sm:w-24 aspect-square flex-shrink-0 overflow-hidden rounded bg-neutral-100">
                <Image
                  src={item.image || "/images/placeholder.png"}
                  alt={item.name}
                  fill
                  loading="lazy"
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>
                <p className="text-green-600 font-bold">
                  ${item.price.toFixed(2)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    className="p-1 rounded border hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    className="p-1 rounded border hover:bg-gray-100"
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

              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <p className="font-bold">
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
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow lg:sticky lg:top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? "FREE" : `${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal < 50 && (
                <p className="text-sm text-green-600">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block w-full text-center py-3 text-green-600 hover:text-green-700 font-semibold mt-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}