/**
 * Pure order-total math shared by the storefront (cart/checkout display) and
 * the server (placeOrder). All amounts are integer cents.
 */

export interface CheckoutRules {
  freeShippingThreshold: number; // cents; 0 disables the free tier
  shippingFlat: number; // cents charged when below the threshold
  taxRatePct: number; // percentage applied to the discounted subtotal
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export function computeTotals(
  subtotal: number,
  rules: CheckoutRules,
  discount = 0,
): OrderTotals {
  const safeDiscount = Math.max(0, Math.min(discount, subtotal));
  const discounted = subtotal - safeDiscount;

  const shipping =
    subtotal <= 0 || rules.shippingFlat <= 0
      ? 0
      : rules.freeShippingThreshold > 0 && discounted >= rules.freeShippingThreshold
        ? 0
        : rules.shippingFlat;

  const tax = Math.max(0, Math.round((discounted * (rules.taxRatePct || 0)) / 100));

  return {
    subtotal,
    discount: safeDiscount,
    shipping,
    tax,
    total: discounted + shipping + tax,
  };
}
