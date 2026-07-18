"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, ShieldCheck, Truck, AlertCircle, Tag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAppliedCoupon } from "@/hooks/useAppliedCoupon";
import { computeTotals, type CheckoutRules } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/utils";
import { placeOrder } from "@/app/actions/checkout";

const methods = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay in cash when your order arrives", live: true },
  { id: "card", label: "Credit / Debit Card", desc: "Visa · Mastercard", live: false },
  { id: "jazzcash", label: "JazzCash", desc: "Mobile wallet & cards", live: false },
  { id: "easypaisa", label: "Easypaisa", desc: "Mobile wallet & cards", live: false },
];

const brandMark: Record<string, { bg: string; text: string; label: string }> = {
  jazzcash: { bg: "#B01C2E", text: "#fff", label: "JC" },
  easypaisa: { bg: "#1FA64A", text: "#fff", label: "ep" },
};

export function CheckoutView({ rules, storeName }: { rules: CheckoutRules; storeName: string }) {
  const { lines, subtotal, count } = useCart();
  const { applied, error: couponError, apply, remove: removeCoupon } = useAppliedCoupon(subtotal);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState("cod");
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
  });
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  useEffect(() => setMounted(true), []);

  const totals = computeTotals(subtotal, rules, applied?.discount ?? 0);

  const onApply = async () => {
    if (!code.trim()) return;
    setApplying(true);
    const ok = await apply(code);
    if (ok) setCode("");
    setApplying(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await placeOrder({ ...form, method, couponCode: applied?.code, lines });
      if (!res.ok || !res.orderId) {
        setError(res.error ?? "Could not place your order.");
        setLoading(false);
        return;
      }
      router.push(`/checkout/success?order=${res.orderId}`);
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
          <Link href="/shop" className="btn-primary mt-8">Browse the store</Link>
        </div>
      </div>
    );
  }

  const selected = methods.find((m) => m.id === method);

  return (
    <div className="border-t border-stone-200">
      <form onSubmit={submit} className="mx-auto grid max-w-6xl lg:grid-cols-[1fr_440px]">
        {/* Left — details + payment */}
        <div className="px-5 py-10 sm:px-10 lg:py-14">
          <div className="mx-auto max-w-lg space-y-8">
            <Link href="/" className="font-serif text-2xl font-semibold tracking-[0.14em]">
              {storeName}
            </Link>

            {error && (
              <div className="flex items-start gap-2 border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {/* Contact */}
            <section>
              <h2 className="mb-4 font-serif text-2xl">Contact</h2>
              <label className="field-label">Email address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
                placeholder="you@email.com"
                className="field-input"
              />
            </section>

            {/* Shipping */}
            <section>
              <h2 className="mb-4 font-serif text-2xl">Shipping address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input required value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} placeholder="First name" className="field-input" />
                <input required value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} placeholder="Last name" className="field-input" />
                <input required value={form.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="Phone (e.g. 03xx-xxxxxxx)" className="field-input col-span-2" />
                <input required value={form.address} onChange={(e) => set({ address: e.target.value })} placeholder="Address" className="field-input col-span-2" />
                <input required value={form.city} onChange={(e) => set({ city: e.target.value })} placeholder="City" className="field-input" />
                <input value={form.postalCode} onChange={(e) => set({ postalCode: e.target.value })} placeholder="Postal code" className="field-input" />
                <input value={form.country} onChange={(e) => set({ country: e.target.value })} placeholder="Country" className="field-input col-span-2" />
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="mb-4 font-serif text-2xl">Payment method</h2>
              <div className="space-y-3">
                {methods.map((m) => {
                  const active = method === m.id;
                  const mark = brandMark[m.id];
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={cn(
                        "flex w-full items-center gap-4 border px-4 py-4 text-left transition-colors",
                        active ? "border-ink bg-white" : "border-stone-200 hover:border-stone-300",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                          active ? "border-ink" : "border-stone-300",
                        )}
                      >
                        {active && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
                      </span>
                      {m.id === "cod" ? (
                        <Banknote size={22} className="text-brass-600" />
                      ) : m.id === "card" ? (
                        <CreditCard size={22} className="text-brass-600" />
                      ) : (
                        <span
                          className="grid h-6 w-9 place-items-center rounded text-[11px] font-bold"
                          style={{ backgroundColor: mark.bg, color: mark.text }}
                        >
                          {mark.label}
                        </span>
                      )}
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-ink">{m.label}</span>
                        <span className="block text-[12px] text-ink-muted">{m.desc}</span>
                      </span>
                      {m.live ? (
                        <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-success">
                          Live
                        </span>
                      ) : (
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-500">
                          Demo
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Method-specific fields */}
              <div className="mt-4">
                {method === "cod" && (
                  <p className="flex items-center gap-2 border border-brass-200 bg-brass-50 px-4 py-3 text-[13px] text-ink-soft">
                    <Banknote size={16} className="shrink-0 text-brass-600" />
                    Pay in cash when your order is delivered. No advance payment needed.
                  </p>
                )}
                {method === "card" && (
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Card number" className="field-input col-span-2" inputMode="numeric" />
                    <input placeholder="Name on card" className="field-input col-span-2" />
                    <input placeholder="MM / YY" className="field-input" inputMode="numeric" />
                    <input placeholder="CVC" className="field-input" inputMode="numeric" />
                  </div>
                )}
                {(method === "jazzcash" || method === "easypaisa") && (
                  <input
                    placeholder={`${selected?.label} mobile number (03xx-xxxxxxx)`}
                    className="field-input"
                    inputMode="numeric"
                  />
                )}
                {method !== "cod" && (
                  <p className="mt-2 text-[12px] text-stone-400">
                    Demo mode — no real charge is made. Connect your {selected?.label} merchant account
                    to accept live payments.
                  </p>
                )}
              </div>
            </section>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Placing your order…" : `Place order · ${formatPrice(totals.total)}`}
            </button>
            <Link
              href="/cart"
              className="block text-center text-[12px] uppercase tracking-wider2 text-ink-muted link-underline"
            >
              ← Back to cart
            </Link>
          </div>
        </div>

        {/* Right — summary */}
        <aside className="order-first border-b border-stone-200 bg-cream/40 px-5 py-8 sm:px-10 lg:order-last lg:border-b-0 lg:border-l lg:py-14">
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

            {/* Promo code */}
            {applied ? (
              <div className="mt-5 flex items-center justify-between gap-2 border border-success/30 bg-success/5 px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2 text-success">
                  <Check size={15} /> <span className="font-medium">{applied.code}</span> · {applied.label}
                </span>
                <button type="button" onClick={removeCoupon} className="text-[12px] text-stone-400 hover:text-danger">
                  Remove
                </button>
              </div>
            ) : (
              <div className="mt-5">
                <div className="flex gap-2">
                  <div className="flex flex-1 items-center gap-2 border border-stone-200 bg-white px-3">
                    <Tag size={15} className="text-stone-400" />
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onApply();
                        }
                      }}
                      placeholder="Promo code"
                      className="w-full bg-transparent py-2.5 text-sm uppercase outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onApply}
                    disabled={applying || !code.trim()}
                    className="btn border border-ink px-4 text-[12px] uppercase tracking-wider2 hover:bg-ink hover:text-paper disabled:opacity-40"
                  >
                    {applying ? "…" : "Apply"}
                  </button>
                </div>
                {couponError && <p className="mt-2 text-[12px] text-danger">{couponError}</p>}
              </div>
            )}

            <dl className="mt-6 space-y-2.5 border-t border-stone-200 pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Discount</dt>
                  <dd className="tabular-nums">−{formatPrice(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-muted">Shipping</dt>
                <dd className={totals.shipping === 0 ? "text-success" : "tabular-nums"}>
                  {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
                </dd>
              </div>
              {totals.tax > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Tax</dt>
                  <dd className="tabular-nums">{formatPrice(totals.tax)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-stone-200 pt-4">
              <span className="text-[13px] uppercase tracking-wider2">Total</span>
              <span className="font-serif text-3xl tabular-nums">{formatPrice(totals.total)}</span>
            </div>

            <div className="mt-6 space-y-2 border-t border-stone-200 pt-5 text-[12px] text-ink-muted">
              <p className="flex items-center gap-2"><ShieldCheck size={14} className="text-brass-600" /> Secure checkout · 2-year warranty</p>
              <p className="flex items-center gap-2"><Truck size={14} className="text-brass-600" /> Insured delivery, 2–4 days</p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
