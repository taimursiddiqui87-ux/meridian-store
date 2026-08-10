/**
 * Card helpers used by the checkout form.
 *
 * IMPORTANT: the full card number never leaves the browser. These utilities let
 * the form validate locally and hand the server only the brand and last four
 * digits. When a real gateway is connected it will supply its own hosted field
 * or token, so the raw number stays out of our server and database entirely.
 */

export type CardBrand = "visa" | "mastercard" | "amex" | "unionpay" | "discover" | "unknown";

export const BRAND_LABEL: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  unionpay: "UnionPay",
  discover: "Discover",
  unknown: "Card",
};

export function detectBrand(input: string): CardBrand {
  const n = input.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^62/.test(n)) return "unionpay";
  if (/^6(?:011|5)/.test(n)) return "discover";
  return "unknown";
}

/** Amex uses 15 digits in 4-6-5 groups; everything else 16 in groups of 4. */
export function formatCardNumber(input: string): string {
  const n = input.replace(/\D/g, "").slice(0, 19);
  if (detectBrand(n) === "amex") {
    return [n.slice(0, 4), n.slice(4, 10), n.slice(10, 15)].filter(Boolean).join(" ");
  }
  return (n.match(/.{1,4}/g) ?? []).join(" ");
}

export function formatExpiry(input: string): string {
  const n = input.replace(/\D/g, "").slice(0, 4);
  if (n.length <= 2) return n;
  return `${n.slice(0, 2)}/${n.slice(2)}`;
}

/** Standard Luhn checksum — catches most mistyped numbers. */
export function luhnValid(input: string): boolean {
  const n = input.replace(/\D/g, "");
  if (n.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let digit = Number(n[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

export function cvcLength(brand: CardBrand): number {
  return brand === "amex" ? 4 : 3;
}

export interface CardInput {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

export type CardErrors = Partial<Record<keyof CardInput, string>>;

export function validateCard(card: CardInput, now = new Date()): CardErrors {
  const errors: CardErrors = {};
  const digits = card.number.replace(/\D/g, "");
  const brand = detectBrand(digits);
  const expectedLength = brand === "amex" ? 15 : 16;

  if (!digits) errors.number = "Enter your card number.";
  else if (digits.length < expectedLength) errors.number = "This card number looks too short.";
  else if (!luhnValid(digits)) errors.number = "Please check the card number.";

  if (!card.name.trim()) errors.name = "Enter the name printed on the card.";

  const [mmRaw, yyRaw] = card.expiry.split("/");
  const mm = Number(mmRaw);
  const yy = Number(yyRaw);
  if (!mmRaw || !yyRaw || yyRaw.length < 2) {
    errors.expiry = "Enter the expiry as MM/YY.";
  } else if (!mm || mm < 1 || mm > 12) {
    errors.expiry = "Month must be between 01 and 12.";
  } else {
    // Cards stay valid through the last day of their expiry month.
    const expiresEnd = new Date(2000 + yy, mm, 1);
    if (expiresEnd <= now) errors.expiry = "This card has expired.";
  }

  const need = cvcLength(brand);
  const cvcDigits = card.cvc.replace(/\D/g, "");
  if (!cvcDigits) errors.cvc = "Enter the security code.";
  else if (cvcDigits.length !== need) errors.cvc = `The code should be ${need} digits.`;

  return errors;
}

/** Safe summary handed to the server — never the full number. */
export function cardSummary(card: CardInput): { brand: string; last4: string } {
  const digits = card.number.replace(/\D/g, "");
  return { brand: BRAND_LABEL[detectBrand(digits)], last4: digits.slice(-4) };
}
