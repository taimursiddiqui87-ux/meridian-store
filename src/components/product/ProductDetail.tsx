"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  PenLine,
  RefreshCw,
  Check,
  ChevronDown,
  Gift,
  Clock3,
  Cog,
  Gem,
  Droplets,
  FlaskConical,
  Leaf,
  Banknote,
  Ruler,
  Recycle,
  Timer,
  type LucideIcon,
} from "lucide-react";
import type { Product } from "@/lib/types";
import type { SiteConfig } from "@/lib/settings";
import { getCategory } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Stars } from "@/components/ui/Stars";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type FeatureTile = { icon: LucideIcon; title: string; desc: string };

/** Sveston-style feature tile grids, per category. */
const featureTiles: Record<string, FeatureTile[]> = {
  watches: [
    { icon: Cog, title: "Precision Movement", desc: "Regulated in six positions" },
    { icon: Gem, title: "Sapphire Crystal", desc: "Scratch-resistant, anti-glare" },
    { icon: Droplets, title: "Water Resistant", desc: "Built for daily wear" },
    { icon: ShieldCheck, title: "2-Year Warranty", desc: "International coverage" },
    { icon: Truck, title: "Fast Shipping", desc: "Dispatched within 24 hours" },
    { icon: RefreshCw, title: "30-Day Returns", desc: "Hassle-free exchanges" },
  ],
  perfumes: [
    { icon: FlaskConical, title: "Extrait de Parfum", desc: "Up to 30% concentration" },
    { icon: Leaf, title: "Hand-Blended", desc: "Composed in Grasse, France" },
    { icon: Timer, title: "10–12h Longevity", desc: "Lasts on skin all day" },
    { icon: ShieldCheck, title: "Sealed & Authentic", desc: "Numbered small batches" },
    { icon: Truck, title: "Fast Shipping", desc: "Dispatched within 24 hours" },
    { icon: RefreshCw, title: "30-Day Returns", desc: "Unopened fragrances" },
  ],
  jewelry: [
    { icon: Recycle, title: "Recycled Solid Gold", desc: "Never plated, re-alloyed" },
    { icon: Gem, title: "Hand-Set Stones", desc: "Conflict-free, hand-matched" },
    { icon: Ruler, title: "Free Resizing", desc: "Within 60 days of delivery" },
    { icon: ShieldCheck, title: "2-Year Warranty", desc: "International coverage" },
    { icon: Truck, title: "Fast Shipping", desc: "Dispatched within 24 hours" },
    { icon: RefreshCw, title: "30-Day Returns", desc: "Hassle-free exchanges" },
  ],
};

/** Inline "sale ends in" ticker shown on discounted products while a sale runs. */
function SaleEndsIn({ sale }: { sale: SiteConfig["sale"] }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = sale.endsAt ? new Date(sale.endsAt).getTime() : NaN;
  if (Number.isNaN(target) || (now !== null && target - now <= 0)) return null;

  const secs = now === null ? 0 : Math.floor((target - now) / 1000);
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-gradient-to-r from-[#C40E0E] to-[#7A0808] px-4 py-2.5 text-white">
      <Clock3 size={15} />
      <span className="text-[12px] font-bold uppercase tracking-wider">
        {sale.discountLabel || sale.headline}
      </span>
      <span className="text-[12px] text-white/85" suppressHydrationWarning>
        · Sale ends in {now === null ? "—" : `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`}
      </span>
    </div>
  );
}

