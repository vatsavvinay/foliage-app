import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Foliage',
  description: 'Manage products and orders',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? 'CUSTOMER';
  if (!session || role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="flex">
      {/* Sidebar - Placeholder */}
      <aside className="w-64 bg-neutral-900 text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <a href="/admin" className="block px-4 py-2 hover:bg-neutral-800 rounded">
            Dashboard
          </a>
          <a href="/admin/products" className="block px-4 py-2 hover:bg-neutral-800 rounded">
            Products
          </a>
          <a href="/admin/categories" className="block px-4 py-2 hover:bg-neutral-800 rounded">
            Categories
          </a>
          <a href="/admin/orders" className="block px-4 py-2 hover:bg-neutral-800 rounded">
            Orders
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
