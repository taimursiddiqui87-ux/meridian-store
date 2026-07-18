"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { validateCoupon } from "@/app/actions/coupons";

export interface AppliedCoupon {
  code: string;
  discount: number; // cents
  label: string;
}

/**
 * Keeps the cart's stored promo code validated against the live subtotal, so
 * the discount is always current as the cart changes. The applied code is
 * shared across the cart and checkout via CartContext.
 */
export function useAppliedCoupon(subtotal: number) {
  const { couponCode, setCouponCode } = useCart();
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    let active = true;
    if (!couponCode) {
      setApplied(null);
      setError(null);
      return;
    }
    setValidating(true);
    validateCoupon(couponCode, subtotal).then((res) => {
      if (!active) return;
      if (res.ok && res.discount != null) {
        setApplied({ code: res.code ?? couponCode, discount: res.discount, label: res.label ?? "" });
        setError(null);
      } else {
        setApplied(null);
        setError(res.error ?? null);
      }
      setValidating(false);
    });
    return () => {
      active = false;
    };
  }, [couponCode, subtotal]);

  const apply = async (code: string): Promise<boolean> => {
    const res = await validateCoupon(code, subtotal);
    if (res.ok) {
      setCouponCode(res.code ?? code.trim().toUpperCase());
      setError(null);
      return true;
    }
    setError(res.error ?? "That code isn't valid.");
    return false;
  };

  const remove = () => {
    setCouponCode("");
    setApplied(null);
    setError(null);
  };

  return { applied, error, validating, apply, remove };
}
