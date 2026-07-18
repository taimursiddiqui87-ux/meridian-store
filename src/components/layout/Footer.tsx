import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter, Mail, ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/data";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Shop All", href: "/shop" },
      { label: "Watches", href: "/category/watches" },
      { label: "Perfumes", href: "/category/perfumes" },
      { label: "Jewelry", href: "/category/jewelry" },
      { label: "New Arrivals", href: "/shop?sort=new" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Warranty", href: "/warranty" },
      { label: "Track Your Order", href: "/account/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "The Journal", href: "/journal" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
      { label: "Store Locator", href: "/stores" },
    ],
  },
];

const payments = ["Cash on Delivery", "Visa", "Mastercard", "JazzCash", "Easypaisa"];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-luxe grid gap-8 py-14 lg:grid-cols-2 lg:items-center lg:py-16">
          <div>
            <p className="eyebrow text-brass-400">The Meridian List</p>
            <h3 className="mt-3 max-w-md font-serif text-3xl leading-tight text-paper sm:text-4xl">
              Early access, private releases and 10% off your first order.
            </h3>
          </div>
          <form className="flex w-full max-w-md gap-0 lg:ml-auto">
            <div className="flex flex-1 items-center gap-3 border border-white/20 bg-white/5 px-4">
              <Mail size={18} className="text-paper/50" />
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-transparent py-4 text-sm text-paper outline-none placeholder:text-paper/40"
              />
            </div>
            <button type="submit" className="btn bg-brass-500 px-6 text-ink transition-colors hover:bg-brass-400">
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="container-luxe grid grid-cols-2 gap-10 py-14 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-2">
          <span className="font-serif text-3xl font-semibold tracking-[0.14em]">{BRAND.name}</span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
            {BRAND.tagline} Hand-finished timepieces and considered essentials, designed in-house and built
            to be handed down.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-paper/70 transition-colors hover:border-brass-400 hover:text-brass-400"
              >
                <Icon size={17} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="label-caps mb-5 text-paper/40">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-paper/70 transition-colors hover:text-brass-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-luxe flex flex-col items-center justify-between gap-5 py-6 sm:flex-row">
          <p className="text-[12px] text-paper/50">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded border border-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-paper/60"
              >
                {p}
              </span>
            ))}
          </div>
          <div className="flex gap-5 text-[12px] text-paper/50">
            <Link href="/privacy" className="hover:text-paper">Privacy</Link>
            <Link href="/terms" className="hover:text-paper">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
