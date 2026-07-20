"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductGrid } from "@/components/product/ProductGrid";

export interface FeaturedTab {
  key: string;
  label: string;
  href: string;
  products: Product[];
}

/** Sveston-style "Featured Products" with category tab pills. */
export function FeaturedTabs({ tabs }: { tabs: FeaturedTab[] }) {
  const usable = tabs.filter((t) => t.products.length > 0);
  const [activeKey, setActiveKey] = useState(usable[0]?.key);
  const active = usable.find((t) => t.key === activeKey) ?? usable[0];

  if (!active) return null;

  return (
    <section className="bg-cream/40 py-16 lg:py-20">
      <div className="container-luxe">
        <div className="text-center">
          <p className="eyebrow justify-center">Handpicked for you</p>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] sm:text-5xl">Featured products</h2>
        </div>

        {/* Tab pills */}
        <div className="mt-8 flex justify-center">
          <div className="hide-scrollbar flex max-w-full gap-2 overflow-x-auto rounded-full bg-white p-1.5 ring-1 ring-stone-200">
            {usable.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveKey(t.key)}
                className={cn(
                  "shrink-0 rounded-full px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-wider2 transition-all duration-300",
                  t.key === active.key
                    ? "bg-ink text-paper shadow-soft"
                    : "text-ink-muted hover:bg-cream hover:text-ink",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid key={active.key} products={active.products.slice(0, 8)} className="mt-10" />

        <div className="mt-10 text-center">
          <Link
            href={active.href}
            className="btn-outline inline-flex rounded-full"
          >
            View all {active.label.toLowerCase()} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
