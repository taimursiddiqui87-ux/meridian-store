import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategory,
  categories,
  categoryEditorial,
  collectionLabels,
} from "@/lib/data";
import { getProductsByCategory } from "@/lib/products";
import { ComingSoon } from "@/components/category/ComingSoon";
import { CategoryHero } from "@/components/category/CategoryHero";
import { ProductListing } from "@/components/shop/ProductListing";
import { PromoSplit } from "@/components/home/PromoSplit";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategory(params.slug);
  if (!category) return { title: "Not found" };
  return {
    title: `${category.name}${category.status === "coming-soon" ? " — Coming Soon" : ""}`,
    description: category.description,
  };
}

export const revalidate = 300;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { c?: string };
}) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  // Future lines can still tease before launch.
  if (category.status === "coming-soon") return <ComingSoon category={category} />;

  const items = await getProductsByCategory(category.slug);
  const editorial = categoryEditorial[category.slug];
  const initialCollections = searchParams.c ? [searchParams.c] : [];

  return (
    <>
      <CategoryHero category={category} count={items.length} />

      <div className="container-luxe py-10">
        <ProductListing
          products={items}
          initialCollections={initialCollections}
          collectionLabel={collectionLabels[category.slug] ?? "Collection"}
        />
      </div>

      {editorial && (
        <section className="container-luxe pb-20 pt-6">
          <Reveal>
            <PromoSplit promo={editorial} reverse={category.slug === "jewelry"} />
          </Reveal>
        </section>
      )}
    </>
  );
}
