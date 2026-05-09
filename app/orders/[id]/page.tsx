import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
      address: true,
    },
  }).catch(() => null);

  if (!order) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-3">
        <CheckCircle className="w-14 h-14 text-green-600 mx-auto" />
        <h1 className="text-3xl font-bold text-neutral-900">Order Confirmed!</h1>
        <p className="text-neutral-600">
          Thank you for your order. We'll get your fresh greens to you soon.
        </p>
        <p className="text-sm text-neutral-400">Order ID: {order.id}</p>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-semibold text-lg text-neutral-900">Items Ordered</h2>
        <div className="divide-y divide-neutral-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-3 text-sm">
              <span className="text-neutral-800">
                {item.product.name}{" "}
                <span className="text-neutral-400">x{item.quantity}</span>
              </span>
              <span className="font-medium text-neutral-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Shipping</span>
            <span>{order.shippingCost === 0 ? "FREE" : `$${order.shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-bold text-neutral-900 text-base pt-2 border-t">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {order.address && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-2">
          <h2 className="font-semibold text-lg text-neutral-900">Shipping To</h2>
          <p className="text-sm text-neutral-700">
            {order.address.firstName} {order.address.lastName}
          </p>
          <p className="text-sm text-neutral-700">{order.address.street}</p>
          <p className="text-sm text-neutral-700">
            {order.address.city}, {order.address.state} {order.address.zipCode}
          </p>
          <p className="text-sm text-neutral-700">{order.address.country}</p>
        </div>
      )}

      <div className="text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
