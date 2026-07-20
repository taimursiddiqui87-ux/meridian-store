"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { HeroBanner } from "@/lib/types";
import { cn } from "@/lib/utils";

export function HeroCarousel({ banners }: { banners: HeroBanner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6500);
    return () => clearInterval(id);
  }, [paused, count]);

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);
  const active = banners[index];

  return (
    <section
      className="relative h-[64vh] min-h-[500px] w-full overflow-hidden bg-ink lg:h-[70vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Slides */}
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1200ms] ease-luxe",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={b.image}
            alt={b.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn("object-cover", i === index && "animate-kenburns")}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/25" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container-luxe">
          <div
            key={index}
            className={cn(
              "max-w-2xl",
              active.align === "center" && "mx-auto text-center",
            )}
          >
            <Link href={active.primaryCta.href} className="block" aria-label={active.title}>
              {active.badge && (
                <span className="mb-4 inline-block animate-fade-up rounded-full bg-gradient-to-r from-[#E11D2E] to-[#8F0E13] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider2 text-white shadow-soft">
                  {active.badge}
                </span>
              )}
              <p className="eyebrow animate-fade-up text-brass-300">{active.eyebrow}</p>
              <h1 className="mt-4 animate-fade-up animation-delay-100 font-serif text-5xl leading-[1.02] text-paper text-balance transition-opacity duration-300 hover:opacity-90 sm:text-6xl lg:text-7xl">
                {active.title}
              </h1>
              <p className="mt-6 max-w-lg animate-fade-up animation-delay-200 text-base leading-relaxed text-paper/80 text-pretty sm:text-lg">
                {active.subtitle}
              </p>
            </Link>
            <div
              className={cn(
                "mt-9 flex animate-fade-up animation-delay-300 flex-wrap gap-3",
                active.align === "center" && "justify-center",
              )}
            >
              <Link href={active.primaryCta.href} className="btn-gold rounded-full">
                {active.primaryCta.label}
              </Link>
              {active.secondaryCta && (
                <Link href={active.secondaryCta.href} className="btn-outline-light rounded-full">
                  {active.secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-7 z-20">
        <div className="container-luxe flex items-center justify-between">
          <div className="flex items-center gap-3">
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group/dot py-2"
              >
                <span
                  className={cn(
                    "block h-[3px] rounded-full bg-paper/40 transition-all duration-500",
                    i === index ? "w-12 bg-brass-400" : "w-6 group-hover/dot:bg-paper/70",
                  )}
                />
              </button>
            ))}
            <span className="ml-2 text-[12px] tabular-nums text-paper/60">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-paper/25 text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-paper/25 text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
