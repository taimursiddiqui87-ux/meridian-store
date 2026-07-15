import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Meridian builds hand-finished timepieces made to be handed down.",
};

const values = [
  { title: "Made to last", body: "Over-engineered movements, sapphire crystal and full-grain straps — built for decades, not seasons." },
  { title: "Honest pricing", body: "We sell direct, so you pay for the watch — not the marketing, the middlemen or the marble boutique." },
  { title: "Quietly confident", body: "No loud logos. Just considered design that earns a second glance from the people who know." },
];

const stats = [
  { value: "2019", label: "Founded" },
  { value: "50k+", label: "Wrists worldwide" },
  { value: "38", label: "Countries shipped" },
  { value: "4.9★", label: "Average rating" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[52vh] min-h-[380px] bg-ink">
        <Image
          src={img("1533139502658-0198f920d8e8", 2000)}
          alt="Meridian workshop"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        <div className="container-luxe absolute inset-0 flex items-end pb-12">
          <div className="max-w-2xl">
            <p className="eyebrow text-brass-300">Our Story</p>
            <h1 className="mt-3 font-serif text-5xl leading-none text-paper sm:text-6xl">
              Time, kept honestly
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container-luxe py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-2xl leading-relaxed text-ink-soft sm:text-3xl text-balance">
            Meridian began with a simple frustration: the watches we loved cost more than a car, and the
            ones we could afford felt like it. So we built the watch we wanted — Swiss-grade mechanics,
            obsessive finishing, and a price that respects you.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="border-t border-ink pt-6">
              <h3 className="font-serif text-2xl">{v.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted text-pretty">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink text-paper">
        <div className="container-luxe grid grid-cols-2 gap-8 py-16 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-4xl text-brass-300 sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-[12px] uppercase tracking-wider2 text-paper/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Split */}
      <section className="container-luxe grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream">
          <Image src={img("1508057198894-247b23fe5ade", 1200)} alt="" fill sizes="50vw" className="object-cover" />
        </div>
        <div>
          <p className="eyebrow">The Workshop</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            Every watch passes through one pair of hands
          </h2>
          <p className="mt-5 leading-relaxed text-ink-muted text-pretty">
            From the first turn of the crown to the final pressure test, a single watchmaker sees each
            Meridian through. It’s slower. It’s more expensive. And it’s the only way we know how to build
            something worth keeping.
          </p>
          <Link href="/shop" className="btn-primary mt-8">
            Explore the collection
          </Link>
        </div>
      </section>
    </div>
  );
}
