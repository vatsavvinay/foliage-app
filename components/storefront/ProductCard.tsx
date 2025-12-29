'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from './CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number | string;
  image?: string;
  slug: string;
}

export function ProductCard({ id, name, price, image, slug }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-sage-300 transition group bg-white">
      <Link href={`/products/${slug}`}>
        <div className="relative w-full h-64 bg-neutral-100 overflow-hidden">
          {image ? (
            <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
          )}
        </div>
      </Link>
      <div className="p-4 space-y-3">
        <Link href={`/products/${slug}`}>
          <h3 className="font-semibold text-neutral-900 group-hover:text-sage-600 transition line-clamp-2">{name}</h3>
        </Link>
        <p className="text-sage-600 font-bold">{formatPrice(price)}</p>
        <button
          type="button"
          onClick={() => {
            const numPrice = typeof price === 'string' ? parseFloat(price) : price;
            addToCart({ id, name, price: numPrice, image, slug });
          }}
          className="inline-flex items-center gap-2 rounded-full bg-sage-600 px-3 py-2 text-white text-sm font-semibold shadow-sm hover:bg-sage-700 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to bag
        </button>
      </div>
    </div>
  );
}
