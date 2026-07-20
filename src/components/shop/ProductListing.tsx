"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";

const priceBuckets = [
  { id: "all", label: "All prices", test: (_p: Product) => true },
  { id: "u200", label: "Under $200", test: (p: Product) => p.price < 20000 },
  { id: "200-500", label: "$200 – $500", test: (p: Product) => p.price >= 20000 && p.price < 50000 },
  { id: "500-1500", label: "$500 – $1,500", test: (p: Product) => p.price >= 50000 && p.price < 150000 },
  { id: "o1500", label: "$1,500+", test: (p: Product) => p.price >= 150000 },
];

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

export function ProductListing({
  products,
  initialQuery = "",
  initialSort = "featured",
  initialCollections = [],
  collectionLabel = "Collection",
  showCategoryFilter = false,
}: {
  products: Product[];
  initialQuery?: string;
  initialSort?: string;
  /** Pre-selected collection chips (deep links like /category/watches?c=Men). */
  initialCollections?: string[];
  collectionLabel?: string;
  showCategoryFilter?: boolean;
}) {
  const collections = useMemo(
    () => Array.from(new Set(products.map((p) => p.collection))).sort(),
    [products],
  );
  const liveCategories = categories.filter((c) => c.status === "live");

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialCollections.filter((c) => products.some((p) => p.collection === c)),
  );
  const [priceBucket, setPriceBucket] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState(
    sortOptions.some((s) => s.id === initialSort) ? initialSort : "featured",
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedCollections([]);
    setPriceBucket("all");
    setInStockOnly(false);
    setQuery("");
  };

  const filtered = useMemo(() => {
    const bucket = priceBuckets.find((b) => b.id === priceBucket)!;
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (q && !`${p.name} ${p.collection} ${p.shortDescription}`.toLowerCase().includes(q)) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
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
  }, [products, query, selectedCategories, selectedCollections, priceBucket, inStockOnly, sort]);

  const activeCount =
    selectedCategories.length +
    selectedCollections.length +
    (priceBucket !== "all" ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const CheckRow = ({
    checked,
    onClick,
    children,
  }: {
    checked: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button onClick={onClick} className="group flex w-full items-center gap-3 text-left text-[14px] text-ink-soft">
      <span
        className={cn(
          "grid h-[18px] w-[18px] place-items-center border transition-colors",
          checked ? "border-ink bg-ink text-paper" : "border-stone-300 group-hover:border-ink",
        )}
      >
        {checked && <Check size={12} strokeWidth={3} />}
      </span>
      {children}
    </button>
  );

  const FilterPanel = () => (
    <div className="space-y-8">
      {showCategoryFilter && (
        <div>
          <h3 className="label-caps mb-4 text-ink">Category</h3>
          <ul className="space-y-2.5">
            {liveCategories.map((c) => (
              <li key={c.slug}>
                <CheckRow
                  checked={selectedCategories.includes(c.slug)}
                  onClick={() => toggle(selectedCategories, setSelectedCategories, c.slug)}
                >
                  {c.name}
                </CheckRow>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="label-caps mb-4 text-ink">{collectionLabel}</h3>
        <ul className="space-y-2.5">
          {collections.map((c) => (
            <li key={c}>
              <CheckRow
                checked={selectedCollections.includes(c)}
                onClick={() => toggle(selectedCollections, setSelectedCollections, c)}
              >
                {c}
              </CheckRow>
            </li>
          ))}
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
        <CheckRow checked={inStockOnly} onClick={() => setInStockOnly((v) => !v)}>
          In stock only
        </CheckRow>
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
          Showing <span className="text-ink">{filtered.length}</span> of {products.length}
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
                <p className="font-serif text-2xl">Nothing matches your filters</p>
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
