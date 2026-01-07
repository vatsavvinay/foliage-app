"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function Navbar() {
  const { data: session } = useSession();
  const { fetchCart, getItemCount, openDrawer } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <nav className="bg-[var(--paper-light)] border-b-2 border-[var(--ink)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 py-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-neutral-800">
            <Link href="/#home" className="sketch-tag hover:text-sage-700 transition">
              Home
            </Link>
            <Link href="/#meet-foliage" className="sketch-tag hover:text-sage-700 transition">
              Meet Foliage
            </Link>
            <Link href="/#browse-greens" className="sketch-tag hover:text-sage-700 transition">
              Browse Greens
            </Link>
            {session?.user?.role === "admin" && (
              <Link href="/admin" className="sketch-tag hover:text-sage-700 transition">
                Admin
              </Link>
            )}
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 font-heading text-2xl text-neutral-900 tracking-wide"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-neutral-900 bg-sage-600 text-white shadow-sm">
              🌿
            </span>
            Foliage
          </Link>

          <div className="flex items-center justify-center sm:justify-end gap-4 text-neutral-800">
            <button onClick={openDrawer} aria-label="Open cart" className="relative hover:text-sage-700 transition">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <Link
              href={session ? "/profile" : "/auth/signin"}
              aria-label={session ? "Profile" : "Sign in"}
              className="hover:text-sage-700 transition"
            >
              <User className="w-5 h-5" />
            </Link>
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium hover:text-sage-700 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
