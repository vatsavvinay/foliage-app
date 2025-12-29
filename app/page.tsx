'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Droplets, Leaf, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/storefront/CartContext';

const GOODLEAF_PRIMARY = '#1f6b3f';
const GOODLEAF_ACCENT = '#44c455';

const highlights = [
  {
    title: 'Pesticide-Free & Soil-Free',
    description: 'Clean greens grown in a controlled, soil-free environment.',
    icon: Leaf,
  },
  {
    title: 'Uses Less Water',
    description: 'Hydroponics reduces water waste for smarter farming.',
    icon: Droplets,
  },
  {
    title: 'Locally Produced',
    description: 'Grown close to home for peak freshness.',
    icon: MapPin,
  },
  {
    title: 'Consistent Quality',
    description: 'Harvested at peak flavor for vibrant crunch and taste.',
    icon: CalendarDays,
  },
];

const products = [
  {
    id: 'lettuce',
    title: 'Lettuce',
    subtitle: 'Crisp, frilled leaves that bring fresh crunch to salads, wraps, and sandwiches.',
    benefits: ['Zero pesticides', 'No washing required', 'Stays crisp longer'],
    price: 4.5,
    image: '/images/lettuce.jpg',
  },
  {
    id: 'basil',
    title: 'Basil',
    subtitle: 'Sweet, aromatic basil harvested at peak flavour for pesto, pizzas, and pastas.',
    benefits: ['Greenhouse grown', 'Hand-trimmed leaves', 'Bold aroma'],
    price: 3.75,
    image: '/images/basil.jpg',
  },
  {
    id: 'baby-spinach',
    title: 'Baby Spinach',
    subtitle: 'Tender, nutrient-dense spinach that elevates smoothies, bowls, and sautés.',
    benefits: ['Tender baby leaves', 'Ready to eat', 'Naturally sweet'],
    price: 4.0,
    image: '/images/spinach.jpeg',
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const { addToCart } = useCart();

  return (
    <div className="bg-white">
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-screen flex items-center"
      >
        <motion.div style={{ opacity: bgOpacity, scale: bgScale }} className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/hydroponic-bg.jpg"
            alt="Hydroponic indoor farm background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/45" />
        </motion.div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold tracking-wide text-sage-100">Welcome to Foliage</p>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md font-heading">
              Fresh Greens, Grown Smarter.
            </h1>
            <p className="text-lg text-neutral-100 font-semibold drop-shadow-sm leading-relaxed">
              We grow lettuce, basil, and spinach the way they should be grown—fresh, clean, vibrant, and full of life.
              Hydroponically cultivated with precision and care, our greens are harvested at peak quality so they taste
              better, feel fresher, and nourish your family with confidence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#lettuce"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-white font-bold shadow-lg shadow-sage-200 transition"
                style={{ backgroundColor: GOODLEAF_PRIMARY }}
              >
                Shop Now
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-white font-bold shadow-lg shadow-neutral-300 transition"
                style={{ backgroundColor: GOODLEAF_ACCENT }}
              >
                Order Fresh Greens
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-white font-semibold hover:bg-white/10 transition"
              >
                Learn About Our Farm
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4">
              {highlights.slice(0, 2).map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-sage-100" />
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-neutral-100">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-3xl border border-white/25 bg-white/10 backdrop-blur-xl shadow-2xl shadow-sage-100 p-8 space-y-4">
            <p className="text-sm font-semibold tracking-wide text-sage-100">Why it matters</p>
            <p className="text-neutral-100 text-lg">
              Hydroponic vertical farms use less water, keep greens protected, and deliver consistent quality. Your
              favorite lettuce, basil, and baby spinach stay crisp longer and are ready to eat without pesticides.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="highlights">
        <div className="max-w-3xl space-y-3 mb-8">
          <p className="text-sm font-semibold tracking-wide text-sage-700">Why Choose Foliage</p>
          <h2 className="text-3xl font-heading font-semibold text-neutral-900">Fresh food should feel alive.</h2>
          <p className="text-neutral-700 leading-relaxed">
            It should crunch, burst with flavor, and never travel thousands of miles to reach your plate. Our controlled
            hydroponic environment lets us grow smarter, cleaner, and more sustainably—so every leaf tells a story of
            freshness and care.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-sage-100 p-3">
                  <item.icon className="w-5 h-5 text-sage-700" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{item.title}</p>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl border border-neutral-200 bg-white/90 backdrop-blur p-8 shadow-sm space-y-3">
          <p className="text-sm font-semibold tracking-wide text-sage-700">What We Grow</p>
          <h2 className="text-3xl font-heading font-semibold text-neutral-900">Lettuce, Basil, Spinach.</h2>
          <p className="text-neutral-700 leading-relaxed">
            Crisp, refreshing lettuce for everyday meals. Fragrant, aromatic basil bursting with flavor. Tender,
            nutrient-dense spinach harvested fresh for salads, smoothies, and hearty bowls.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="greens">
        {/* Framer Motion reveal with staggered children */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              id={product.id}
              className="group rounded-3xl border border-neutral-200 overflow-hidden shadow-sm bg-white/80 backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="relative h-64 bg-neutral-50">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1024px) 32vw, (min-width: 768px) 48vw, 100vw"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6 space-y-3">
                <p className="text-xs font-semibold tracking-wide text-sage-700">Hydroponic freshness</p>
                <h2 className="text-2xl font-heading font-semibold text-neutral-900">{product.title}</h2>
                <p className="text-neutral-800">{product.subtitle}</p>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="rounded-full bg-sage-50 px-3 py-1 text-sm font-medium text-sage-800 border border-sage-100"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.title,
                      price: product.price,
                      image: product.image,
                      slug: product.id,
                    })
                  }
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-sage-600 px-4 py-2 text-white font-semibold shadow-sm hover:bg-sage-700 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to bag
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-wide text-sage-700">Our Promise</p>
          <h3 className="text-2xl font-heading font-semibold text-neutral-900">Always fresh. Always clean.</h3>
          <p className="text-neutral-700 leading-relaxed">
            Great food starts with great growing. Every batch is nurtured with attention, integrity, and responsibility—
            so what reaches your plate is produce we’re truly proud of.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-neutral-800">
            {['Always Fresh', 'Always Clean', 'Always Grown with Heart'].map((item) => (
              <span key={item} className="rounded-full bg-sage-50 px-3 py-1 border border-sage-100 font-semibold text-sage-800">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-wide text-sage-700">Why Hydroponics?</p>
          <h3 className="text-2xl font-heading font-semibold text-neutral-900">Better for you. Better for our planet.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-700 leading-relaxed">
            <ul className="space-y-2">
              <li>🚿 Less water waste</li>
              <li>❌ No soil contamination</li>
              <li>🌱 Faster, healthier plant growth</li>
            </ul>
            <ul className="space-y-2">
              <li>🧪 Controlled environment = consistent quality</li>
              <li>🥗 Fresh greens available year-round</li>
              <li>📍 Closer to home, fresher to your table</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-wide text-sage-700">A Small Dream with Big Purpose</p>
          <h3 className="text-2xl font-heading font-semibold text-neutral-900">From our dream to your table.</h3>
          <p className="text-neutral-700 leading-relaxed">
            Foliage isn’t just a business—it’s a passion project built with dedication, love, and belief in better food.
            Supporting a small business is supporting a dream. Thank you for helping something meaningful grow.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white/90 backdrop-blur p-8 shadow-sm">
          <p className="text-sm font-semibold tracking-wide text-sage-700">Get Fresh Greens Easily</p>
          <h3 className="text-2xl font-heading font-semibold text-neutral-900">Simple. Fresh. Honest.</h3>
          <ol className="space-y-2 text-neutral-700 leading-relaxed list-decimal list-inside">
            <li>Explore our fresh produce.</li>
            <li>Place your order.</li>
            <li>Receive freshly harvested greens straight from our farm.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
