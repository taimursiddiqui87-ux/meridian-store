import type { Metadata } from "next";
import { products } from "@/lib/data";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop Watches",
  description: "Browse the full Meridian collection of automatic and mechanical timepieces.",
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string };
}) {
  return (
    <ShopClient
      allProducts={products}
      initialQuery={searchParams.q ?? ""}
      initialSort={searchParams.sort ?? "featured"}
    />
  );
}
