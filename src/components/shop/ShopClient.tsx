"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const priceBuckets = [
  { id: "all", label: "All prices", test: () => true },
  { id: "u1000", label: "Under $1,000", test: (p: Product) => p.price < 100000 },
  { id: "1000-1500", label: "$1,000 – $1,500", test: (p: Product) => p.price >= 100000 && p.price < 150000 },
  { id: "1500-2000", label: "$1,500 – $2,000", test: (p: Product) => p.price >= 150000 && p.price < 200000 },
  { id: "o2000", label: "$2,000+", test: (p: Product) => p.price >= 200000 },
];

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

export function ShopClient({
  allProducts,
  initialQuery,
  initialSort,
}: {
  allProducts: Product[];
  initialQuery: string;
  initialSort: string;
}) {
  const collections = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.collection))).sort(),
    [allProducts],
  );

  const [query, setQuery] = useState(initialQuery);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [priceBucket, setPriceBucket] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState(
    sortOptions.some((s) => s.id === initialSort) ? initialSort : "featured",
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollection = (c: string) =>
    setSelectedCollections((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const clearAll = () => {
    setSelectedCollections([]);
    setPriceBucket("all");
    setInStockOnly(false);
    setQuery("");
  };

  const filtered = useMemo(() => {
    const bucket = priceBuckets.find((b) => b.id === priceBucket)!;
    const q = query.trim().toLowerCase();
    let list = allProducts.filter((p) => {
      if (q && !`${p.name} ${p.collection} ${p.shortDescription}`.toLowerCase().includes(q)) return false;
      if (selectedCollections.length && !selectedCollections.includes(p.collection)) return false;
      if (!bucket.test(p)) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "new":
        list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
        break;
    }
    return list;
  }, [allProducts, query, selectedCollections, priceBucket, inStockOnly, sort]);

  const activeCount =
    selectedCollections.length + (priceBucket !== "all" ? 1 : 0) + (inStockOnly ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h3 className="label-caps mb-4 text-ink">Collection</h3>
        <ul className="space-y-2.5">
          {collections.map((c) => {
            const checked = selectedCollections.includes(c);
            return (
              <li key={c}>
                <button
                  onClick={() => toggleCollection(c)}
                  className="group flex w-full items-center gap-3 text-left text-[14px] text-ink-soft"
                >
                  <span
                    className={cn(
                      "grid h-[18px] w-[18px] place-items-center border transition-colors",
                      checked ? "border-ink bg-ink text-paper" : "border-stone-300 group-hover:border-ink",
                    )}
                  >
                    {checked && <Check size={12} strokeWidth={3} />}
                  </span>
                  {c}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="label-caps mb-4 text-ink">Price</h3>
        <ul className="space-y-2.5">
          {priceBuckets.map((b) => (
            <li key={b.id}>
              <button
                onClick={() => setPriceBucket(b.id)}
                className="group flex w-full items-center gap-3 text-left text-[14px] text-ink-soft"
              >
                <span
                  className={cn(
                    "grid h-[18px] w-[18px] place-items-center rounded-full border transition-colors",
                    priceBucket === b.id ? "border-ink" : "border-stone-300 group-hover:border-ink",
                  )}
                >
                  {priceBucket === b.id && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
                </span>
                {b.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="label-caps mb-4 text-ink">Availability</h3>
        <button
          onClick={() => setInStockOnly((v) => !v)}
          className="group flex w-full items-center gap-3 text-left text-[14px] text-ink-soft"
        >
          <span
            className={cn(
              "grid h-[18px] w-[18px] place-items-center border transition-colors",
              inStockOnly ? "border-ink bg-ink text-paper" : "border-stone-300 group-hover:border-ink",
            )}
          >
            {inStockOnly && <Check size={12} strokeWidth={3} />}
          </span>
          In stock only
        </button>
      </div>

      {activeCount > 0 && (
        <button onClick={clearAll} className="text-[12px] uppercase tracking-wider2 text-brass-600 link-underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Page header */}
      <div className="border-b border-stone-200 bg-cream/40">
        <div className="container-luxe py-10 lg:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Watches" }]} />
          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl leading-none sm:text-5xl">Watches</h1>
              <p className="mt-3 max-w-xl text-ink-muted">
                Hand-finished automatic and mechanical timepieces, built to be worn every day and handed
                down.
              </p>
            </div>
            <p className="text-[13px] text-stone-500">{filtered.length} pieces</p>
          </div>
        </div>
      </div>

      <div className="container-luxe py-10">
        {/* Toolbar */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 border border-stone-300 px-4 py-2.5 text-[12px] uppercase tracking-wider2 lg:hidden"
          >
            <SlidersHorizontal size={15} /> Filters
            {activeCount > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-paper">
                {activeCount}
              </span>
            )}
          </button>
          <div className="hidden text-[13px] text-stone-500 lg:block">
            Showing <span className="text-ink">{filtered.length}</span> of {allProducts.length}
          </div>
          <label className="flex items-center gap-3">
            <span className="hidden text-[12px] uppercase tracking-wider2 text-ink-muted sm:block">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="cursor-pointer border border-stone-300 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-ink"
            >
              {sortOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-10 lg:grid-cols-[230px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div className="grid place-items-center border border-dashed border-stone-300 py-24 text-center">
                <div>
                  <p className="font-serif text-2xl">No pieces match your filters</p>
                  <p className="mt-2 text-sm text-ink-muted">Try broadening your selection.</p>
                  <button onClick={clearAll} className="btn-outline mt-6">
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 3} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "" : "pointer-events-none")}>
        <div
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[85%] max-w-xs overflow-y-auto bg-paper p-6 transition-transform duration-300 ease-luxe",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Filters</h2>
            <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
              <X size={22} />
            </button>
          </div>
          <FilterPanel />
          <button onClick={() => setMobileOpen(false)} className="btn-primary mt-8 w-full">
            View {filtered.length} results
          </button>
        </div>
      </div>
    </div>
  );
}
