'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌿</span>
            </div>
            <span className="font-bold text-xl text-sage-900">Foliage</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-neutral-700 hover:text-sage-600 transition">
              Home
            </Link>
            <Link href="/products" className="text-neutral-700 hover:text-sage-600 transition">
              Products
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-sage-600 transition">
              About
            </Link>
            <Link href="/contact" className="text-neutral-700 hover:text-sage-600 transition">
              Contact
            </Link>
          </div>

          {/* Icons and Mobile Menu */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition">
              <ShoppingCart className="w-5 h-5" />
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
              href="/products"
              className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
