"use client";

import { useState } from "react";
import { Copy, Check, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteConfig } from "@/lib/settings";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { waLink } from "@/lib/whatsapp";

const PROVIDER_STYLE: Record<string, string> = {
  Easypaisa: "bg-[#1FA64A]",
  JazzCash: "bg-[#B01C2E]",
};

/**
 * Wallet transfer details for shoppers who'd rather pay up front by
 * Easypaisa/JazzCash and send a screenshot as proof.
 */
export function ManualPaymentPanel({
  manual,
  whatsapp,
  orderNumber,
  className,
}: {
  manual: SiteConfig["payments"]["manual"];
  whatsapp?: string;
  orderNumber?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const accounts = manual.accounts.filter((a) => a.number.trim());

  if (!manual.enabled || accounts.length === 0) return null;

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied((c) => (c === value ? null : c)), 1800);
    } catch {
      /* clipboard unavailable — the number is still visible to type manually */
    }
  };

  const proofLink = waLink(
    whatsapp,
    orderNumber
      ? `Hi! I've paid for order ${orderNumber}. Here is my payment screenshot.`
      : "Hi! Here is my payment screenshot for my order.",
  );

  return (
    <section
      className={cn(
        "rounded-2xl border border-brass-200 bg-brass-50/60 p-5",
        className,
      )}
    >
      <h3 className="flex items-center gap-2 font-serif text-xl text-ink">
        <Smartphone size={18} className="text-brass-600" />
        {manual.heading}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{manual.instructions}</p>

      <div className="mt-4 space-y-2.5">
        {accounts.map((a) => (
          <div
            key={a.provider}
            className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-stone-200"
          >
            <span
              className={cn(
                "grid h-9 w-[76px] shrink-0 place-items-center rounded-lg text-[11px] font-bold text-white",
                PROVIDER_STYLE[a.provider] ?? "bg-ink",
              )}
            >
              {a.provider}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold tabular-nums tracking-wide text-ink">
                {a.number}
              </span>
              {a.accountName && (
                <span className="block truncate text-[12px] text-ink-muted">{a.accountName}</span>
              )}
            </span>
            <button
              type="button"
              onClick={() => copy(a.number)}
              aria-label={`Copy ${a.provider} number`}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors",
                copied === a.number
                  ? "border-success bg-success/10 text-success"
                  : "border-stone-300 text-ink hover:border-ink",
              )}
            >
              {copied === a.number ? <Check size={13} /> : <Copy size={13} />}
              {copied === a.number ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>

      {proofLink && (
        <a
          href={proofLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-[12px] font-bold uppercase tracking-wider2 text-white transition-transform active:scale-[0.98]"
        >
          <WhatsAppIcon size={17} /> Send payment screenshot
        </a>
      )}
    </section>
  );
}
