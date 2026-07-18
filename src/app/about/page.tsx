import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/data";
import { getSiteConfig } from "@/lib/settings";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getSiteConfig();
  return {
    title: "Our Story",
    description: about.intro.slice(0, 155),
  };
}

export default async function AboutPage() {
  const { about } = await getSiteConfig();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[52vh] min-h-[380px] bg-ink">
        <Image
          src={img("1533139502658-0198f920d8e8", 2000)}
          alt="Workshop"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        <div className="container-luxe absolute inset-0 flex items-end pb-12">
          <div className="max-w-2xl">
            <p className="eyebrow text-brass-300">{about.heroEyebrow}</p>
            <h1 className="mt-3 font-serif text-5xl leading-none text-paper sm:text-6xl">
              {about.heroTitle}
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container-luxe py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-2xl leading-relaxed text-ink-soft text-balance sm:text-3xl">
            {about.intro}
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {about.values.map((v) => (
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
          {about.stats.map((s) => (
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
          <p className="eyebrow">{about.storyEyebrow}</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{about.storyTitle}</h2>
          <p className="mt-5 leading-relaxed text-ink-muted text-pretty">{about.storyBody}</p>
          <Link href="/shop" className="btn-primary mt-8">
            Explore the collection
          </Link>
        </div>
      </section>
    </div>
  );
}
