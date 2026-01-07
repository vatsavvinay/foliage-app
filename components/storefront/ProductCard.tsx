"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart'; // ✅ Changed import path

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string | null;
  stock: number;
}

export default function ProductCard({
  id,
  name,
  slug,
  description,
  price,
  image,
  stock,
}: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="sketch-card overflow-hidden transition-transform hover:-translate-y-1">
      <Link href={`/products/${slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={image || '/images/placeholder.png'}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link href={`/products/${slug}`}>
          <h3 className="text-lg font-heading font-semibold text-neutral-900 hover:text-sage-700 mb-2">
            {name}
          </h3>
        </Link>

        {description && (
          <p className="text-sm text-neutral-700 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold text-sage-700">
            {formatPrice(price)}
          </span>

          <button
            onClick={() => addItem(id)}
            disabled={stock === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[var(--ink)] font-semibold transition-colors ${
              stock === 0
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-sage-600 text-white hover:bg-sage-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {stock === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>

        {stock > 0 && stock < 10 && (
          <p className="text-xs text-amber-700 mt-2">
            Only {stock} left in stock
          </p>
        )}
      </div>
    </div>
  );
}
