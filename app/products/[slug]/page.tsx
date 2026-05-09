"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  stock: number;
  category?: { name: string } | null;
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/product?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        // API returns an array; find the matching slug
        const found = Array.isArray(data)
          ? data.find((p: Product) => p.slug === slug)
          : data;
        if (!found) throw new Error("Not found");
        setProduct(found);
      } catch {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addItem(product.id);
      toast.success(`${product.name} added to cart`, {
        description: "View your cart to checkout",
      });
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-neutral-500">
        Loading…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-neutral-600">Product not found.</p>
        <button
          onClick={() => router.push("/products")}
          className="text-green-600 hover:underline text-sm"
        >
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100">
          <Image
            src={product.imageUrl || "/images/placeholder.png"}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="space-y-5 flex flex-col justify-center">
          {product.category && (
            <p className="text-sm font-semibold tracking-wide text-green-700">
              {product.category.name}
            </p>
          )}
          <h1 className="text-3xl font-heading font-semibold text-neutral-900">
            {product.name}
          </h1>
          {product.description && (
            <p className="text-neutral-700 leading-relaxed">{product.description}</p>
          )}
          <p className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</p>

          {product.stock > 0 && product.stock < 10 && (
            <p className="text-xs text-orange-600">Only {product.stock} left in stock</p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition ${
              product.stock === 0
                ? "bg-neutral-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } disabled:opacity-60`}
          >
            <ShoppingBag className="w-5 h-5" />
            {product.stock === 0 ? "Out of Stock" : adding ? "Adding…" : "Add to Bag"}
          </button>
        </div>
      </div>
    </div>
  );
}
