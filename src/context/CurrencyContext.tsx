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
import type { SiteConfig } from "@/lib/settings";

export type CurrencyConfig = SiteConfig["currency"];

/** Display metadata per supported currency (prices are stored in USD cents). */
export const CURRENCIES: Record<string, { symbol: string; label: string }> = {
  USD: { symbol: "$", label: "US Dollar" },
  PKR: { symbol: "Rs. ", label: "Pakistani Rupee" },
  GBP: { symbol: "£", label: "British Pound" },
  CAD: { symbol: "C$", label: "Canadian Dollar" },
};

interface CurrencyContextValue {
  code: string;
  enabled: string[];
  setCode: (code: string) => void;
  /** Formats USD cents in the shopper's selected display currency. */
  format: (cents: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "meridian.currency.v1";

export function CurrencyProvider({
  config,
  children,
}: {
  config: CurrencyConfig;
  children: ReactNode;
}) {
  const enabled = config.enabled.filter((c) => CURRENCIES[c]);
  const [code, setCodeState] = useState(
    enabled.includes(config.defaultCode) ? config.defaultCode : "USD",
  );

  // Restore the shopper's choice after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && enabled.includes(stored)) setCodeState(stored);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCode = useCallback(
    (next: string) => {
      if (!enabled.includes(next)) return;
      setCodeState(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
    },
    [enabled],
  );

  const format = useCallback(
    (cents: number) => {
      const rate = config.rates[code] ?? 1;
      const amount = (cents / 100) * rate;
      const { symbol } = CURRENCIES[code] ?? CURRENCIES.USD;
      return `${symbol}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
        Math.round(amount),
      )}`;
    },
    [code, config.rates],
  );

  const value = useMemo(
    () => ({ code, enabled, setCode, format }),
    [code, enabled, setCode, format],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
