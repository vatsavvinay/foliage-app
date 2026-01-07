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
    <div className="min-h-screen">
      <section className="relative overflow-hidden" id="home">
        <div className="absolute inset-0">
          <Image
            src="/images/hydroponic_sketch_bg.png"
            alt="Hydroponic greens"
            fill
            priority
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f6f2eb]/90 via-[#f6f2eb]/80 to-[#f6f2eb]" />
        </div>
        <div className="flex justify-end relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="sketch-panel max-w-2xl p-7 sm:p-10 space-y-6">
            <span className="sketch-tag">Welcome to Foliage</span>
            <h1 className="text-4xl sm:text-6xl font-heading font-semibold leading-tight text-neutral-900">
              <span className="sketch-underline">Fresh Greens</span>, <br /> Grown Smarter.
            </h1>
            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
              We grow lettuce, basil, and spinach the way they should be grown—fresh, clean, vibrant, and full of life.
              Hydroponically cultivated with precision and care, our greens are harvested at peak quality so they taste
              better, feel fresher, and nourish your family with confidence.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-sage-700 px-6 py-3 text-white font-semibold shadow-[3px_3px_0_rgba(47,42,36,0.25)] hover:bg-sage-800 transition"
              >
                Order Fresh Greens
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-[var(--paper)] px-6 py-3 text-neutral-900 font-semibold hover:bg-[var(--butter)] transition"
              >
                Learn About Our Farm
              </Link>
              <span className="hidden sm:inline-flex items-center text-sage-700">
                <svg viewBox="0 0 120 40" className="w-16 h-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M2 20c18-8 32-8 50 0s32 8 52 0" />
                  <path d="M96 10l14 10-14 10" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10" id="why-choose">
        <div className="sketch-panel p-8 sm:p-10 space-y-4">
          <span className="sketch-tag">Why Choose Foliage</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-neutral-900">
            {highlights.headline}
          </h2>
          <p className="text-neutral-700 leading-relaxed">{highlights.body}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="sketch-card p-6 sm:p-7 space-y-3">
            <p className="text-sm font-semibold tracking-wide text-sage-700">What We Grow</p>
            <h3 className="text-2xl font-heading font-semibold text-neutral-900 mt-2">
              Lettuce, Basil, Spinach.
            </h3>
            <p className="text-neutral-700 leading-relaxed mt-3">{whatWeGrow}</p>
          </div>

          <div className="sketch-card p-6 sm:p-7 space-y-3">
            <p className="text-sm font-semibold tracking-wide text-sage-700">Our Promise</p>
            <h3 className="text-2xl font-heading font-semibold text-neutral-900">Always fresh. Always clean.</h3>
            <p className="text-neutral-700 leading-relaxed">
              Great food starts with great growing. Every batch is nurtured with attention, integrity, and responsibility—
              so what reaches your plate is produce we’re truly proud of.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="sketch-panel p-8 sm:p-10 space-y-4" id="why-hydroponics">
          <span className="sketch-tag">Why Hydroponics?</span>
          <h3 className="text-2xl sm:text-3xl font-heading font-semibold text-neutral-900">
            Better for you. Better for our planet.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-700 leading-relaxed">
            <ul className="sketch-outline bg-[var(--paper-light)] p-5 space-y-2">
              {hydroponicsLeft.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="sketch-outline bg-[var(--paper-light)] p-5 space-y-2">
              {hydroponicsRight.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sketch-card p-7 sm:p-8 space-y-3" id="meet-foliage">
          <span className="sketch-tag">Meet Foliage</span>
          <h3 className="text-2xl font-heading font-semibold text-neutral-900">From our dream to your table.</h3>
          <p className="text-neutral-700 leading-relaxed">
            Foliage isn’t just a business—it’s a passion project built with dedication, love, and belief in better food.
            Supporting a small business is supporting a dream. Thank you for helping something meaningful grow.
          </p>
        </div>

        <div className="sketch-panel p-8 sm:p-9 space-y-4">
          <span className="sketch-tag">Get Fresh Greens Easily</span>
          <h3 className="text-2xl font-heading font-semibold text-neutral-900">Simple. Fresh. Honest.</h3>
          <div className="space-y-2 text-neutral-700 leading-relaxed">
            {[
              "Explore our fresh produce.",
              "Place your order.",
              "Receive freshly harvested greens straight from our farm.",
            ].map((step) => (
              <div key={step} className="flex items-start gap-2">
                <Sprout className="w-4 h-4 text-sage-700 mt-0.5" />
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
                className="sketch-card overflow-hidden"
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
                  <span className="sketch-tag">Hydroponic freshness</span>
                  <h3 className="text-2xl font-heading font-semibold text-neutral-900">{product.name}</h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {product.description ||
                      "Crisp, clean, and harvested at peak freshness for everyday meals."}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {product.name.toLowerCase().includes("lettuce") && (
                      <>
                        <span className="sketch-outline bg-[var(--paper-light)] px-3 py-1 text-sage-800">
                          Zero pesticides
                        </span>
                        <span className="sketch-outline bg-[var(--paper-light)] px-3 py-1 text-sage-800">
                          No washing required
                        </span>
                        <span className="sketch-outline bg-[var(--paper-light)] px-3 py-1 text-sage-800">
                          Stays crisp longer
                        </span>
                      </>
                    )}
                    {product.name.toLowerCase().includes("basil") && (
                      <>
                        <span className="sketch-outline bg-[var(--paper-light)] px-3 py-1 text-sage-800">
                          Greenhouse grown
                        </span>
                        <span className="sketch-outline bg-[var(--paper-light)] px-3 py-1 text-sage-800">
                          Hand-trimmed leaves
                        </span>
                        <span className="sketch-outline bg-[var(--paper-light)] px-3 py-1 text-sage-800">
                          Bold aroma
                        </span>
                      </>
                    )}
                    {product.name.toLowerCase().includes("spinach") && (
                      <>
                        <span className="sketch-outline bg-[var(--paper-light)] px-3 py-1 text-sage-800">
                          Tender baby leaves
                        </span>
                        <span className="sketch-outline bg-[var(--paper-light)] px-3 py-1 text-sage-800">
                          Ready to eat
                        </span>
                        <span className="sketch-outline bg-[var(--paper-light)] px-3 py-1 text-sage-800">
                          Naturally sweet
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => addItem(product.id)}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-sage-700 px-4 py-2 text-white font-semibold shadow-[3px_3px_0_rgba(47,42,36,0.2)] hover:bg-sage-800 transition"
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
