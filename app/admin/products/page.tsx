import { prisma } from '@/lib/prisma';
import { ProductManager } from '@/components/admin/ProductManager';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role ?? 'customer';
  if (!session || role !== 'admin') {
    redirect('/auth/signin');
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-neutral-900">Manage Products</h1>
        <p className="text-neutral-600">Add, publish, and update products for Browse Greens.</p>
      </div>
      <ProductManager products={products} categories={categories} />
    </div>
  );
}
