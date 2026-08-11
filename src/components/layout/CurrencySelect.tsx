"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency, CURRENCIES } from "@/context/CurrencyContext";

/**
 * Currency picker in the header. Styled as a bordered pill so shoppers can see
 * at a glance that prices can be switched (PKR / USD / GBP / CAD).
 */
export function CurrencySelect() {
  const { code, enabled, setCode } = useCurrency();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on Escape as well as on outside click.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (enabled.length <= 1) return null;

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Currency: ${code}. Change currency`}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full border px-2.5 text-[12.5px] font-bold tracking-wide transition-all duration-200 sm:px-3",
          open
            ? "border-brass-500 bg-brass-50 text-brass-700 ring-4 ring-brass-500/15"
            : "border-stone-300 bg-white text-ink shadow-soft hover:border-brass-500 hover:text-brass-700",
        )}
      >
        <Globe size={14} className="text-brass-600" strokeWidth={2} />
        {code}
        <ChevronDown
          size={13}
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
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
          <div
            role="listbox"
            className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl bg-white py-1.5 text-ink shadow-lift ring-1 ring-black/[0.08]"
          >
            <p className="px-4 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider2 text-stone-400">
              Show prices in
            </p>
            {enabled.map((c) => {
              const active = c === code;
              return (
                <button
                  key={c}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setCode(c);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] transition-colors",
                    active ? "bg-brass-50" : "hover:bg-stone-50",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-6 w-9 shrink-0 place-items-center rounded-md text-[11px] font-bold",
                      active ? "bg-brass-500 text-ink" : "bg-stone-100 text-ink-muted",
                    )}
                  >
                    {CURRENCIES[c]?.symbol.trim()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block", active && "font-semibold")}>{c}</span>
                    <span className="block truncate text-[11px] text-stone-400">
                      {CURRENCIES[c]?.label}
                    </span>
                  </span>
                  {active && <Check size={15} className="shrink-0 text-brass-600" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
