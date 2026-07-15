import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products, relatedProducts } from "@/lib/data";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const related = relatedProducts(product.slug, 4);

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
