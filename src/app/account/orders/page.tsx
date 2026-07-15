import Image from "next/image";
import Link from "next/link";
import { Package, User, MapPin, Heart, LogOut, ChevronRight } from "lucide-react";
import { img, BRAND } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const sampleOrders = [
  {
    no: "MER-10462",
    date: "July 2, 2026",
    status: "Delivered",
    tone: "text-success bg-success/10",
    total: 129000,
    items: [{ name: "Aera 39", variant: "Midnight Blue", qty: 1, image: img("1523275335684-37898b6baf30", 300) }],
  },
  {
    no: "MER-10455",
    date: "June 20, 2026",
    status: "In transit",
    tone: "text-brass-700 bg-brass-100",
    total: 168000,
    items: [{ name: "Noir Chronograph", variant: "Matte Black", qty: 1, image: img("1611591437281-460bfbe1220a", 300) }],
  },
];

const menu = [
  { label: "Orders", icon: Package, active: true },
  { label: "Profile", icon: User },
  { label: "Addresses", icon: MapPin },
  { label: "Wishlist", icon: Heart },
];

export default function OrdersPage() {
  return (
    <div className="container-luxe py-10 lg:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account" }, { label: "Orders" }]} />
      <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Your Orders</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <div className="border border-stone-200 p-2">
            {menu.map((m) => (
              <button
                key={m.label}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                  m.active ? "bg-ink text-paper" : "text-ink-soft hover:bg-cream"
                }`}
              >
                <m.icon size={17} strokeWidth={1.5} /> {m.label}
              </button>
            ))}
            <button className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-ink-muted hover:bg-cream">
              <LogOut size={17} strokeWidth={1.5} /> Sign out
            </button>
          </div>
        </aside>

        <div className="space-y-5">
          {sampleOrders.map((o) => (
            <div key={o.no} className="border border-stone-200">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-cream/40 px-6 py-4">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-1 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider2 text-stone-400">Order</p>
                    <p className="font-medium">#{o.no}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider2 text-stone-400">Placed</p>
                    <p>{o.date}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider2 text-stone-400">Total</p>
                    <p className="tabular-nums">{formatPrice(o.total)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider ${o.tone}`}>
                  {o.status}
                </span>
              </div>
              <div className="flex items-center gap-4 px-6 py-5">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-cream">
                  <Image src={o.items[0].image} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-serif text-xl">{o.items[0].name}</p>
                  <p className="text-[13px] text-stone-400">
                    {o.items[0].variant} · Qty {o.items[0].qty}
                  </p>
                </div>
                <Link
                  href="#"
                  className="flex items-center gap-1 text-[12px] uppercase tracking-wider2 text-ink hover:text-brass-600"
                >
                  Track <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}

          <p className="pt-2 text-center text-sm text-ink-muted">
            Need help with an order?{" "}
            <Link href="/contact" className="text-ink link-underline">
              Contact {BRAND.name} care
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
