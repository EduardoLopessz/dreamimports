"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  slug: string;
  name: string;
  subtitle: string;
  priceCents: number;
  imageId: string;
  imageAlt: string;
  size: string;
  color: string;
  quantity: number;
};

/** Cupons válidos (demonstração). */
export const COUPONS: Record<string, number> = { DREAM10: 0.1 };

type CartState = {
  items: CartItem[];
  open: boolean;
  coupon: string | null;
  /** Normaliza e aplica; devolve o código aplicado ou null se não existir. */
  applyCoupon: (code: string) => string | null;
  removeCoupon: () => void;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

/** Mesmo produto com preço diferente (por exemplo, no look com desconto) vira outra linha. */
export const itemKey = (i: Pick<CartItem, "slug" | "size" | "color" | "priceCents">) =>
  `${i.slug}|${i.size}|${i.color}|${i.priceCents}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      coupon: null,
      applyCoupon: (code) => {
        const c = code.trim().toUpperCase();
        if (!(c in COUPONS)) return null;
        set({ coupon: c });
        return c;
      },
      removeCoupon: () => set({ coupon: null }),
      setOpen: (open) => set({ open }),
      add: (item, quantity = 1) =>
        set((s) => {
          const key = itemKey(item);
          const existing = s.items.find((i) => itemKey(i) === key);
          const items = existing
            ? s.items.map((i) => (itemKey(i) === key ? { ...i, quantity: Math.min(i.quantity + quantity, 10) } : i))
            : [...s.items, { ...item, quantity }];
          return { items, open: true };
        }),
      setQuantity: (key, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => itemKey(i) !== key)
              : s.items.map((i) => (itemKey(i) === key ? { ...i, quantity: Math.min(quantity, 10) } : i)),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => itemKey(i) !== key) })),
      clear: () => set({ items: [], coupon: null }),
    }),
    {
      name: "dream-cart-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, coupon: s.coupon }),
      skipHydration: true,
    },
  ),
);

export const cartCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
export const cartSubtotal = (s: CartState) => s.items.reduce((n, i) => n + i.priceCents * i.quantity, 0);
export const cartDiscount = (s: CartState) => (s.coupon ? Math.round(cartSubtotal(s) * (COUPONS[s.coupon] ?? 0)) : 0);

type FavState = { slugs: string[]; toggle: (slug: string) => void };

export const useFavorites = create<FavState>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) =>
        set((s) => ({ slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug] })),
    }),
    { name: "dream-favorites-v1", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
