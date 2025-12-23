import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number | string;
  image?: string;
  slug: string;
}

export function ProductCard({ id, name, price, image, slug }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`}>
      <div className="rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-sage-300 transition group">
        <div className="relative w-full h-64 bg-neutral-100 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-neutral-900 group-hover:text-sage-600 transition line-clamp-2">
            {name}
          </h3>
          <p className="text-sage-600 font-bold mt-2">{formatPrice(price)}</p>
        </div>
      </div>
    </Link>
  );
}
