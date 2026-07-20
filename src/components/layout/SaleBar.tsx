"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/settings";

/** Sveston-style red sale strip with a live countdown. Fully CMS-driven. */
export function SaleBar({ sale }: { sale: SiteConfig["sale"] }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!sale.enabled) return null;

  const target = sale.endsAt ? new Date(sale.endsAt).getTime() : NaN;
  const diff = now !== null && !Number.isNaN(target) ? target - now : NaN;
  const showTimer = !Number.isNaN(target) && (now === null || diff > 0);

  const secs = Math.max(0, Math.floor((Number.isNaN(diff) ? 0 : diff) / 1000));
  const units = [
    { label: "Days", value: Math.floor(secs / 86400) },
    { label: "Hrs", value: Math.floor((secs % 86400) / 3600) },
    { label: "Min", value: Math.floor((secs % 3600) / 60) },
    { label: "Sec", value: secs % 60 },
  ];

  return (
    <Link
      href={sale.href || "/shop"}
      className="block bg-gradient-to-r from-[#C40E0E] via-[#9E0B0B] to-[#5E0505] text-white"
      aria-label={`${sale.headline} — ${sale.discountLabel}`}
    >
      <div className="container-luxe flex min-h-[42px] flex-wrap items-center justify-center gap-x-4 gap-y-1.5 py-1.5">
        <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          {sale.headline}
        </span>

        {showTimer && (
          <span className="flex items-center gap-1.5" suppressHydrationWarning>
            {units.map((u) => (
              <span key={u.label} className="flex flex-col items-center leading-none">
                <span className="grid min-w-[30px] place-items-center rounded-[4px] bg-white px-1 py-1 text-[12px] font-bold tabular-nums text-[#A50F0F]">
                  {now === null ? "–" : String(u.value).padStart(2, "0")}
                </span>
                <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/75">
                  {u.label}
                </span>
              </span>
            ))}
          </span>
        )}

        {sale.message && (
          <span className="hidden text-[12px] font-medium text-white/85 lg:inline">{sale.message}</span>
        )}

        {sale.discountLabel && (
          <span className="rounded-[4px] bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#A50F0F]">
            {sale.discountLabel}
          </span>
        )}
      </div>
    </Link>
  );
}
