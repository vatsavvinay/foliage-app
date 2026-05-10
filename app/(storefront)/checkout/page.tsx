"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart, CartItem } from "@/hooks/use-cart";
import { toast } from "sonner";
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

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

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotal, fetchCart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.street.trim()) newErrors.street = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) newErrors.zipCode = "Enter a valid ZIP code";
    
    if (!session && !formData.guestEmail.trim()) newErrors.guestEmail = "Email is required for guest checkout";
    else if (formData.guestEmail && !/^\S+@\S+\.\S+$/.test(formData.guestEmail)) newErrors.guestEmail = "Enter a valid email";
    
    if (formData.phone && !/^[\d\s\-()+]*$/.test(formData.phone)) newErrors.phone = "Enter a valid phone number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => router.push("/products")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const subtotal = getTotal();
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validateForm()) {
      setSubmitError("Please fix the errors below and try again.");
      return;
    }
    
    setIsLoading(true);

    try {
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

      // Clear Zustand store — DB cart already cleared by the checkout API
      clearCart().catch(() => {});
      toast.success("Order placed successfully!");
      router.push(`/orders/${order.id}`);
    } catch (error: unknown) {
      const msg = (error as Error)?.message ?? "Failed to place order";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (fieldName: string) => `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
    errors[fieldName] ? 'border-red-500' : 'border-neutral-300'
  }`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm font-medium">{submitError}</p>
            </div>
          )}

          {!session && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Contact Information</h2>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.guestEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, guestEmail: e.target.value });
                    if (errors.guestEmail) setErrors({ ...errors, guestEmail: "" });
                  }}
                  className={inputClasses('guestEmail')}
                />
                {errors.guestEmail && <p className="text-red-600 text-xs">{errors.guestEmail}</p>}
              </div>
            </div>
          )}

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* First Name */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value });
                    if (errors.firstName) setErrors({ ...errors, firstName: "" });
                  }}
                  className={inputClasses('firstName')}
                />
                {errors.firstName && <p className="text-red-600 text-xs">{errors.firstName}</p>}
              </div>
              {/* Last Name */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
                    if (errors.lastName) setErrors({ ...errors, lastName: "" });
                  }}
                  className={inputClasses('lastName')}
                />
                {errors.lastName && <p className="text-red-600 text-xs">{errors.lastName}</p>}
              </div>
              {/* Street Address - full width */}
              <div className="sm:col-span-2 space-y-1">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={(e) => {
                    setFormData({ ...formData, street: e.target.value });
                    if (errors.street) setErrors({ ...errors, street: "" });
                  }}
                  className={inputClasses('street')}
                />
                {errors.street && <p className="text-red-600 text-xs">{errors.street}</p>}
              </div>
              {/* City */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (errors.city) setErrors({ ...errors, city: "" });
                  }}
                  className={inputClasses('city')}
                />
                {errors.city && <p className="text-red-600 text-xs">{errors.city}</p>}
              </div>
              {/* State */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                    if (errors.state) setErrors({ ...errors, state: "" });
                  }}
                  className={inputClasses('state')}
                />
                {errors.state && <p className="text-red-600 text-xs">{errors.state}</p>}
              </div>
              {/* ZIP Code */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => {
                    setFormData({ ...formData, zipCode: e.target.value });
                    if (errors.zipCode) setErrors({ ...errors, zipCode: "" });
                  }}
                  className={inputClasses('zipCode')}
                />
                {errors.zipCode && <p className="text-red-600 text-xs">{errors.zipCode}</p>}
              </div>
              {/* Phone */}
              <div className="sm:col-span-2 space-y-1">
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  className={inputClasses('phone')}
                />
                {errors.phone && <p className="text-red-600 text-xs">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
          >
            {isLoading ? "Processing..." : `Place Order - ${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow sticky bottom-0 lg:sticky lg:top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

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

            <div className="border-t pt-4 space-y-2">
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

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold">
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