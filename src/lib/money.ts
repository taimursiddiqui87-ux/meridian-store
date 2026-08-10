/**
 * Single source of truth for money formatting.
 *
 * Prices are stored as USD cents. `rate` converts to the currency the shopper
 * was browsing in, so the storefront, the confirmation email and the admin all
 * show the same number.
 */

export const CURRENCY_META: Record<string, { symbol: string; label: string }> = {
  USD: { symbol: "$", label: "US Dollar" },
  PKR: { symbol: "Rs. ", label: "Pakistani Rupee" },
  GBP: { symbol: "£", label: "British Pound" },
  CAD: { symbol: "C$", label: "Canadian Dollar" },
};

export function formatMoney(cents: number, code = "USD", rate = 1): string {
  const meta = CURRENCY_META[code] ?? CURRENCY_META.USD;
  const amount = (cents / 100) * (rate || 1);
  return `${meta.symbol}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Math.round(amount),
  )}`;
}

/**
 * "Rs. 2,780" when the shopper browsed in PKR, or just "$10" when they were
 * already in USD. Used where both the charge and display currency matter.
 */
export function formatOrderTotal(
  cents: number,
  displayCurrency?: string | null,
  displayRate?: number | null,
): string {
  const usd = formatMoney(cents, "USD", 1);
  if (!displayCurrency || displayCurrency === "USD" || !displayRate) return usd;
  return `${formatMoney(cents, displayCurrency, displayRate)} (${usd})`;
}
