import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { StatusUpdateForm } from './StatusUpdateForm';

type Params = {
  params: { id: string };
};

export default async function AdminOrderDetail({ params }: Params) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? 'CUSTOMER';
  if (!session || role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
      address: true,
      user: true,
    },
  });

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-neutral-600">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Order {order.id.slice(0, 8)}</h1>
          <p className="text-sm text-neutral-500">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Status: {order.status}</p>
          <p className="text-sm text-neutral-500">Total: ${order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-4">
        <Link href="/admin/orders" className="text-sm text-green-600 hover:text-green-800">
          ← Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Items</h2>
          <div className="space-y-3">
            {order.items.map((it) => (
              <div key={it.id} className="flex gap-3 items-start">
                <div className="relative w-16 aspect-square bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                  {it.product?.imageUrl ? (
                    <Image src={it.product.imageUrl} alt={it.product.name} fill loading="lazy" sizes="64px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">—</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{it.product?.name}</p>
                      <p className="text-sm text-neutral-500">Qty: {it.quantity}</p>
                    </div>
                    <div className="text-right font-semibold">${it.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-white border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Shipping</h2>
          {order.address ? (
            <div className="text-sm text-neutral-700">
              <div>{order.address.firstName} {order.address.lastName}</div>
              <div>{order.address.street}</div>
              <div>{order.address.city}, {order.address.state} {order.address.zipCode}</div>
              <div>{order.address.country}</div>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">No address on file</p>
          )}

          <div className="border-t pt-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-sm mt-2">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <StatusUpdateForm orderId={order.id} currentStatus={order.status} />
        </aside>
      </div>
    </div>
  );
}
