import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products as seedProducts } from "@/lib/data";
import { getProduct, getRelatedProducts } from "@/lib/products";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const revalidate = 300;

export function generateStaticParams() {
  return seedProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.slug, 4);

  return (
    <>
      <ProductDetail product={product} />
      <section className="container-luxe py-16 lg:py-24">
        <SectionHeading eyebrow="You May Also Like" title="Complete the collection" />
        <ProductGrid products={related} className="mt-12" />
      </section>
    </>
  );
}
