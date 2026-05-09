"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "./use-cart";

export function useAuthMerge() {
  const { data: session, status } = useSession();
  const { fetchCart } = useCart();

  useEffect(() => {
    async function mergeCart() {
      if (status === "authenticated" && session?.user) {
        try {
          // Call merge API
          await fetch("/api/cart/merge", {
            method: "POST",
          });
          // Refresh cart after merge
          await fetchCart();
        } catch (error) {
          console.error("Cart merge error:", error);
        }
      }
    }

    mergeCart();
  }, [status, session, fetchCart]);
}