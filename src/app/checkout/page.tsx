"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Lock,
  ChevronRight,
  CheckCircle2,
  CreditCard,
  Truck,
  Zap,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn, formatPrice } from "@/lib/utils";
import { BRAND } from "@/lib/data";

type Step = "information" | "payment";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const [step, setStep] = useState<Step>("information");
  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [placed, setPlaced] = useState(false);

  const shipping = delivery === "express" ? 2500 : 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;
  const orderNo = "MER-" + (10428 + lines.length * 7);

  if (placed) {
    return (
      <div className="container-luxe grid min-h-[70vh] place-items-center py-16">
        <div className="max-w-lg text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 size={40} strokeWidth={1.4} />
          </div>
          <h1 className="mt-6 font-serif text-4xl sm:text-5xl">Thank you for your order</h1>
          <p className="mt-3 text-ink-muted">
            Order <span className="font-medium text-ink">#{orderNo}</span> is confirmed and being
            prepared.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 border-y border-stone-200 py-4 text-sm text-ink-soft">
            <Mail size={17} className="text-brass-600" />
            A confirmation email has been sent to{" "}
            <strong className="text-ink">{email || "your inbox"}</strong>
          </div>
          <p className="mt-6 text-sm text-ink-muted">
            You’ll receive tracking details within 24 hours. Every Meridian ships insured, in signature
            packaging.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/shop" onClick={() => clear()} className="btn-primary">
              Continue shopping
            </Link>
            <Link href="/account/orders" className="btn-outline">
              View order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-luxe grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <h1 className="font-serif text-4xl">Your cart is empty</h1>
          <p className="mt-3 text-ink-muted">Add a piece before checking out.</p>
          <Link href="/shop" className="btn-primary mt-8">
            Browse watches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-stone-200">
      <div className="mx-auto grid max-w-6xl lg:grid-cols-[1fr_440px]">
        {/* Left — forms */}
        <div className="px-5 py-10 sm:px-10 lg:py-14">
          <div className="mx-auto max-w-lg">
            {/* Steps indicator */}
            <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider2">
              <span className={cn(step === "information" ? "text-ink" : "text-stone-400")}>
                1. Information
              </span>
              <ChevronRight size={14} className="text-stone-300" />
              <span className={cn(step === "payment" ? "text-ink" : "text-stone-400")}>2. Payment</span>
            </div>

            {step === "information" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep("payment");
                }}
                className="mt-8 space-y-8"
              >
                <section>
                  <h2 className="mb-4 font-serif text-2xl">Contact</h2>
                  <div>
                    <label className="field-label">Email address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="field-input"
                    />
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 font-serif text-2xl">Shipping address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="First name" required className="field-input" />
                    <input placeholder="Last name" required className="field-input" />
                    <input placeholder="Address" required className="field-input col-span-2" />
                    <input placeholder="Apartment, suite (optional)" className="field-input col-span-2" />
                    <input placeholder="City" required className="field-input" />
                    <input placeholder="Postal code" required className="field-input" />
                    <input placeholder="Country" required defaultValue="United States" className="field-input col-span-2" />
                    <input placeholder="Phone (for delivery)" className="field-input col-span-2" />
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 font-serif text-2xl">Delivery method</h2>
                  <div className="space-y-3">
                    <DeliveryOption
                      selected={delivery === "standard"}
                      onSelect={() => setDelivery("standard")}
                      icon={Truck}
                      title="Standard — Insured"
                      desc="Arrives in 2–4 business days"
                      price="Free"
                    />
                    <DeliveryOption
                      selected={delivery === "express"}
                      onSelect={() => setDelivery("express")}
                      icon={Zap}
                      title="Express — Next day"
                      desc="Order before 2pm for next-day delivery"
                      price={formatPrice(2500)}
                    />
                  </div>
                </section>

                <button type="submit" className="btn-primary w-full">
                  Continue to payment <ChevronRight size={16} />
                </button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPlaced(true);
                }}
                className="mt-8 space-y-8"
              >
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-serif text-2xl">Payment</h2>
                    <span className="flex items-center gap-1.5 text-[12px] text-stone-400">
                      <Lock size={13} /> Encrypted &amp; secure
                    </span>
                  </div>

                  <div className="border border-stone-200">
                    <div className="flex items-center gap-2 border-b border-stone-200 bg-cream/50 px-4 py-3 text-sm">
                      <CreditCard size={16} className="text-brass-600" /> Credit / debit card
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4">
                      <input placeholder="Card number" className="field-input col-span-2" inputMode="numeric" />
                      <input placeholder="Name on card" className="field-input col-span-2" />
                      <input placeholder="MM / YY" className="field-input" inputMode="numeric" />
                      <input placeholder="CVC" className="field-input" inputMode="numeric" />
                    </div>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-[12px] text-stone-400">
                    <ShieldCheck size={14} /> This is a demo checkout — no payment is processed.
                  </p>
                </section>

                <div className="flex flex-col gap-3">
                  <button type="submit" className="btn-primary w-full">
                    Pay {formatPrice(total)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("information")}
                    className="text-[12px] uppercase tracking-wider2 text-ink-muted link-underline"
                  >
                    ← Return to information
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right — summary */}
        <aside className="order-first border-b border-stone-200 bg-cream/40 px-5 py-8 sm:px-10 lg:order-last lg:border-b-0 lg:border-l lg:py-14">
          <div className="mx-auto max-w-md lg:sticky lg:top-24">
            <Link href="/" className="font-serif text-2xl font-semibold tracking-[0.14em]">
              {BRAND.name}
            </Link>
            <ul className="mt-6 space-y-4">
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
                <dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Tax (est.)</dt>
                <dd className="tabular-nums">{formatPrice(tax)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-stone-200 pt-4">
              <span className="text-[13px] uppercase tracking-wider2">Total</span>
              <span className="font-serif text-3xl tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DeliveryOption({
  selected,
  onSelect,
  icon: Icon,
  title,
  desc,
  price,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ElementType;
  title: string;
  desc: string;
  price: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 border px-4 py-4 text-left transition-colors",
        selected ? "border-ink bg-white" : "border-stone-200 hover:border-stone-300",
      )}
    >
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
          selected ? "border-ink" : "border-stone-300",
        )}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
      </span>
      <Icon size={20} strokeWidth={1.5} className="text-brass-600" />
      <span className="flex-1">
        <span className="block text-sm font-medium text-ink">{title}</span>
        <span className="block text-[12px] text-ink-muted">{desc}</span>
      </span>
      <span className="text-sm tabular-nums">{price}</span>
    </button>
  );
}
