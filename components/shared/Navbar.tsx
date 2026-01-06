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
    <nav className="bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-neutral-900">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-700 text-white">
              🌿
            </span>
            Foliage
          </Link>

          <div className="flex-1 flex items-center justify-center gap-8 text-neutral-800">
            <Link href="/#home" className="hover:text-green-700">
              Home
            </Link>
            <Link href="/#meet-foliage" className="hover:text-green-700">
              Meet Foliage
            </Link>
            <Link href="/#browse-greens" className="hover:text-green-700">
              Browse Greens
            </Link>
            {session?.user?.role === "admin" && (
              <Link href="/admin" className="hover:text-green-700">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 text-neutral-800">
            <button onClick={openDrawer} aria-label="Open cart" className="relative hover:text-green-700">
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
              className="hover:text-green-700"
            >
              <User className="w-5 h-5" />
            </Link>
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium hover:text-green-700"
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
