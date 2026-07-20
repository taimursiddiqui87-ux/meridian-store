"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency, CURRENCIES } from "@/context/CurrencyContext";

/** Compact currency picker for the dark header (PKR / USD / GBP / CAD). */
export function CurrencySelect() {
  const { code, enabled, setCode } = useCurrency();
  const [open, setOpen] = useState(false);

  if (enabled.length <= 1) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Select currency"
        aria-expanded={open}
        className="flex h-10 items-center gap-1 px-2 text-[12.5px] font-semibold tracking-wide text-paper/90 transition-colors hover:text-brass-300"
      >
        {code}
        <ChevronDown size={13} className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close currency menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
            tabIndex={-1}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl bg-paper py-1.5 text-ink shadow-lift ring-1 ring-stone-200">
            {enabled.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCode(c);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-cream",
                  c === code && "font-semibold",
                )}
              >
                <span>
                  {c} <span className="ml-1 text-[11px] text-stone-400">{CURRENCIES[c]?.label}</span>
                </span>
                {c === code && <Check size={14} className="text-brass-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
