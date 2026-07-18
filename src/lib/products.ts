import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { products as seedProducts } from "./data";
import type { Product, ProductVariant, Spec } from "./types";

/**
 * DB-backed catalog. The storefront reads active products from Postgres and
 * falls back to the static seed catalog (src/lib/data.ts) whenever the table is
 * empty or the database is unreachable — so the site always renders.
 *
 * Admin writes go through src/app/actions/products.ts, which busts the
 * "products" cache tag so every storefront surface refreshes on save.
 */

type Row = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  collection: string;
  variantLabel: string | null;
  shortDescription: string;
  description: string;
  images: unknown;
  variants: unknown;
  specs: unknown;
  features: unknown;
  rating: number;
  reviewCount: number;
  badge: string | null;
  inStock: boolean;
  stock: number;
  sku: string;
  isNew: boolean;
  isBestseller: boolean;
  active: boolean;
};

function toProduct(row: Row): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? undefined,
    currency: (row.currency || "usd").toUpperCase(),
    collection: row.collection,
    variantLabel: row.variantLabel ?? undefined,
    shortDescription: row.shortDescription,
    description: row.description,
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    variants: Array.isArray(row.variants) ? (row.variants as ProductVariant[]) : [],
    specs: Array.isArray(row.specs) ? (row.specs as Spec[]) : [],
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    rating: row.rating,
    reviewCount: row.reviewCount,
    badge: row.badge ?? undefined,
    inStock: row.inStock,
    stock: row.stock,
    sku: row.sku,
    isNew: row.isNew || undefined,
    isBestseller: row.isBestseller || undefined,
    active: row.active,
  };
}

/** Uncached read of every ACTIVE product, DB-first with seed fallback. */
async function readActive(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (!rows.length) return seedProducts;
    return rows.map((r) => toProduct(r as Row));
  } catch {
    return seedProducts;
  }
}

/** Cached storefront catalog (revalidated via the "products" tag on any admin save). */
export const getProducts = unstable_cache(readActive, ["products"], {
  tags: ["products"],
  revalidate: 300,
});

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.category === slug);
}

/** Same-category products first, then the rest of the store. */
export async function getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, limit);
  const same = all.filter((p) => p.category === current.category && p.slug !== slug);
  const rest = all.filter((p) => p.category !== current.category && p.slug !== slug);
  return [...same, ...rest].slice(0, limit);
}

/**
 * Uncached read of ALL products (including drafts) for the admin table.
 * Returns null-safe rows straight from the DB, seeding on first run if empty.
 */
export async function getAdminProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (!rows.length) return seedProducts;
    return rows.map((r) => toProduct(r as Row));
  } catch {
    return seedProducts;
  }
}
