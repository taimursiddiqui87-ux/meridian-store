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
import { CURRENCY_META, formatMoney } from "@/lib/money";

export type CurrencyConfig = SiteConfig["currency"];

/** Re-exported so existing imports keep working; defined once in lib/money. */
export const CURRENCIES = CURRENCY_META;

interface CurrencyContextValue {
  code: string;
  enabled: string[];
  /** Units per 1 USD for the selected currency. */
  rate: number;
  setCode: (code: string) => void;
  /** Formats USD cents in the shopper's selected display currency. */
  format: (cents: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "zamira.currency.v1";

export function CurrencyProvider({
  config,
  children,
}: {
  config?: CurrencyConfig;
  children: ReactNode;
}) {
  // Defensive defaults: a stale cached config (older shape) must never crash the site.
  const safe: CurrencyConfig = {
    defaultCode: config?.defaultCode ?? "USD",
    enabled: config?.enabled?.length ? config.enabled : ["USD"],
    rates: { USD: 1, ...(config?.rates ?? {}) },
  };
  const enabled = safe.enabled.filter((c) => CURRENCIES[c]);
  const [code, setCodeState] = useState(
    enabled.includes(safe.defaultCode) ? safe.defaultCode : "USD",
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

  const rates = safe.rates;
  const rate = rates[code] ?? 1;
  const format = useCallback((cents: number) => formatMoney(cents, code, rate), [code, rate]);

  const value = useMemo(
    () => ({ code, enabled, rate, setCode, format }),
    [code, enabled, rate, setCode, format],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