export function ProductDetail({
  product,
  sale,
}: {
  product: Product;
  sale?: SiteConfig["sale"];
}) {
  const { add, openCart } = useCart();
  const { format } = useCurrency();
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [personalize, setPersonalize] = useState(false);
  const [engraving, setEngraving] = useState("");
  const onSale = !!product.compareAtPrice && product.compareAtPrice > product.price;
  const outOfStock = !product.inStock || product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 10;
  const category = getCategory(product.category);
  const isPerfume = product.category === "perfumes";
  const tiles = featureTiles[product.category] ?? featureTiles.watches;

  const variantString = () => {
    let v = variant?.name ?? "Default";
    if (personalize) {
      v += isPerfume ? " · Gift wrapped" : engraving.trim() ? ` · Engraved: “${engraving.trim()}”` : "";
    }
    return v;
  };

  const handleAdd = (thenCheckout = false) => {
    if (outOfStock) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
        variant: variantString(),
      },
      qty,
    );
    if (thenCheckout) window.location.href = "/checkout";
    else openCart();
  };

  return (
    <div className="container-luxe pb-24 pt-8 lg:pb-12 lg:pt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category?.name ?? "Shop", href: `/category/${product.category}` },
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
                  "relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-cream transition-all sm:h-24 sm:w-20",
                  activeImage === i ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "opacity-70 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
          <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-xl2 bg-cream">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
            {onSale ? (
              <span className="absolute left-4 top-4 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1.5 text-[11px] font-bold text-white">
                {Math.round((1 - product.price / product.compareAtPrice!) * 100)}% OFF
              </span>
            ) : (
              product.badge && (
                <span className="absolute left-4 top-4 rounded-md bg-ink px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider2 text-paper">
                  {product.badge}
                </span>
              )
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:py-2">
          <div className="flex items-start justify-between gap-4">
            <p className="eyebrow">
              {category?.name} · {product.collection}
            </p>
            <p className="text-[11px] text-stone-400">SKU {product.sku}</p>
          </div>
          <h1 className="mt-3 font-serif text-4xl leading-none sm:text-5xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <Stars rating={product.rating} size={15} />
            <span className="text-[13px] text-ink-muted">
              {product.rating} · {product.reviewCount} reviews
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className={cn("font-serif text-3xl tabular-nums", onSale && "text-danger")}>
              {format(product.price)}
            </span>
            {onSale && (
              <span className="text-lg text-stone-400 line-through">
                {format(product.compareAtPrice!)}
              </span>
            )}
            {onSale && (
              <span className="rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-500 px-2.5 py-1 text-[11px] font-bold text-white">
                {Math.round((1 - product.price / product.compareAtPrice!) * 100)}% OFF
              </span>
            )}
          </div>

          {sale?.enabled && onSale && <SaleEndsIn sale={sale} />}

          <p className="mt-6 leading-relaxed text-ink-soft text-pretty">{product.description}</p>

          {/* Variants */}
          <div className="mt-8">
            <p className="mb-3 text-[13px]">
              <span className="uppercase tracking-wider2 text-ink-muted">
                {product.variantLabel ?? "Finish"}:
              </span>{" "}
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
                  <span className="h-7 w-7 rounded-full" style={{ backgroundColor: v.swatch }} />
                </button>
              ))}
            </div>
          </div>

          {/* Personalisation — engraving for watches & jewelry, gift wrap for perfume */}
          <div className="mt-6 rounded-xl border border-brass-200 bg-brass-50/60 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={personalize}
                onChange={(e) => setPersonalize(e.target.checked)}
                className="h-4 w-4 accent-ink"
              />
              <span className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                {isPerfume ? <Gift size={16} className="text-brass-600" /> : <PenLine size={16} className="text-brass-600" />}
                {isPerfume ? "This is a gift — add free gift wrap" : "Add complimentary engraving"}
              </span>
              <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase text-success">
                Free
              </span>
            </label>
            {personalize && !isPerfume && (
              <div className="mt-3">
                <input
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value)}
                  maxLength={40}
                  placeholder="Initials, a date or a few words…"
                  className="field-input rounded-lg"
                />
                <p className="mt-1 text-right text-[11px] text-stone-400">{engraving.length}/40</p>
              </div>
            )}
            {personalize && isPerfume && (
              <p className="mt-2 text-[12px] text-ink-muted">
                Wrapped in signature packaging with a blank note card.
              </p>
            )}
          </div>

          {/* Quantity + CTAs */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-12 items-center justify-between rounded-full border border-stone-300 px-2 sm:w-32">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease"
                className="grid h-9 w-9 place-items-center text-ink hover:text-brass-600"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase"
                className="grid h-9 w-9 place-items-center text-ink hover:text-brass-600"
              >
                <Plus size={15} />
              </button>
            </div>
            <div className="text-[13px]">
              {outOfStock ? (
                <span className="text-danger">Currently out of stock</span>
              ) : lowStock ? (
                <span className="font-medium text-brass-700">Only {product.stock} left</span>
              ) : (
                <span className="flex items-center gap-1.5 text-success">
                  <Check size={15} /> In stock · ships in 24h
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => handleAdd(false)}
              disabled={outOfStock}
              className={cn(
                "btn-primary h-14 rounded-full",
                outOfStock && "cursor-not-allowed opacity-50",
              )}
            >
              {outOfStock ? "Out of stock" : `Add to Cart — ${format(product.price * qty)}`}
            </button>
            {!outOfStock && (
              <button onClick={() => handleAdd(true)} className="btn-gold h-14 rounded-full">
                Buy It Now
              </button>
            )}
          </div>

          {/* Feature tiles */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tiles.map((t) => (
              <div
                key={t.title}
                className="rounded-xl border border-stone-200 bg-white p-3.5 text-center transition-colors hover:border-brass-300"
              >
                <t.icon size={20} strokeWidth={1.5} className="mx-auto text-brass-600" />
                <p className="mt-2 text-[12px] font-semibold leading-tight text-ink">{t.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-ink-muted">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* COD note */}
          <p className="mt-4 flex items-center gap-2 text-[12.5px] text-ink-muted">
            <Banknote size={15} className="text-brass-600" />
            Cash on Delivery available across Pakistan · Express courier worldwide
          </p>

          {/* Accordions */}
          <div className="mt-6">
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
                Cash on Delivery across Pakistan and insured express shipping worldwide. Every order is
                dispatched within 24 hours in signature packaging. Not the right fit? Return within 30
                days for a full refund — no questions asked.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-paper/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-[12px] text-ink-muted">{product.name}</p>
            <p className={cn("text-[15px] font-semibold tabular-nums", onSale && "text-danger")}>
              {format(product.price * qty)}
              {onSale && (
                <span className="ml-2 text-[12px] font-normal text-stone-400 line-through">
                  {format(product.compareAtPrice! * qty)}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => handleAdd(false)}
            disabled={outOfStock}
            className={cn(
              "btn h-12 flex-1 rounded-full text-[12px] font-bold uppercase tracking-wider2",
              outOfStock ? "cursor-not-allowed bg-stone-100 text-stone-400" : "bg-ink text-paper",
            )}
          >
            {outOfStock ? "Out of stock" : "Add to Cart"}
          </button>
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
