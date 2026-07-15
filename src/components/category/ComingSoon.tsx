"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Bell, Check, ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";

export function ComingSoon({ category }: { category: Category }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="grid min-h-[calc(100vh-110px)] lg:grid-cols-2">
      {/* Image */}
      <div className="relative min-h-[340px] bg-ink lg:min-h-full">
        <Image
          src={category.image}
          alt={category.name}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        <span className="absolute left-6 top-6 rounded-full bg-paper/95 px-4 py-2 text-[11px] font-medium uppercase tracking-wider2 text-ink">
          Arriving {category.launch}
        </span>
      </div>

      {/* Content */}
      <div className="flex items-center bg-cream px-8 py-16 md:px-14 lg:px-20">
        <div className="max-w-md">
          <p className="eyebrow">The Next Chapter</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.02] text-balance sm:text-6xl">
            {category.name}
          </h1>
          <p className="mt-3 text-lg text-ink-soft">{category.tagline}</p>
          <p className="mt-6 leading-relaxed text-ink-muted text-pretty">{category.description}</p>

          {done ? (
            <div className="mt-8 flex items-center gap-3 border border-success/30 bg-success/5 px-5 py-4 text-success">
              <Check size={20} />
              <p className="text-sm">
                You’re on the list. We’ll email <strong>{email}</strong> the moment {category.name} launches.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setDone(true);
              }}
              className="mt-8"
            >
              <label className="field-label flex items-center gap-2">
                <Bell size={13} /> Get early access
              </label>
              <div className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="field-input flex-1 border-r-0"
                />
                <button type="submit" className="btn bg-ink px-6 text-paper hover:bg-ink-soft">
                  Notify me
                </button>
              </div>
              <p className="mt-3 text-[12px] text-stone-400">
                Be first in line — plus 10% off your first order.
              </p>
            </form>
          )}

          <Link
            href="/shop"
            className="group mt-10 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider2 text-ink"
          >
            <span className="link-underline">Meanwhile, explore watches</span>
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
