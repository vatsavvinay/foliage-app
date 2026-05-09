"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart'; // ✅ Changed import path
import { showToast } from '@/components/ui/Toast';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string | null;
  stock?: number;
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

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addItem(id);
    showToast.success(`${name} added to cart`, {
      description: 'View your cart to checkout'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${slug}`}>
        <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[4/3]">
          <Image
            src={image || '/images/placeholder.png'}
            alt={name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-3 sm:p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-green-600 mb-1 sm:mb-2">
            {name}
          </h3>
        </Link>

        {description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg sm:text-2xl font-bold text-green-600">
            {formatPrice(price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
              stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {stock === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>

        {stock !== undefined && stock > 0 && stock < 10 && (
          <p className="text-xs text-orange-600 mt-2">
            Only {stock} left in stock
          </p>
        )}
      </div>
    </div>
  );
}
