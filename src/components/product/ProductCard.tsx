"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Stars } from "@/components/ui/Stars";

const badgeStyles: Record<string, string> = {
  Bestseller: "bg-ink text-paper",
  New: "bg-brass-500 text-ink",
  Limited: "bg-white text-ink ring-1 ring-ink/10",
  Sale: "bg-danger text-white",
};

export function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { add } = useCart();
  const onSale = !!product.compareAtPrice && product.compareAtPrice > product.price;
  const outOfStock = !product.inStock || product.stock <= 0;
  const hasHover = product.images.length > 1;

  const quickAdd = (e: React.MouseEvent) => {
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
  };

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        {product.badge && (
          <span
            className={cn(
              "absolute left-3 top-3 z-20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider2",
              badgeStyles[product.badge] ?? "bg-ink text-paper",
            )}
          >
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-paper/80 text-ink opacity-0 backdrop-blur transition-all duration-300 hover:bg-ink hover:text-paper group-hover:opacity-100"
        >
          <Heart size={16} strokeWidth={1.5} />
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

        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full p-3 opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={quickAdd}
            disabled={outOfStock}
            className={cn(
              "flex w-full items-center justify-center gap-2 py-3.5 text-[11px] font-medium uppercase tracking-wider2 backdrop-blur transition-colors duration-300",
              outOfStock
                ? "cursor-not-allowed bg-stone-200/90 text-stone-500"
                : "bg-paper/95 text-ink hover:bg-ink hover:text-paper",
            )}
          >
            {outOfStock ? "Out of stock" : (<><Plus size={15} /> Quick add</>)}
          </button>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-xl leading-tight">
            <Link
              href={`/product/${product.slug}`}
              className="after:absolute after:inset-0 after:z-10"
            >
              {product.name}
            </Link>
          </h3>
          <div className="shrink-0 text-right text-sm">
            {onSale && (
              <span className="mr-1.5 text-stone-400 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
            <span className={cn("tabular-nums", onSale && "text-danger")}>
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
        <p className="mt-1 text-[13px] text-ink-muted">{product.shortDescription}</p>
        <div className="mt-2 flex items-center gap-2">
          <Stars rating={product.rating} size={13} />
          <span className="text-[12px] text-stone-400">({product.reviewCount})</span>
        </div>
      </div>
    </article>
  );
}
