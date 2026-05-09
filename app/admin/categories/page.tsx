import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? 'CUSTOMER';
  if (!session || role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Categories</h1>
        <p className="text-neutral-600">Manage product categories used across the store.</p>
      </div>

      <div className="mt-6 bg-white border border-neutral-200 rounded-lg p-4 sm:p-6">
        {categories.length === 0 ? (
          <p className="text-neutral-600">No categories yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-lg border p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">{cat.name}</p>
                  <p className="text-xs text-neutral-500">{cat.slug}</p>
                </div>
                <div className="text-sm text-neutral-500">{new Date(cat.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
