import { Truck, ShieldCheck, RefreshCw, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: Truck, title: "Free Worldwide Shipping", desc: "Complimentary on orders over $150" },
  { icon: ShieldCheck, title: "2-Year Warranty", desc: "International movement coverage" },
  { icon: RefreshCw, title: "30-Day Returns", desc: "Changed your mind? No problem" },
  { icon: PenLine, title: "Complimentary Engraving", desc: "Personalise any caseback" },
];

export function TrustBar() {
  return (
    <section className="border-y border-stone-200 bg-cream/50">
      <div className="container-luxe grid grid-cols-2 divide-stone-200 lg:grid-cols-4 lg:divide-x">
        {items.map((item, i) => (
          <div
            key={item.title}
            className={cn(
              "flex items-center gap-4 px-2 py-7 lg:px-8",
              i < 2 && "border-b border-stone-200 lg:border-b-0",
            )}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brass-100 text-brass-700">
              <item.icon size={19} strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-[13px] font-semibold leading-tight text-ink">{item.title}</p>
              <p className="mt-0.5 text-[12px] text-ink-muted">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
