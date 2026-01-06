"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Sprout } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  description?: string;
}

const highlights = {
  title: "Why Choose Foliage",
  headline: "Fresh food should feel alive.",
  body:
    "It should crunch, burst with flavor, and never travel thousands of miles to reach your plate. Our controlled hydroponic environment lets us grow smarter, cleaner, and more sustainably—so every leaf tells a story of freshness and care.",
};

const whatWeGrow =
  "Crisp, refreshing lettuce for everyday meals. Fragrant, aromatic basil bursting with flavor. Tender, nutrient-dense spinach harvested fresh for salads, smoothies, and hearty bowls.";

const hydroponicsLeft = [
  "💧 Less water waste",
  "❌ No soil contamination",
  "🌱 Faster, healthier plant growth",
];

const hydroponicsRight = [
  "🧪 Controlled environment = consistent quality",
  "🥗 Fresh greens available year-round",
  "📍 Closer to home, fresher to your table",
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/product");
        const data = await response.json();
        setProducts(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden" id="home">
        <div className="absolute inset-0">
          <Image
            src="/images/hydroponic-bg.jpg"
            alt="Hydroponic greens"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl text-white space-y-6">
            <p className="text-sm font-semibold tracking-wide">Welcome to Foliage</p>
            <h1 className="text-5xl sm:text-6xl font-heading font-semibold leading-tight">
              Fresh Greens, <br /> Grown Smarter.
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              We grow lettuce, basil, and spinach the way they should be grown—fresh, clean, vibrant, and full of life.
              Hydroponically cultivated with precision and care, our greens are harvested at peak quality so they taste
              better, feel fresher, and nourish your family with confidence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-white font-semibold shadow-md hover:bg-green-600 transition"
              >
                Order Fresh Greens
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-white font-semibold hover:bg-white/10 transition"
              >
                Learn About Our Farm
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10" id="why-choose">
        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-wide text-green-700">Why Choose Foliage</p>
          <h2 className="text-3xl font-heading font-semibold text-neutral-900">{highlights.headline}</h2>
          <p className="text-neutral-700 leading-relaxed">{highlights.body}</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold tracking-wide text-green-700">What We Grow</p>
          <h3 className="text-2xl font-heading font-semibold text-neutral-900 mt-2">Lettuce, Basil, Spinach.</h3>
          <p className="text-neutral-700 leading-relaxed mt-3">{whatWeGrow}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-wide text-green-700">Our Promise</p>
          <h3 className="text-2xl font-heading font-semibold text-neutral-900">Always fresh. Always clean.</h3>
          <p className="text-neutral-700 leading-relaxed">
            Great food starts with great growing. Every batch is nurtured with attention, integrity, and responsibility—
            so what reaches your plate is produce we’re truly proud of.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="space-y-4" id="why-hydroponics">
          <p className="text-sm font-semibold tracking-wide text-green-700">Why Hydroponics?</p>
          <h3 className="text-2xl font-heading font-semibold text-neutral-900">Better for you. Better for our planet.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-700 leading-relaxed">
            <ul className="space-y-2">
              {hydroponicsLeft.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="space-y-2">
              {hydroponicsRight.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3" id="meet-foliage">
          <p className="text-sm font-semibold tracking-wide text-green-700">Meet Foliage</p>
          <h3 className="text-2xl font-heading font-semibold text-neutral-900">From our dream to your table.</h3>
          <p className="text-neutral-700 leading-relaxed">
            Foliage isn’t just a business—it’s a passion project built with dedication, love, and belief in better food.
            Supporting a small business is supporting a dream. Thank you for helping something meaningful grow.
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm space-y-4">
          <p className="text-sm font-semibold tracking-wide text-green-700">Get Fresh Greens Easily</p>
          <h3 className="text-2xl font-heading font-semibold text-neutral-900">Simple. Fresh. Honest.</h3>
          <div className="space-y-2 text-neutral-700 leading-relaxed">
            {[
              "Explore our fresh produce.",
              "Place your order.",
              "Receive freshly harvested greens straight from our farm.",
            ].map((step) => (
              <div key={step} className="flex items-start gap-2">
                <Sprout className="w-4 h-4 text-green-700 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="browse-greens">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="text-neutral-600">Loading products…</div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden"
              >
                <div className="relative h-56">
                  <Image
                    src={product.image || "/images/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-xs font-semibold tracking-wide text-green-700">Hydroponic freshness</p>
                  <h3 className="text-2xl font-heading font-semibold text-neutral-900">{product.name}</h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {product.description ||
                      "Crisp, clean, and harvested at peak freshness for everyday meals."}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {product.name.toLowerCase().includes("lettuce") && (
                      <>
                        <span className="rounded-full border border-neutral-200 px-3 py-1 text-green-800">
                          Zero pesticides
                        </span>
                        <span className="rounded-full border border-neutral-200 px-3 py-1 text-green-800">
                          No washing required
                        </span>
                        <span className="rounded-full border border-neutral-200 px-3 py-1 text-green-800">
                          Stays crisp longer
                        </span>
                      </>
                    )}
                    {product.name.toLowerCase().includes("basil") && (
                      <>
                        <span className="rounded-full border border-neutral-200 px-3 py-1 text-green-800">
                          Greenhouse grown
                        </span>
                        <span className="rounded-full border border-neutral-200 px-3 py-1 text-green-800">
                          Hand-trimmed leaves
                        </span>
                        <span className="rounded-full border border-neutral-200 px-3 py-1 text-green-800">
                          Bold aroma
                        </span>
                      </>
                    )}
                    {product.name.toLowerCase().includes("spinach") && (
                      <>
                        <span className="rounded-full border border-neutral-200 px-3 py-1 text-green-800">
                          Tender baby leaves
                        </span>
                        <span className="rounded-full border border-neutral-200 px-3 py-1 text-green-800">
                          Ready to eat
                        </span>
                        <span className="rounded-full border border-neutral-200 px-3 py-1 text-green-800">
                          Naturally sweet
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => addItem(product.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-white font-semibold hover:bg-green-800 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to bag
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
