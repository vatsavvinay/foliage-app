"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function Navbar() {
  const { data: session } = useSession();
  const { fetchCart, getItemCount, openDrawer } = useCart();
  const itemCount = getItemCount();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-neutral-900">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-700 text-white">
                🌿
              </span>
              Foliage
            </Link>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center gap-8 text-neutral-800">
            <Link href="/" className="hover:text-green-700">
              Home
            </Link>
            <Link href="/about" className="hover:text-green-700">
              About
            </Link>
            <Link href="/products" className="hover:text-green-700">
              Products
            </Link>
            {session?.user?.role === "ADMIN" && (
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
                className="hidden sm:inline text-sm font-medium hover:text-green-700"
              >
                Logout
              </button>
            )}

            <button
              className="md:hidden p-2 rounded-md hover:bg-neutral-100"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className={`md:hidden ${mobileOpen ? "block" : "hidden"} pb-4`}>
          <div className="flex flex-col gap-2 px-2">
            <Link href="/" className="block px-3 py-2 rounded-md hover:bg-neutral-50" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md hover:bg-neutral-50" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/products" className="block px-3 py-2 rounded-md hover:bg-neutral-50" onClick={() => setMobileOpen(false)}>Products</Link>
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-neutral-50" onClick={() => setMobileOpen(false)}>Admin</Link>
            )}

            <div className="border-t border-neutral-100 mt-2 pt-2">
              <button onClick={() => { openDrawer(); setMobileOpen(false); }} aria-label="Open cart" className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-50">Cart {itemCount > 0 && `(${itemCount})`}</button>
              <Link href={session ? "/profile" : "/auth/signin"} className="block px-3 py-2 rounded-md hover:bg-neutral-50" onClick={() => setMobileOpen(false)}>{session ? 'Profile' : 'Sign in'}</Link>
              {session && (
                <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-50">Logout</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
