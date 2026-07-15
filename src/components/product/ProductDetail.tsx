"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  PenLine,
  RefreshCw,
  Check,
  ChevronDown,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Stars } from "@/components/ui/Stars";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function ProductDetail({ product }: { product: Product }) {
  const { add, openCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const onSale = !!product.compareAtPrice && product.compareAtPrice > product.price;

  const handleAdd = (thenCheckout = false) => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
        variant: variant?.name ?? "Default",
      },
      qty,
    );
    if (thenCheckout) window.location.href = "/checkout";
  };

  return (
    <div className="container-luxe py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Watches", href: "/shop" },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex gap-3 sm:flex-col">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative h-20 w-16 shrink-0 overflow-hidden bg-cream transition-all sm:h-24 sm:w-20",
                  activeImage === i ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "opacity-70 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
          <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-cream">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider2 text-paper">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:py-2">
          <p className="eyebrow">{product.collection} Collection</p>
          <h1 className="mt-3 font-serif text-4xl leading-none sm:text-5xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <Stars rating={product.rating} size={15} />
            <span className="text-[13px] text-ink-muted">
              {product.rating} · {product.reviewCount} reviews
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-serif text-3xl tabular-nums">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-lg text-stone-400 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
            {onSale && (
              <span className="bg-danger/10 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-danger">
                Save {formatPrice(product.compareAtPrice! - product.price)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-ink-soft text-pretty">{product.description}</p>

          {/* Variants */}
          <div className="mt-8">
            <p className="mb-3 text-[13px]">
              <span className="uppercase tracking-wider2 text-ink-muted">Finish:</span>{" "}
              <span className="text-ink">{variant?.name}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariant(v)}
                  aria-label={v.name}
                  className={cn(
                    "relative grid h-10 w-10 place-items-center rounded-full transition-all",
                    variant?.id === v.id
                      ? "ring-2 ring-ink ring-offset-2 ring-offset-paper"
                      : "ring-1 ring-stone-300 hover:ring-ink",
                  )}
                >
                  <span
                    className="h-7 w-7 rounded-full"
                    style={{ backgroundColor: v.swatch }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex h-14 items-center justify-between border border-stone-300 px-2 sm:w-32">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease"
                className="grid h-10 w-10 place-items-center text-ink hover:text-brass-600"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase"
                className="grid h-10 w-10 place-items-center text-ink hover:text-brass-600"
              >
                <Plus size={16} />
              </button>
            </div>
            <button onClick={() => handleAdd(false)} className="btn-primary h-14 flex-1">
              Add to Cart — {formatPrice(product.price * qty)}
            </button>
          </div>
          <button
            onClick={() => handleAdd(true)}
            className="btn-gold mt-3 h-14 w-full"
          >
            Buy it now
          </button>

          <div className="mt-4 flex items-center gap-2 text-[13px] text-success">
            <Check size={16} /> In stock · Ships within 24 hours
          </div>

          {/* Trust */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-stone-200 py-6 sm:grid-cols-4">
            {[
              { icon: Truck, label: "Free shipping" },
              { icon: ShieldCheck, label: "2-yr warranty" },
              { icon: PenLine, label: "Free engraving" },
              { icon: RefreshCw, label: "30-day returns" },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-2 text-center">
                <t.icon size={20} strokeWidth={1.4} className="text-brass-600" />
                <span className="text-[11px] uppercase tracking-wide text-ink-muted">{t.label}</span>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div className="mt-2">
            <Accordion title="Details" defaultOpen>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-[14px] text-ink-soft">
                    <Check size={16} className="mt-0.5 shrink-0 text-brass-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Specifications">
              <dl className="divide-y divide-stone-100">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-4 py-2.5 text-[14px]">
                    <dt className="text-ink-muted">{s.label}</dt>
                    <dd className="text-right text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Accordion>
            <Accordion title="Shipping & Returns">
              <p className="text-[14px] leading-relaxed text-ink-soft">
                Complimentary insured shipping worldwide on orders over $150. Every order is dispatched
                within 24 hours in signature Meridian packaging. Not the right fit? Return within 30 days
                for a full refund — no questions asked.
              </p>
            </Accordion>
          </div>

          <p className="mt-6 text-[12px] text-stone-400">SKU: {product.sku}</p>
        </div>
      </div>
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-stone-200">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-[13px] font-medium uppercase tracking-wider2">{title}</span>
        <ChevronDown
          size={18}
          className={cn("text-ink-muted transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-luxe",
          open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
