import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

function CategoryCard({ category, big }: { category: Category; big?: boolean }) {
  const live = category.status === "live";
  const href = `/category/${category.slug}`;

  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-xl2 bg-ink",
        big ? "h-[440px] md:h-full" : "h-[300px] md:h-full",
      )}
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes={big ? "(max-width:768px) 100vw, 66vw" : "(max-width:768px) 100vw, 33vw"}
        className={cn(
          "object-cover transition-transform duration-[1100ms] ease-luxe group-hover:scale-105",
          !live && "opacity-90",
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />

      {!live && (
        <span className="absolute left-5 top-5 rounded-full bg-paper/95 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider2 text-ink">
          Coming {category.launch}
        </span>
      )}

      {/* Copy */}
      <div className="absolute inset-x-0 bottom-12 p-6 lg:p-8">
        <p className="text-[11px] uppercase tracking-wider2 text-brass-300">{category.tagline}</p>
        <h3
          className={cn(
            "mt-2 font-serif leading-none text-paper",
            big ? "text-4xl sm:text-5xl" : "text-3xl",
          )}
        >
          {category.name}
        </h3>
        {big && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/75">{category.description}</p>
        )}
      </div>

      {/* Sveston-style shop bar */}
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-ink/95 py-3.5 text-[11px] font-bold uppercase tracking-luxe text-paper transition-colors duration-300 group-hover:bg-brass-500 group-hover:text-ink">
        {live ? (
          `Shop ${category.name}`
        ) : (
          <>
            <Bell size={13} /> Notify me at launch
          </>
        )}
      </span>
    </Link>
  );
}

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const [first, ...rest] = categories;
  return (
    <div className="grid gap-4 md:h-[620px] md:grid-cols-3 md:grid-rows-2">
      <div className="md:col-span-2 md:row-span-2">
        <CategoryCard category={first} big />
      </div>
      {rest.map((c) => (
        <CategoryCard key={c.slug} category={c} />
      ))}
    </div>
  );
}
