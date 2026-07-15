"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/** Clears the cart once, after a successful checkout. */
export function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
