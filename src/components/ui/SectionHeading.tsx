import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  cta,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  cta?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-balance sm:text-5xl">{title}</h2>
        {subtitle && <p className="mt-4 text-ink-muted text-pretty">{subtitle}</p>}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="group inline-flex shrink-0 items-center gap-2 text-[12px] font-medium uppercase tracking-wider2 text-ink"
        >
          <span className="link-underline">{cta.label}</span>
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
