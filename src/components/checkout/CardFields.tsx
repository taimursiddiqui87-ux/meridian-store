"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  detectBrand,
  formatCardNumber,
  formatExpiry,
  cvcLength,
  BRAND_LABEL,
  type CardBrand,
  type CardInput,
  type CardErrors,
} from "@/lib/card";

/** Compact brand chip shown inside the card-number field. */
const BRAND_CHIP: Record<Exclude<CardBrand, "unknown">, { text: string; bg: string }> = {
  visa: { text: "VISA", bg: "#1A1F71" },
  mastercard: { text: "MC", bg: "#EB001B" },
  amex: { text: "AMEX", bg: "#2E77BC" },
  unionpay: { text: "UPI", bg: "#E21836" },
  discover: { text: "DISC", bg: "#FF6000" },
};

/**
 * Card entry with live formatting and validation. The value is held by the
 * parent so it can gate submission; only the brand and last four digits are
 * ever sent onward.
 */
export function CardFields({
  value,
  onChange,
  errors,
  showErrors,
}: {
  value: CardInput;
  onChange: (next: CardInput) => void;
  errors: CardErrors;
  showErrors: boolean;
}) {
  const set = (patch: Partial<CardInput>) => onChange({ ...value, ...patch });
  const brand = detectBrand(value.number);
  const maxCvc = cvcLength(brand);

  const Err = ({ field }: { field: keyof CardInput }) =>
    showErrors && errors[field] ? (
      <p className="mt-1 text-[12px] text-danger">{errors[field]}</p>
    ) : null;

  const fieldClass = (field: keyof CardInput) =>
    cn("field-input rounded-lg", showErrors && errors[field] && "border-danger focus:border-danger");

  return (
    <div className="space-y-3">
      <div>
        <div className="relative">
          <input
            value={value.number}
            onChange={(e) => set({ number: formatCardNumber(e.target.value) })}
            placeholder="Card number"
            inputMode="numeric"
            autoComplete="cc-number"
            aria-label="Card number"
            aria-invalid={showErrors && !!errors.number}
            className={cn(fieldClass("number"), "pr-24")}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            {brand === "unknown" ? (
              <Lock size={15} className="text-stone-400" />
            ) : (
              <span
                className="rounded px-2 py-1 text-[10px] font-bold tracking-wide text-white"
                style={{ backgroundColor: BRAND_CHIP[brand].bg }}
              >
                {BRAND_CHIP[brand].text}
              </span>
            )}
          </span>
        </div>
        <Err field="number" />
        {brand !== "unknown" && !errors.number && (
          <p className="mt-1 text-[12px] text-success">{BRAND_LABEL[brand]} detected</p>
        )}
      </div>

      <div>
        <input
          value={value.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Name on card"
          autoComplete="cc-name"
          aria-label="Name on card"
          aria-invalid={showErrors && !!errors.name}
          className={fieldClass("name")}
        />
        <Err field="name" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            value={value.expiry}
            onChange={(e) => set({ expiry: formatExpiry(e.target.value) })}
            placeholder="MM / YY"
            inputMode="numeric"
            autoComplete="cc-exp"
            aria-label="Expiry date"
            aria-invalid={showErrors && !!errors.expiry}
            className={fieldClass("expiry")}
          />
          <Err field="expiry" />
        </div>
        <div>
          <input
            value={value.cvc}
            onChange={(e) => set({ cvc: e.target.value.replace(/\D/g, "").slice(0, maxCvc) })}
            placeholder={maxCvc === 4 ? "CVC (4 digits)" : "CVC"}
            inputMode="numeric"
            autoComplete="cc-csc"
            aria-label="Security code"
            aria-invalid={showErrors && !!errors.cvc}
            className={fieldClass("cvc")}
          />
          <Err field="cvc" />
        </div>
      </div>

      <p className="flex items-start gap-1.5 text-[12px] text-stone-500">
        <Lock size={13} className="mt-0.5 shrink-0" />
        Your card number stays in your browser — we only keep the card type and last four digits
        with your order.
      </p>
    </div>
  );
}
