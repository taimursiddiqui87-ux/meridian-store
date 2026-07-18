"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/lib/types";

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  remove: (productId: string, variant: string) => void;
  setQty: (productId: string, variant: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "meridian.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load persisted cart once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  // Persist on change — but only after the initial load, so we never
  // clobber a stored cart with the empty initial state on mount.
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, loaded]);

  // Lock scroll when the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, qty = 1) => {
      setLines((prev) => {
        const idx = prev.findIndex(
          (l) => l.productId === line.productId && l.variant === line.variant,
        );
        if (idx > -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
          return next;
        }
        return [...prev, { ...line, quantity: qty }];
      });
      setIsOpen(true);
    },
    [],
  );

  const remove = useCallback((productId: string, variant: string) => {
    setLines((prev) =>
      prev.filter((l) => !(l.productId === productId && l.variant === variant)),
    );
  }, []);

  const setQty = useCallback(
    (productId: string, variant: string, qty: number) => {
      setLines((prev) =>
        prev
          .map((l) =>
            l.productId === productId && l.variant === variant
              ? { ...l, quantity: Math.max(0, qty) }
              : l,
          )
          .filter((l) => l.quantity > 0),
      );
    },
    [],
  );

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const count = useMemo(
    () => lines.reduce((n, l) => n + l.quantity, 0),
    [lines],
  );
  const subtotal = useMemo(
    () => lines.reduce((n, l) => n + l.price * l.quantity, 0),
    [lines],
  );

  const value: CartContextValue = {
    lines,
    isOpen,
    count,
    subtotal,
    add,
    remove,
    setQty,
    clear,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
