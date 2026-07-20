import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/data";

/** Sveston-style tile strip under the hero — every line the store carries. */
const tiles = [
  {
    label: "Men's Watches",
    href: "/category/watches?c=Men",
    image: img("1523275335684-37898b6baf30", 900),
  },
  {
    label: "Women's Watches",
    href: "/category/watches?c=Women",
    image: img("1620625515032-6ed0c1790c75", 900),
  },
  {
    label: "Sport Watches",
    href: "/category/watches?c=Sport",
    image: img("1594534475808-b18fc33b045e", 900),
  },
  {
    label: "Perfumes",
    href: "/category/perfumes",
    image: img("1615634260167-c8cdede054de", 900),
  },
  {
    label: "Jewelry",
    href: "/category/jewelry",
    image: img("1573408301185-9146fe634ad0", 900),
  },
];

export function CategoryTiles() {
  return (
    <section className="border-b border-stone-200 bg-white">
      <div className="container-luxe grid grid-cols-2 gap-3 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {tiles.map((t, i) => (
          <Link
            key={t.label}
            href={t.href}
            className={`group relative block overflow-hidden rounded-xl2 bg-ink ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={t.image}
                alt={t.label}
                fill
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
            <span className="absolute inset-x-0 bottom-0 bg-ink/95 py-3 text-center text-[10.5px] font-bold uppercase tracking-luxe text-paper transition-colors duration-300 group-hover:bg-brass-500 group-hover:text-ink">
              Shop {t.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
