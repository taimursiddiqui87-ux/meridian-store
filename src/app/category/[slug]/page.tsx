import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCategory, categories } from "@/lib/data";
import { ComingSoon } from "@/components/category/ComingSoon";

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

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  // Live categories route to the shop grid.
  if (category.status === "live") redirect("/shop");

  return <ComingSoon category={category} />;
}
