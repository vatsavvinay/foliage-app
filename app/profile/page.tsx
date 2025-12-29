import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/signin');

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold tracking-wide text-sage-700">Profile</p>
        <h1 className="text-3xl font-heading font-semibold text-neutral-900">Welcome back, {session.user.name || 'Friend'}.</h1>
        <p className="text-neutral-700">Email: {session.user.email}</p>
        <p className="text-neutral-700">Role: {(session.user as any).role || 'customer'}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-heading font-semibold text-neutral-900">Recent Orders</h2>
        {orders.length === 0 && <p className="text-neutral-600">No orders yet.</p>}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-neutral-200 rounded-2xl p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Order ID: {order.id}</p>
                  <p className="text-neutral-800">Status: {order.status}</p>
                </div>
                <div className="font-semibold text-sage-700">{formatPrice(parseFloat(order.totalPrice.toString()))}</div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(parseFloat(item.price.toString()) * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
