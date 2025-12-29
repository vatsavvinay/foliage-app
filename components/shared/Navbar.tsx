'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/components/storefront/CartContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { openDrawer, totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌿</span>
            </div>
            <span className="font-bold text-xl text-neutral-900">Foliage</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-neutral-800 hover:text-sage-700 transition">
              Home
            </Link>
            <Link href="/about" className="text-neutral-800 hover:text-sage-700 transition">
              About
            </Link>
            <Link href="/products" className="text-neutral-800 hover:text-sage-700 transition">
              Browse Greens
            </Link>
          </div>

          {/* Icons and Mobile Menu */}
          <div className="flex items-center gap-4">
            <button onClick={openDrawer} className="relative p-2 hover:bg-neutral-100 rounded-lg transition">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition">
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4 space-y-3">
            <Link
              href="/"
              className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
            >
              About
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              Browse Greens
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
