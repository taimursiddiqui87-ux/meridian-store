"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Stars } from "@/components/ui/Stars";

const badgeStyles: Record<string, string> = {
  Bestseller: "bg-ink text-paper",
  New: "bg-emerald-600 text-white",
  Limited: "bg-white text-ink ring-1 ring-ink/10",
  Sale: "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white",
};

export function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { add, openCart } = useCart();
  const { format } = useCurrency();
  const onSale = !!product.compareAtPrice && product.compareAtPrice > product.price;
  const pctOff = onSale
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0;
  const outOfStock = !product.inStock || product.stock <= 0;
  const hasHover = product.images.length > 1;

  const quickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      variant: product.variants[0]?.name ?? "Default",
    });
    openCart();
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl2 bg-white ring-1 ring-stone-200/80 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:shadow-card hover:ring-stone-300">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        {/* Discount / status badge */}
        {onSale && pctOff > 0 ? (
          <span className="absolute left-3 top-3 z-20 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-soft">
            {pctOff}% OFF
          </span>
        ) : (
          product.badge && (
            <span
              className={cn(
                "absolute left-3 top-3 z-20 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                badgeStyles[product.badge] ?? "bg-ink text-paper",
              )}
            >
              {product.badge}
            </span>
          )
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-soft backdrop-blur transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          <Heart size={15} strokeWidth={1.6} />
        </button>

        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={priority}
          className={cn(
            "object-cover transition-all duration-[900ms] ease-luxe group-hover:scale-[1.06]",
            hasHover && "group-hover:opacity-0",
          )}
        />
        {hasHover && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-0 transition-all duration-[900ms] ease-luxe group-hover:scale-[1.06] group-hover:opacity-100"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-4 text-center">
        <h3 className="font-serif text-xl leading-tight">
          <Link
            href={`/product/${product.slug}`}
            className="after:absolute after:inset-0 after:z-10"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[12.5px] text-ink-muted">{product.shortDescription}</p>

        <div className="mt-2 flex items-center justify-center gap-1.5">
          <Stars rating={product.rating} size={13} />
          <span className="text-[11.5px] text-stone-400">({product.reviewCount})</span>
        </div>

        <div className="mt-2.5 flex items-baseline justify-center gap-2">
          <span
            className={cn(
              "text-[15px] font-semibold tabular-nums",
              onSale ? "text-danger" : "text-ink",
            )}
          >
            {format(product.price)}
          </span>
          {onSale && (
            <span className="text-[13px] text-stone-400 line-through">
              {format(product.compareAtPrice!)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={quickBuy}
          disabled={outOfStock}
          className={cn(
            "relative z-20 mt-3.5 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[11px] font-bold uppercase tracking-wider2 transition-all duration-300",
            outOfStock
              ? "cursor-not-allowed bg-stone-100 text-stone-400"
              : "bg-ink text-paper hover:bg-brass-500 hover:text-ink hover:shadow-soft",
          )}
        >
          {outOfStock ? (
            "Out of stock"
          ) : (
            <>
              <ShoppingBag size={14} /> Quick Buy
            </>
          )}
        </button>
      </div>
    </article>
  );
}
