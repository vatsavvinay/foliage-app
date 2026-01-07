"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart, CartItem } from "@/hooks/use-cart";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotal, fetchCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    phone: "",
    guestEmail: "",
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-heading font-semibold mb-4">Your cart is empty</h1>
        <button
          onClick={() => router.push("/products")}
          className="border-2 border-[var(--ink)] bg-sage-700 text-white px-6 py-3 rounded-full hover:bg-sage-800 shadow-[3px_3px_0_rgba(47,42,36,0.2)]"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      type CheckoutData = {
        shippingAddress: {
          firstName: string;
          lastName: string;
          street: string;
          city: string;
          state: string;
          zipCode: string;
          country: string;
          phone?: string;
        };
        paymentMethod: string;
        guestEmail?: string;
      };

      const checkoutData: CheckoutData = {
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: "credit_card",
      };

      if (!session && formData.guestEmail) {
        checkoutData.guestEmail = formData.guestEmail;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Checkout failed");
      }

      const order = await response.json();
      
      toast.success("Order placed successfully!");
      router.push(`/orders/${order.id}`);
    } catch (error: unknown) {
      toast.error((error as Error)?.message ?? "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-semibold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {!session && (
            <div className="sketch-panel p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Contact Information</h2>
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.guestEmail}
                onChange={(e) =>
                  setFormData({ ...formData, guestEmail: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-[var(--ink)] rounded-xl bg-[var(--paper)] focus:outline-none focus:ring-2 focus:ring-sage-600"
              />
            </div>
          )}

          <div className="sketch-panel p-6">
            <h2 className="text-xl font-heading font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="px-4 py-2 border-2 border-[var(--ink)] rounded-xl bg-[var(--paper)] focus:outline-none focus:ring-2 focus:ring-sage-600"
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="px-4 py-2 border-2 border-[var(--ink)] rounded-xl bg-[var(--paper)] focus:outline-none focus:ring-2 focus:ring-sage-600"
              />
              <input
                type="text"
                placeholder="Street Address"
                required
                value={formData.street}
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                className="sm:col-span-2 px-4 py-2 border-2 border-[var(--ink)] rounded-xl bg-[var(--paper)] focus:outline-none focus:ring-2 focus:ring-sage-600"
              />
              <input
                type="text"
                placeholder="City"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="px-4 py-2 border-2 border-[var(--ink)] rounded-xl bg-[var(--paper)] focus:outline-none focus:ring-2 focus:ring-sage-600"
              />
              <input
                type="text"
                placeholder="State"
                required
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="px-4 py-2 border-2 border-[var(--ink)] rounded-xl bg-[var(--paper)] focus:outline-none focus:ring-2 focus:ring-sage-600"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                required
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                className="px-4 py-2 border-2 border-[var(--ink)] rounded-xl bg-[var(--paper)] focus:outline-none focus:ring-2 focus:ring-sage-600"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="px-4 py-2 border-2 border-[var(--ink)] rounded-xl bg-[var(--paper)] focus:outline-none focus:ring-2 focus:ring-sage-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full border-2 border-[var(--ink)] bg-sage-700 text-white py-3 rounded-full hover:bg-sage-800 font-semibold disabled:opacity-50 shadow-[3px_3px_0_rgba(47,42,36,0.2)]"
          >
            {isLoading ? "Processing..." : `Place Order - ${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sketch-panel p-6 sticky top-4">
            <h2 className="text-xl font-heading font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-[var(--ink)] pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="border-t-2 border-[var(--ink)] pt-4 mt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
