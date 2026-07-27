import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter, Mail, ArrowRight } from "lucide-react";
import type { SiteConfig } from "@/lib/settings";
import { PaymentMarksRow } from "@/components/checkout/PaymentMarks";

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
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer({ store }: { store: SiteConfig["store"] }) {
  const socials = [
    { Icon: Instagram, href: store.instagram || "#" },
    { Icon: Facebook, href: store.facebook || "#" },
    { Icon: Youtube, href: store.youtube || "#" },
    { Icon: Twitter, href: store.twitter || "#" },
  ];
  return (
    <footer className="mt-24 bg-[#F5F5F7] text-ink">
      {/* Newsletter */}
      <div className="border-b border-black/[0.07]">
        <div className="container-luxe grid gap-8 py-14 lg:grid-cols-2 lg:items-center lg:py-16">
          <div>
            <p className="eyebrow text-brass-600">The Insider List</p>
            <h3 className="mt-3 max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl">
              Early access, private releases and 10% off your first order.
            </h3>
          </div>
          <form className="flex w-full max-w-md gap-0 lg:ml-auto">
            <div className="flex flex-1 items-center gap-3 rounded-l-xl border border-stone-300 bg-white px-4">
              <Mail size={18} className="text-stone-400" />
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-transparent py-4 text-sm text-ink outline-none placeholder:text-stone-400"
              />
            </div>
            <button type="submit" className="btn rounded-r-xl bg-ink px-6 text-paper transition-colors hover:bg-ink-soft">
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="container-luxe grid grid-cols-2 gap-10 py-14 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-2">
          <span className="inline-block bg-gradient-to-b from-brass-400 via-brass-600 to-brass-800 bg-clip-text font-serif text-3xl font-semibold tracking-[0.18em] text-transparent">
            {store.name}
          </span>
          <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-stone-500">
            {store.tagline} · {store.established}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
            Hand-finished pieces and considered essentials, designed in-house and built to be handed
            down.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                aria-label="Social link"
                className="grid h-10 w-10 place-items-center rounded-full border border-stone-300 bg-white text-ink-muted transition-colors hover:border-brass-500 hover:text-brass-600"
              >
                <Icon size={17} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="label-caps mb-5 text-stone-500">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-ink-muted transition-colors hover:text-brass-600"
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
      <div className="border-t border-black/[0.07]">
        <div className="container-luxe flex flex-col items-center justify-between gap-5 py-6 sm:flex-row">
          <p className="text-[12px] text-stone-500">
            © {new Date().getFullYear()} {store.name}. All rights reserved.
          </p>
          <PaymentMarksRow className="justify-center" />
          <div className="flex gap-5 text-[12px] text-stone-500">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
