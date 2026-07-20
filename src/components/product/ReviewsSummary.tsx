import { BadgeCheck, PenSquare } from "lucide-react";
import { testimonials } from "@/lib/data";
import { Stars } from "@/components/ui/Stars";

/**
 * Scents-N-Stories-style reviews block: rating summary with distribution bars
 * plus verified-buyer quotes (demo content from the store's testimonial set).
 */
export function ReviewsSummary({
  rating,
  reviewCount,
  storeEmail,
  productName,
}: {
  rating: number;
  reviewCount: number;
  storeEmail: string;
  productName: string;
}) {
  // Deterministic distribution derived from the average rating.
  const five = Math.min(92, Math.max(45, Math.round(((rating - 3.6) / 1.4) * 100)));
  const four = Math.round((100 - five) * 0.62);
  const three = Math.round((100 - five - four) * 0.6);
  const two = Math.max(0, Math.round((100 - five - four - three) * 0.5));
  const one = Math.max(0, 100 - five - four - three - two);
  const bars = [
    { star: 5, pct: five },
    { star: 4, pct: four },
    { star: 3, pct: three },
    { star: 2, pct: two },
    { star: 1, pct: one },
  ];

  return (
    <section className="border-y border-stone-200 bg-cream/40">
      <div className="container-luxe py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
          {/* Summary */}
          <div>
            <h2 className="font-serif text-3xl">Customer reviews</h2>
            <div className="mt-4 flex items-end gap-3">
              <span className="font-serif text-6xl leading-none">{rating.toFixed(1)}</span>
              <div className="pb-1">
                <Stars rating={rating} size={16} />
                <p className="mt-1 text-[12.5px] text-ink-muted">{reviewCount} verified reviews</p>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {bars.map((b) => (
                <div key={b.star} className="flex items-center gap-3">
                  <span className="w-7 text-[12px] tabular-nums text-ink-muted">{b.star}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                    <div className="h-full rounded-full bg-brass-500" style={{ width: `${b.pct}%` }} />
                  </div>
                  <span className="w-9 text-right text-[11.5px] tabular-nums text-stone-400">
                    {b.pct}%
                  </span>
                </div>
              ))}
            </div>
            <a
              href={`mailto:${storeEmail}?subject=${encodeURIComponent(`Review: ${productName}`)}`}
              className="btn-outline mt-6 inline-flex rounded-full"
            >
              <PenSquare size={15} /> Write a review
            </a>
          </div>

          {/* Quotes */}
          <div className="grid gap-4 sm:grid-cols-2">
            {testimonials.slice(0, 4).map((t) => (
              <figure key={t.id} className="rounded-xl2 bg-white p-5 ring-1 ring-stone-200/80">
                <Stars rating={t.rating} size={13} />
                <blockquote className="mt-3 text-[14px] leading-relaxed text-ink-soft text-pretty">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-ink">{t.author}</span>
                  <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
                    <BadgeCheck size={12} /> Verified buyer
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
