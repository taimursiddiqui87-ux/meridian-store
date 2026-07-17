import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";

export function CategoryHero({
  category,
  count,
}: {
  category: Category;
  count: number;
}) {
  const live = categories.filter((c) => c.status === "live");

  return (
    <>
      {/* Cinematic header */}
      <section className="relative h-[46vh] min-h-[400px] bg-ink">
        <Image
          src={category.image}
          alt={category.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
        <div className="container-luxe absolute inset-0 flex items-end pb-10">
          <div className="max-w-2xl">
            <p className="eyebrow text-brass-300">{category.tagline}</p>
            <h1 className="mt-3 font-serif text-5xl leading-none text-paper sm:text-6xl">
              {category.name}
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-paper/75 text-pretty">
              {category.description}
            </p>
            <p className="mt-3 text-[12px] uppercase tracking-wider2 text-paper/50">
              {count} {count === 1 ? "piece" : "pieces"}
            </p>
          </div>
        </div>
      </section>

      {/* Sibling-category chips */}
      <div className="border-b border-stone-200 bg-paper">
        <div className="container-luxe flex flex-wrap items-center gap-2 py-4">
          {live.map((c) => {
            const active = c.slug === category.slug;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={cn(
                  "rounded-full border px-5 py-2 text-[12px] uppercase tracking-wider2 transition-colors",
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-stone-300 text-ink-soft hover:border-ink hover:text-ink",
                )}
              >
                {c.name}
              </Link>
            );
          })}
          <Link
            href="/shop"
            className="ml-auto text-[12px] uppercase tracking-wider2 text-brass-600 link-underline"
          >
            Shop all
          </Link>
        </div>
      </div>
    </>
  );
}
