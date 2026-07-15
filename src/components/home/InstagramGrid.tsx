import Image from "next/image";
import { Instagram } from "lucide-react";
import { instagramImages } from "@/lib/data";

export function InstagramGrid() {
  return (
    <section className="container-luxe py-20 lg:py-24">
      <div className="mb-10 text-center">
        <p className="eyebrow justify-center">Follow Along</p>
        <h2 className="mt-3 font-serif text-4xl sm:text-5xl">@meridian</h2>
        <p className="mt-3 text-ink-muted">Tag #WornOnMeridian to be featured.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
        {instagramImages.map((src, i) => (
          <a
            key={i}
            href="#"
            className="group relative aspect-square overflow-hidden bg-cream"
            aria-label="View on Instagram"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width:640px) 33vw, 16vw"
              className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-110"
            />
            <span className="absolute inset-0 grid place-items-center bg-ink/0 text-paper opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100">
              <Instagram size={22} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
