"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck, Truck, ArrowRight, AlertCircle, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { BRAND } from "@/lib/data";

export default function CheckoutPage() {
  const { lines, subtotal, count } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const pay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout could not be started.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="container-luxe py-24 text-center text-ink-muted">Loading checkout…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="container-luxe grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <h1 className="font-serif text-4xl">Your cart is empty</h1>
          <p className="mt-3 text-ink-muted">Add a piece before checking out.</p>
          <Link href="/shop" className="btn-primary mt-8">Browse watches</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-stone-200">
      <div className="mx-auto grid max-w-6xl lg:grid-cols-[1fr_440px]">
        {/* Left — review & pay */}
        <div className="px-5 py-10 sm:px-10 lg:py-16">
          <div className="mx-auto max-w-lg">
            <Link href="/" className="font-serif text-2xl font-semibold tracking-[0.14em]">
              {BRAND.name}
            </Link>

            <h1 className="mt-8 font-serif text-3xl">Secure checkout</h1>
            <p className="mt-2 text-sm text-ink-muted">
              You’ll enter your card and shipping details on Stripe’s secure, encrypted payment page —
              then land right back here.
            </p>

            {error && (
              <div className="mt-6 flex items-start gap-2 border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <div className="mt-8 space-y-3">
              {[
                { icon: Lock, title: "Encrypted & secure", desc: "Card details handled entirely by Stripe — we never see them." },
                { icon: Truck, title: "Free insured shipping", desc: "Dispatched within 24 hours, tracked to your door." },
                { icon: ShieldCheck, title: "2-year warranty", desc: "Plus 30-day returns, no questions asked." },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4 border border-stone-200 px-5 py-4">
                  <f.icon size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-brass-600" />
                  <div>
                    <p className="text-sm font-medium text-ink">{f.title}</p>
                    <p className="text-[12.5px] text-ink-muted">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={pay} disabled={loading} className="btn-primary mt-8 w-full">
              {loading ? (
                "Redirecting to secure payment…"
              ) : (
                <>
                  <CreditCard size={17} /> Pay {formatPrice(subtotal)}
                </>
              )}
            </button>
            <Link
              href="/cart"
              className="mt-3 block text-center text-[12px] uppercase tracking-wider2 text-ink-muted link-underline"
            >
              ← Back to cart
            </Link>
          </div>
        </div>

        {/* Right — summary */}
        <aside className="order-first border-b border-stone-200 bg-cream/40 px-5 py-8 sm:px-10 lg:order-last lg:border-b-0 lg:border-l lg:py-16">
          <div className="mx-auto max-w-md lg:sticky lg:top-24">
            <p className="label-caps text-ink-muted">Order summary · {count} {count === 1 ? "item" : "items"}</p>
            <ul className="mt-5 space-y-4">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.variant}`} className="flex items-center gap-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-white">
                    <Image src={line.image} alt={line.name} fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-stone-500 text-[10px] text-paper">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-base">{line.name}</p>
                    <p className="text-[12px] text-stone-400">{line.variant}</p>
                  </div>
                  <span className="text-sm tabular-nums">{formatPrice(line.price * line.quantity)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2.5 border-t border-stone-200 pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Shipping</dt>
                <dd className="text-success">Free</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-stone-200 pt-4">
              <span className="text-[13px] uppercase tracking-wider2">Total</span>
              <span className="font-serif text-3xl tabular-nums">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
