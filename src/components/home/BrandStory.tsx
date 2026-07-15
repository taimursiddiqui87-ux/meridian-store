import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { img } from "@/lib/data";

const stats = [
  { value: "50k+", label: "Wrists worldwide" },
  { value: "6-position", label: "Movement regulation" },
  { value: "120 hrs", label: "Assembly & testing" },
];

export function BrandStory() {
  return (
    <section className="bg-ink text-paper">
      <div className="container-luxe grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[5/6]">
          <Image
            src={img("1533139502658-0198f920d8e8", 1200)}
            alt="Meridian watchmaking"
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>

        <div className="lg:pl-8">
          <p className="eyebrow text-brass-400">Our Craft</p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.06] text-balance sm:text-5xl">
            Built by hand, in the quiet hours, to be worn for decades.
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-paper/70 text-pretty">
            Every Meridian begins as a sketch and ends on your wrist only after passing through the hands
            of a single watchmaker. We regulate each movement in six positions, pressure-test every case,
            and finish what most brands hide. The result is a timepiece with nothing to prove and nothing
            to apologise for.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl text-brass-300 sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-[12px] uppercase tracking-wider2 text-paper/50">{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="group mt-10 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider2 text-paper"
          >
            <span className="link-underline">Read our story</span>
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
