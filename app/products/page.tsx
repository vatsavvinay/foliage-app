import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/storefront/ProductCard';
import { products as fallbackProducts } from '@/lib/products';

export default async function ProductsPage() {
  let products;

  try {
    products = await prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, slug: true, price: true, image: true },
    });
  } catch (e) {
    // If Prisma or DB is not available, use static fallback
    console.error('Prisma query failed, using fallback products', e);
    products = [];
  }

  // If DB has no products, use the static list in lib/products.ts
  if (!products || products.length === 0) {
    products = fallbackProducts.map((p) => ({ ...p, id: p.id, name: p.name, slug: p.slug, price: p.price, image: p.image }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold tracking-wide text-sage-700">Browse Greens</p>
        <h1 className="text-3xl font-heading font-semibold text-neutral-900">Fresh, clean, and ready to enjoy.</h1>
        <p className="text-neutral-700 leading-relaxed">
          Lettuce, basil, and spinach grown hydroponically with care—add them to your bag and taste the difference.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-neutral-500">No products available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              slug={p.slug}
              price={p.price.toString()}
              image={p.image ?? undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
