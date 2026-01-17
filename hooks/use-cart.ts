"use client";

import { create } from "zustand";
import { toast } from "sonner";

// Flattened cart item shape used across UI components
export interface CartItem {
  id: string; // cartItem id
  productId: string;
  name: string;
  price: number;
  image?: string | null;
  slug?: string | null;
  quantity: number;
  stock?: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}

export interface CartStore extends CartState {
  // server-oriented methods
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // UI-friendly aliases used by components
  addToCart: (payload: { id?: string; productId?: string; name?: string; price?: number; image?: string | null; slug?: string | null }, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;

  // helpers
  getTotal: () => number;
  getItemCount: () => number;
}

function mapServerItemToCartItem(item: any): CartItem {
  return {
    id: item.id,
    productId: item.productId,
    name: item.product?.name ?? item.name ?? "",
    price: item.product?.price ?? item.price ?? 0,
    image: item.product?.imageUrl ?? item.image ?? null,
    slug: item.product?.slug ?? item.slug ?? null,
    quantity: item.quantity,    stock: item.product?.stock ?? undefined,  };
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  isOpen: false,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");

      const cart = await response.json();
      const items: CartItem[] = (cart.items || []).map(mapServerItemToCartItem);
      set({ items, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load cart", isLoading: false });
      console.error("Fetch cart error:", error);
    }
  },

  addItem: async (productId: string, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) throw new Error("Failed to add item");

      await get().fetchCart();
      toast.success("Item added to cart");
    } catch (error) {
      set({ error: "Failed to add item", isLoading: false });
      toast.error("Failed to add item to cart");
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      await get().fetchCart();
    } catch (error) {
      set({ error: "Failed to update quantity", isLoading: false });
      toast.error("Failed to update quantity");
    }
  },

  removeItem: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove item");

      await get().fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      set({ error: "Failed to remove item", isLoading: false });
      toast.error("Failed to remove item");
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to clear cart");

      set({ items: [], isLoading: false });
      toast.success("Cart cleared");
    } catch (error) {
      set({ error: "Failed to clear cart", isLoading: false });
      toast.error("Failed to clear cart");
    }
  },

  // UI-friendly aliases
  addToCart: async (payload, quantity = 1) => {
    // If payload contains productId, use that. If it contains id, treat as cartItem id and increment quantity.
    if (payload.productId) {
      await get().addItem(payload.productId, quantity);
      return;
    }

    if (payload.id) {
      // payload.id is a cartItem id, increment its quantity by 1
      const existing = get().items.find((i) => i.id === payload.id);
      const currentQty = existing?.quantity ?? 0;
      await get().updateQuantity(payload.id, currentQty + 1);
      return;
    }

    // Fallback: no identifiable id, do nothing
    console.warn("addToCart called with unknown payload", payload);
  },

  removeFromCart: async (itemId: string) => {
    const existing = get().items.find((i) => i.id === itemId);
    if (!existing) return;

    if (existing.quantity > 1) {
      await get().updateQuantity(itemId, existing.quantity - 1);
    } else {
      await get().removeItem(itemId);
    }
  },

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));