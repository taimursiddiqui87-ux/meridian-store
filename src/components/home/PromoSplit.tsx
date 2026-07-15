import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PromoBanner } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PromoSplit({ promo, reverse }: { promo: PromoBanner; reverse?: boolean }) {
  return (
    <div className="grid overflow-hidden bg-cream md:grid-cols-2">
      <div className={cn("relative min-h-[320px] md:min-h-[480px]", reverse && "md:order-2")}>
        <Image src={promo.image} alt={promo.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
      </div>
      <div className={cn("flex items-center px-8 py-14 md:px-14 lg:px-20", reverse && "md:order-1")}>
        <div className="max-w-md">
          <p className="eyebrow">{promo.eyebrow}</p>
          <h3 className="mt-4 font-serif text-3xl leading-tight text-balance sm:text-4xl">{promo.title}</h3>
          <p className="mt-4 leading-relaxed text-ink-muted text-pretty">{promo.body}</p>
          <Link
            href={promo.cta.href}
            className="group mt-7 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider2 text-ink"
          >
            <span className="link-underline">{promo.cta.label}</span>
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
