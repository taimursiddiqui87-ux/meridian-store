"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Lock, Truck, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function CartPage() {
  const { lines, remove, setQty, subtotal, count } = useCart();

  if (lines.length === 0) {
    return (
      <div className="container-luxe grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-cream text-stone-400">
            <ShoppingBag size={30} strokeWidth={1.2} />
          </div>
          <h1 className="mt-6 font-serif text-4xl">Your cart is empty</h1>
          <p className="mt-3 text-ink-muted">Once you add a timepiece, it will appear here.</p>
          <Link href="/shop" className="btn-primary mt-8">
            Explore the collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-luxe py-10 lg:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Your Cart</h1>
      <p className="mt-2 text-ink-muted">
        {count} {count === 1 ? "item" : "items"}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Lines */}
        <div>
          <div className="hidden border-b border-stone-200 pb-3 text-[11px] uppercase tracking-wider2 text-stone-400 md:grid md:grid-cols-[1fr_auto_auto]">
            <span>Product</span>
            <span className="w-32 text-center">Quantity</span>
            <span className="w-24 text-right">Total</span>
          </div>
          <ul className="divide-y divide-stone-100">
            {lines.map((line) => (
              <li
                key={`${line.productId}-${line.variant}`}
                className="grid grid-cols-[auto_1fr] gap-4 py-6 md:grid-cols-[auto_1fr_auto_auto] md:items-center"
              >
                <Link
                  href={`/product/${line.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden bg-cream"
                >
                  <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="min-w-0">
                  <Link href={`/product/${line.slug}`} className="font-serif text-xl hover:text-brass-600">
                    {line.name}
                  </Link>
                  <p className="mt-1 text-[13px] text-stone-400">{line.variant}</p>
                  <p className="mt-1 text-sm tabular-nums text-ink-soft">{formatPrice(line.price)}</p>
                  <button
                    onClick={() => remove(line.productId, line.variant)}
                    className="mt-2 flex items-center gap-1 text-[12px] text-stone-400 hover:text-danger md:hidden"
                  >
                    <X size={13} /> Remove
                  </button>
                </div>
                <div className="col-start-2 md:col-start-auto md:w-32 md:justify-self-center">
                  <div className="inline-flex items-center border border-stone-200">
                    <button
                      onClick={() => setQty(line.productId, line.variant, line.quantity - 1)}
                      aria-label="Decrease"
                      className="grid h-9 w-9 place-items-center hover:bg-cream"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                    <button
                      onClick={() => setQty(line.productId, line.variant, line.quantity + 1)}
                      aria-label="Increase"
                      className="grid h-9 w-9 place-items-center hover:bg-cream"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
                <div className="hidden items-center gap-4 md:flex md:w-24 md:justify-end">
                  <span className="text-sm tabular-nums">{formatPrice(line.price * line.quantity)}</span>
                </div>
                <button
                  onClick={() => remove(line.productId, line.variant)}
                  aria-label="Remove"
                  className="hidden text-stone-400 hover:text-danger md:col-start-5 md:block"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>

          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-wider2 text-ink-muted link-underline"
          >
            ← Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="border border-stone-200 bg-cream/40 p-7">
            <h2 className="font-serif text-2xl">Order Summary</h2>

            <div className="mt-5 flex gap-2">
              <div className="flex flex-1 items-center gap-2 border border-stone-200 bg-white px-3">
                <Tag size={15} className="text-stone-400" />
                <input placeholder="Promo code" className="w-full bg-transparent py-2.5 text-sm outline-none" />
              </div>
              <button className="btn border border-ink px-4 text-[12px] uppercase tracking-wider2 hover:bg-ink hover:text-paper">
                Apply
              </button>
            </div>

            <dl className="mt-6 space-y-3 border-t border-stone-200 pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Shipping</dt>
                <dd className="text-success">Free</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Estimated tax</dt>
                <dd className="text-stone-400">Calculated at checkout</dd>
              </div>
            </dl>

            <div className="mt-6 flex items-baseline justify-between border-t border-stone-200 pt-6">
              <span className="text-[13px] uppercase tracking-wider2">Total</span>
              <span className="font-serif text-3xl tabular-nums">{formatPrice(subtotal)}</span>
            </div>

            <Link href="/checkout" className="btn-primary mt-6 w-full">
              Checkout <ArrowRight size={16} />
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-stone-400">
              <Lock size={13} /> Secure encrypted checkout
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-stone-200 pt-4 text-[12px] text-ink-muted">
              <Truck size={15} className="text-brass-600" /> Free insured delivery · Arrives in 2–4 days
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
