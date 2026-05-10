"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);

  useEffect(() => {
    setShowWelcome(!localStorage.getItem('foliage_welcome_shown'));
  }, []);

  const dismiss = () => {
    localStorage.setItem('foliage_welcome_shown', 'true');
    setShowWelcome(false);
  };

  return (
    <>
      <AnimatePresence>
        {showWelcome === true && (
          <motion.div
            key="welcome"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[60] bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: 'url(/images/hydroponic_bg_hero.png)' }}
            onClick={dismiss}
          >
            <div className="flex items-center justify-center h-full bg-black/50">
              <div className="text-center text-white mx-auto px-4">
                <h1 className="text-4xl sm:text-6xl font-bold mb-4">Welcome to Foliage</h1>
                <p className="text-lg leading-relaxed">
                  Supporting a small business is supporting a DREAM.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden" id="home">
        <div className="absolute inset-0">
          <Image
            src="/images/hydroponic_bg_hero.png"
            alt="Hydroponic greens"
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl text-white space-y-6">
            <p className="text-sm font-semibold tracking-wide">Welcome to Foliage</p>
            <h1 className="text-3xl sm:text-5xl font-heading font-semibold leading-tight">
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

    </div>
  </>
  );
}
