"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { CategoryId } from "./products";
import { subtotalOf, type CartLine } from "./whatsapp";

// Cart (kept in the browser) + the little shared shop state:
// the cart drawer and the product filter that the header search and nav drive.
type Ctx = {
  /** False until the saved cart has been read from the browser. */
  loaded: boolean;
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  qtyOf: (id: string) => number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
  category: CategoryId | "all";
  setCategory: (c: CategoryId | "all") => void;
  /** Bumps on every add so the header cart icon can pop (GSAP). */
  addedTick: number;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "pf-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [addedTick, setAddedTick] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only saved cart, read after mount
      if (raw) setLines((JSON.parse(raw) as CartLine[]).filter((l) => l && l.id && l.qty > 0));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  const setQty = (id: string, qty: number) =>
    setLines((ls) =>
      qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 99) } : l)),
    );

  const add = (id: string, qty = 1) => {
    setLines((ls) => {
      const has = ls.find((l) => l.id === id);
      return has
        ? ls.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + qty, 99) } : l))
        : [...ls, { id, qty }];
    });
    setAddedTick((n) => n + 1);
  };

  const value: Ctx = {
    loaded,
    lines,
    count: lines.reduce((s, l) => s + l.qty, 0),
    subtotal: subtotalOf(lines),
    add,
    setQty,
    remove: (id) => setLines((ls) => ls.filter((l) => l.id !== id)),
    clear: () => setLines([]),
    qtyOf: (id) => lines.find((l) => l.id === id)?.qty ?? 0,
    cartOpen,
    setCartOpen,
    query,
    setQuery,
    category,
    setCategory,
    addedTick,
  };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
