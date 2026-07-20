import { Banknote, Plane, ShieldCheck, RefreshCw } from "lucide-react";

/** Localized value badges — colorful circles, Sveston-style. */
const items = [
  {
    icon: Banknote,
    title: "Cash on Delivery",
    desc: "Available across Pakistan",
    circle: "bg-amber-100 text-amber-700 ring-amber-200",
  },
  {
    icon: Plane,
    title: "Express Global Shipping",
    desc: "UK · USA · CA · worldwide",
    circle: "bg-sky-100 text-sky-700 ring-sky-200",
  },
  {
    icon: ShieldCheck,
    title: "2-Year Warranty",
    desc: "International coverage",
    circle: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  },
  {
    icon: RefreshCw,
    title: "30-Day Returns",
    desc: "Hassle-free exchanges",
    circle: "bg-rose-100 text-rose-700 ring-rose-200",
  },
];

export function TrustBar() {
  return (
    <section className="border-b border-stone-200 bg-white">
      <div className="container-luxe grid grid-cols-2 gap-x-4 gap-y-8 py-9 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col items-center gap-3 text-center">
            <span
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ring-1 ${item.circle}`}
            >
              <item.icon size={22} strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-[13px] font-semibold leading-tight text-ink">{item.title}</p>
              <p className="mt-1 text-[12px] text-ink-muted">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
