"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CreditCard,
  ShieldCheck,
  Truck,
  AlertCircle,
  Tag,
  Check,
  Lock,
  ChevronLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAppliedCoupon } from "@/hooks/useAppliedCoupon";
import { computeTotals, type CheckoutRules } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { placeOrder } from "@/app/actions/checkout";

const methods = [
  {
    id: "cod",
    label: "Cash on Delivery (COD)",
    desc: "Pay in cash to the courier when you receive the parcel at your door-step.",
    live: true,
  },
  { id: "card", label: "Debit / Credit Card", desc: "Visa · Mastercard", live: false },
  { id: "jazzcash", label: "JazzCash", desc: "Mobile wallet & cards", live: false },
  { id: "easypaisa", label: "Easypaisa", desc: "Mobile wallet & cards", live: false },
];

const COUNTRIES = [
  "Pakistan",
  "United States",
  "United Kingdom",
  "Canada",
  "United Arab Emirates",
  "Saudi Arabia",
  "Other",
];

const brandMark: Record<string, { bg: string; text: string; label: string }> = {
  jazzcash: { bg: "#B01C2E", text: "#fff", label: "JC" },
  easypaisa: { bg: "#1FA64A", text: "#fff", label: "ep" },
};

/** Focused, chrome-less checkout shell with its own minimal branded header. */
function Shell({ storeName, children }: { storeName: string; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white">
      <header className="border-b border-stone-200">
        <div className="container-luxe flex h-[72px] items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-[12px] uppercase tracking-wider2 text-ink-muted transition-colors hover:text-ink"
          >
            <ChevronLeft size={15} /> Cart
          </Link>
          <Link href="/" className="text-center" aria-label={`${storeName} home`}>
            <span className="block bg-gradient-to-b from-[#D8BE84] via-brass-500 to-brass-700 bg-clip-text font-serif text-[26px] font-semibold leading-none tracking-[0.2em] text-transparent sm:text-[30px]">
              {storeName}
            </span>
            <span className="mt-0.5 block text-[7.5px] uppercase tracking-[0.3em] text-stone-400">
              Secure checkout
            </span>
          </Link>
          <span className="flex items-center gap-1.5 text-[12px] text-success">
            <Lock size={14} /> <span className="hidden sm:inline">Encrypted</span>
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}

export function CheckoutView({ rules, storeName }: { rules: CheckoutRules; storeName: string }) {
  const { lines, subtotal, count } = useCart();
  const { format, code: currencyCode } = useCurrency();
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
    return (
      <Shell storeName={storeName}>
        <div className="container-luxe py-24 text-center text-ink-muted">Loading checkout…</div>
      </Shell>
    );
  }

  if (lines.length === 0) {
    return (
      <Shell storeName={storeName}>
        <div className="container-luxe grid min-h-[60vh] place-items-center py-20 text-center">
          <div>
            <h1 className="font-serif text-4xl">Your cart is empty</h1>
            <p className="mt-3 text-ink-muted">Add a piece before checking out.</p>
            <Link href="/shop" className="btn-primary mt-8 rounded-full">
              Browse the store
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  const selected = methods.find((m) => m.id === method);

  return (
    <Shell storeName={storeName}>
      <form onSubmit={submit} className="mx-auto grid max-w-6xl lg:grid-cols-[1fr_460px]">
        {/* Left — contact, delivery, payment */}
        <div className="px-5 py-10 sm:px-10">
          <div className="mx-auto max-w-lg space-y-9">
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {/* Contact */}
            <section>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="font-serif text-2xl">Contact</h2>
                <Link href="/account/login" className="text-[12.5px] text-brass-600 link-underline">
                  Sign in
                </Link>
              </div>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
                placeholder="Email"
                autoComplete="email"
                className="field-input rounded-lg"
              />
              <label className="mt-3 flex items-center gap-2.5 text-[13px] text-ink-soft">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-ink" />
                Email me with news and offers
              </label>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="mb-4 font-serif text-2xl">Delivery</h2>
              <div className="grid grid-cols-2 gap-3">
                <label className="col-span-2 block">
                  <span className="mb-1 block text-[11px] uppercase tracking-wider text-stone-400">
                    Country / Region
                  </span>
                  <select
                    value={form.country}
                    onChange={(e) => set({ country: e.target.value })}
                    className="field-input rounded-lg"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <input required value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} placeholder="First name" autoComplete="given-name" className="field-input rounded-lg" />
                <input required value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} placeholder="Last name" autoComplete="family-name" className="field-input rounded-lg" />
                <input required value={form.address} onChange={(e) => set({ address: e.target.value })} placeholder="Address" autoComplete="street-address" className="field-input col-span-2 rounded-lg" />
                <input required value={form.city} onChange={(e) => set({ city: e.target.value })} placeholder="City" autoComplete="address-level2" className="field-input rounded-lg" />
                <input value={form.postalCode} onChange={(e) => set({ postalCode: e.target.value })} placeholder="Postal code (optional)" autoComplete="postal-code" className="field-input rounded-lg" />
                <input required type="tel" value={form.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="Phone (03xx-xxxxxxx)" autoComplete="tel" className="field-input col-span-2 rounded-lg" />
              </div>
              <label className="mt-3 flex items-center gap-2.5 text-[13px] text-ink-soft">
                <input type="checkbox" className="h-4 w-4 accent-ink" />
                Save this information for next time
              </label>
            </section>

            {/* Shipping method */}
            <section>
              <h2 className="mb-4 font-serif text-2xl">Shipping method</h2>
              <div className="flex items-center justify-between rounded-lg border border-ink bg-cream/40 px-4 py-4">
                <span className="flex items-center gap-3 text-[14px] text-ink">
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-ink">
                    <span className="h-2.5 w-2.5 rounded-full bg-ink" />
                  </span>
                  <Truck size={17} className="text-brass-600" />
                  {totals.shipping === 0 ? "Free Shipping" : "Standard Shipping"}
                </span>
                <span className={cn("text-[13px] font-bold", totals.shipping === 0 ? "text-success" : "tabular-nums")}>
                  {totals.shipping === 0 ? "FREE" : format(totals.shipping)}
                </span>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="mb-1 font-serif text-2xl">Payment</h2>
              <p className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-muted">
                <Lock size={13} /> All transactions are secure and encrypted.
              </p>
              <div className="overflow-hidden rounded-lg border border-stone-200">
                {methods.map((m, i) => {
                  const active = method === m.id;
                  const mark = brandMark[m.id];
                  return (
                    <div key={m.id} className={cn(i > 0 && "border-t border-stone-200")}>
                      <button
                        type="button"
                        onClick={() => setMethod(m.id)}
                        className={cn(
                          "flex w-full items-center gap-3.5 px-4 py-4 text-left transition-colors",
                          active ? "bg-cream/50" : "hover:bg-stone-50",
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
                        <span className="flex-1 text-[14px] font-medium text-ink">{m.label}</span>
                        {m.id === "cod" && <Banknote size={20} className="text-brass-600" />}
                        {m.id === "card" && (
                          <span className="flex items-center gap-1">
                            <span className="rounded border border-stone-200 px-1.5 py-0.5 text-[9px] font-bold text-[#1A1F71]">VISA</span>
                            <span className="rounded border border-stone-200 px-1.5 py-0.5 text-[9px] font-bold text-[#EB001B]">MC</span>
                            <CreditCard size={18} className="ml-0.5 text-brass-600" />
                          </span>
                        )}
                        {mark && (
                          <span
                            className="grid h-6 w-9 place-items-center rounded text-[11px] font-bold"
                            style={{ backgroundColor: mark.bg, color: mark.text }}
                          >
                            {mark.label}
                          </span>
                        )}
                        {m.live ? (
                          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-success">
                            Live
                          </span>
                        ) : (
                          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-stone-500">
                            Demo
                          </span>
                        )}
                      </button>

                      {active && (
                        <div className="border-t border-stone-100 bg-stone-50/60 px-4 py-4">
                          {m.id === "cod" && (
                            <p className="text-[13px] leading-relaxed text-ink-soft">{m.desc}</p>
                          )}
                          {m.id === "card" && (
                            <div className="grid grid-cols-2 gap-3">
                              <input placeholder="Card number" className="field-input col-span-2 rounded-lg" inputMode="numeric" />
                              <input placeholder="Name on card" className="field-input col-span-2 rounded-lg" />
                              <input placeholder="MM / YY" className="field-input rounded-lg" inputMode="numeric" />
                              <input placeholder="CVC" className="field-input rounded-lg" inputMode="numeric" />
                            </div>
                          )}
                          {(m.id === "jazzcash" || m.id === "easypaisa") && (
                            <input
                              placeholder={`${m.label} mobile number (03xx-xxxxxxx)`}
                              className="field-input rounded-lg"
                              inputMode="numeric"
                            />
                          )}
                          {m.id !== "cod" && (
                            <p className="mt-2 text-[12px] text-stone-400">
                              Demo mode — no real charge is made. Connect your {selected?.label} merchant
                              account to accept live payments.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="btn h-14 w-full rounded-lg bg-ink text-[13px] font-bold uppercase tracking-wider2 text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
            >
              {loading ? "Placing your order…" : "Complete Order"}
            </button>

            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-200 pt-5 text-[12px] text-stone-400">
              <Link href="/returns" className="hover:text-ink">Refund policy</Link>
              <Link href="/shipping" className="hover:text-ink">Shipping</Link>
              <Link href="/privacy" className="hover:text-ink">Privacy policy</Link>
              <Link href="/terms" className="hover:text-ink">Terms of service</Link>
            </div>
          </div>
        </div>

        {/* Right — order summary */}
        <aside className="order-first border-b border-stone-200 bg-cream/40 px-5 py-8 sm:px-10 lg:order-last lg:border-b-0 lg:border-l">
          <div className="mx-auto max-w-md lg:sticky lg:top-8">
            <p className="label-caps text-ink-muted">
              Order summary · {count} {count === 1 ? "item" : "items"}
            </p>
            <ul className="mt-5 space-y-4">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.variant}`} className="flex items-center gap-4">
                  <div className="relative h-16 w-14 shrink-0 rounded-lg bg-white ring-1 ring-stone-200">
                    <Image src={line.image} alt={line.name} fill sizes="56px" className="rounded-lg object-cover" />
                    <span className="absolute -right-2 -top-2 grid h-5 min-w-[20px] place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-paper">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-base">{line.name}</p>
                    <p className="truncate text-[12px] text-stone-400">{line.variant}</p>
                  </div>
                  <span className="text-sm tabular-nums">{format(line.price * line.quantity)}</span>
                </li>
              ))}
            </ul>

            {/* Discount code */}
            {applied ? (
              <div className="mt-6 flex items-center justify-between gap-2 rounded-lg border border-success/30 bg-success/5 px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2 text-success">
                  <Check size={15} /> <span className="font-medium">{applied.code}</span> · {applied.label}
                </span>
                <button type="button" onClick={removeCoupon} className="text-[12px] text-stone-400 hover:text-danger">
                  Remove
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3">
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
                      placeholder="Discount code"
                      className="w-full bg-transparent py-2.5 text-sm uppercase outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onApply}
                    disabled={applying || !code.trim()}
                    className="btn rounded-lg border border-stone-300 bg-white px-4 text-[12px] uppercase tracking-wider2 hover:border-ink disabled:opacity-40"
                  >
                    {applying ? "…" : "Apply"}
                  </button>
                </div>
                {couponError && <p className="mt-2 text-[12px] text-danger">{couponError}</p>}
              </div>
            )}

            <dl className="mt-6 space-y-2.5 border-t border-stone-200 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd className="tabular-nums">{format(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Discount</dt>
                  <dd className="tabular-nums">−{format(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-muted">Shipping</dt>
                <dd className={totals.shipping === 0 ? "font-medium text-success" : "tabular-nums"}>
                  {totals.shipping === 0 ? "FREE" : format(totals.shipping)}
                </dd>
              </div>
              {totals.tax > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Tax</dt>
                  <dd className="tabular-nums">{format(totals.tax)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-stone-200 pt-4">
              <span className="text-[15px] font-semibold">Total</span>
              <span className="flex items-baseline gap-2">
                <span className="text-[11px] font-medium uppercase text-stone-400">{currencyCode}</span>
                <span className="font-serif text-3xl tabular-nums">{format(totals.total)}</span>
              </span>
            </div>
            {currencyCode !== "USD" && (
              <p className="mt-2 text-[11px] text-stone-400">
                Shown in {currencyCode} at today&apos;s rate — orders are processed in USD.
              </p>
            )}

            <div className="mt-6 space-y-2 border-t border-stone-200 pt-5 text-[12px] text-ink-muted">
              <p className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-brass-600" /> Secure checkout · 2-year warranty
              </p>
              <p className="flex items-center gap-2">
                <Truck size={14} className="text-brass-600" /> COD across Pakistan · insured worldwide delivery
              </p>
            </div>
          </div>
        </aside>
      </form>
    </Shell>
  );
}
