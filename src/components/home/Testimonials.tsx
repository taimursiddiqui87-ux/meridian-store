import type { Testimonial } from "@/lib/types";
import { Stars } from "@/components/ui/Stars";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="container-luxe py-20 lg:py-24">
      <SectionHeading
        align="center"
        eyebrow="Worn & Loved"
        title="Rated 4.9 by 900+ collectors"
        subtitle="We build for the long run — and it shows in what people say after years on the wrist."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="flex flex-col border border-stone-200 bg-white/50 p-7 transition-shadow duration-300 hover:shadow-card"
          >
            <Stars rating={t.rating} size={15} />
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft text-pretty">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-6 border-t border-stone-100 pt-4">
              <p className="text-sm font-semibold text-ink">{t.author}</p>
              <p className="text-[12px] text-stone-400">{t.location}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
