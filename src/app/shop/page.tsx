import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ProductListing } from "@/components/shop/ProductListing";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Every Meridian — watches, perfumes and jewelry — in one place.",
};

export const revalidate = 300;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string };
}) {
  const products = await getProducts();
  return (
    <div>
      <div className="border-b border-stone-200 bg-cream/40">
        <div className="container-luxe py-10 lg:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop All" }]} />
          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl leading-none sm:text-5xl">Shop All</h1>
              <p className="mt-3 max-w-xl text-ink-muted">
                Every Meridian in one place — timepieces, extraits de parfum and hand-finished
                jewelry, all built to be kept.
              </p>
            </div>
            <p className="text-[13px] text-stone-500">{products.length} pieces</p>
          </div>
        </div>
      </div>

      <div className="container-luxe py-10">
        <ProductListing
          products={products}
          initialQuery={searchParams.q ?? ""}
          initialSort={searchParams.sort ?? "featured"}
          collectionLabel="Collection"
          showCategoryFilter
        />
      </div>
    </div>
  );
}
