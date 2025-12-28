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
    title: 'Locally grown indoors',
    description: 'Vertical farms keep greens fresh and close to home.',
    icon: MapPin,
  },
  {
    title: '365-day harvest',
    description: 'Consistent taste and nutrition in every season.',
    icon: CalendarDays,
  },
  {
    title: 'Zero pesticides',
    description: 'Clean, crisp leaves with no harsh sprays.',
    icon: Leaf,
  },
  {
    title: 'Water-wise farming',
    description: 'Modern growing uses a fraction of the water.',
    icon: Droplets,
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
            <p className="text-sm font-semibold uppercase tracking-wide text-sage-100">Fresh indoor greens</p>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              Lettuce, basil, and baby spinach—grown clean, harvested daily, and ready when you are.
            </h1>
            <p className="text-lg text-neutral-100 font-semibold drop-shadow-sm">
              We focus on three fan-favorites: crisp lettuce, fragrant basil, and tender baby spinach. All grown indoors
              with zero pesticides, so you get reliable flavor and longer-lasting freshness every week of the year.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#lettuce"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-white font-bold shadow-lg shadow-sage-200 transition"
                style={{ backgroundColor: GOODLEAF_PRIMARY }}
              >
                Shop Lettuce
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-white font-bold shadow-lg shadow-neutral-300 transition"
                style={{ backgroundColor: GOODLEAF_ACCENT }}
              >
                Browse all greens
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
            <p className="text-sm font-semibold uppercase tracking-wide text-sage-100">Why it matters</p>
            <p className="text-neutral-100 text-lg">
              Hydroponic vertical farms use less water, keep greens protected, and deliver consistent quality. Your
              favorite lettuce, basil, and baby spinach stay crisp longer and are ready to eat without pesticides.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="highlights">
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
                <p className="text-xs font-semibold uppercase tracking-wide text-sage-700">Hydroponic freshness</p>
                <h2 className="text-2xl font-bold text-neutral-900">{product.title}</h2>
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
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
