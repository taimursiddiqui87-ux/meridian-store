"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const FREE_SHIP_THRESHOLD = 15000; // cents

export function CartDrawer() {
  const { lines, isOpen, closeCart, remove, setQty, subtotal, count } = useCart();
  const { format } = useCurrency();
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);

  return (
    <div className={cn("fixed inset-0 z-[60]", isOpen ? "pointer-events-auto" : "pointer-events-none")}>
      <div
        onClick={closeCart}
        className={cn(
          "absolute inset-0 bg-ink/45 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-lift transition-transform duration-400 ease-luxe",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <h2 className="flex items-center gap-2 font-serif text-2xl">
            Your Cart
            <span className="text-base text-stone-400">({count})</span>
          </h2>
          <button onClick={closeCart} aria-label="Close cart" className="text-ink hover:text-brass-600">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Free shipping bar */}
        {lines.length > 0 && (
          <div className="border-b border-stone-100 bg-cream/60 px-6 py-4">
            <p className="mb-2 flex items-center gap-2 text-[12.5px] text-ink-soft">
              <Truck size={15} className="text-brass-600" />
              {remaining > 0 ? (
                <span>
                  You’re <strong className="font-semibold">{format(remaining)}</strong> away from free
                  shipping
                </span>
              ) : (
                <span className="font-medium text-success">You’ve unlocked complimentary shipping ✓</span>
              )}
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-brass-500 transition-all duration-500 ease-luxe"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Lines */}
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-cream text-stone-400">
              <ShoppingBag size={26} strokeWidth={1.3} />
            </div>
            <div>
              <p className="font-serif text-2xl">Your cart is empty</p>
              <p className="mt-1 text-sm text-ink-muted">Discover timepieces made to last a lifetime.</p>
            </div>
            <button onClick={closeCart} className="btn-primary mt-2">
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="divide-y divide-stone-100">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.variant}`} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${line.slug}`}
                    onClick={closeCart}
                    className="relative h-24 w-20 shrink-0 overflow-hidden bg-cream"
                  >
                    <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <div>
                        <Link
                          href={`/product/${line.slug}`}
                          onClick={closeCart}
                          className="font-serif text-lg leading-tight hover:text-brass-600"
                        >
                          {line.name}
                        </Link>
                        <p className="mt-0.5 text-[12px] text-stone-400">{line.variant}</p>
                      </div>
                      <button
                        onClick={() => remove(line.productId, line.variant)}
                        aria-label="Remove"
                        className="h-fit text-stone-400 transition-colors hover:text-danger"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-stone-200">
                        <button
                          onClick={() => setQty(line.productId, line.variant, line.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="grid h-8 w-8 place-items-center text-ink hover:bg-cream"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                        <button
                          onClick={() => setQty(line.productId, line.variant, line.quantity + 1)}
                          aria-label="Increase quantity"
                          className="grid h-8 w-8 place-items-center text-ink hover:bg-cream"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-sm tabular-nums">{format(line.price * line.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        {lines.length > 0 && (
          <div className="border-t border-stone-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] uppercase tracking-wider2 text-ink-muted">Subtotal</span>
              <span className="font-serif text-2xl tabular-nums">{format(subtotal)}</span>
            </div>
            <p className="mt-1 text-[12px] text-stone-400">Shipping &amp; taxes calculated at checkout.</p>
            <Link href="/checkout" onClick={closeCart} className="btn-primary mt-4 w-full">
              Checkout <ArrowRight size={16} />
            </Link>
            <button
              onClick={closeCart}
              className="mt-2 w-full py-2 text-[12px] uppercase tracking-wider2 text-ink-muted link-underline"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
