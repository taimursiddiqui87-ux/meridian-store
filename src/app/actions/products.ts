"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { products as seedProducts } from "@/lib/data";

/** Cast structured values for Prisma Json columns (object arrays need this). */
const asJson = (v: unknown) => v as Prisma.InputJsonValue;

export interface ProductInput {
  id?: string;
  name: string;
  category: string; // watches | perfumes | jewelry
  collection: string;
  sku: string;
  priceDollars: number;
  compareAtDollars?: number | null;
  stock: number;
  active: boolean;
  image: string;
  badge?: string | null;
  shortDescription?: string;
  description?: string;
}

export interface ProductActionResult {
  ok: boolean;
  error?: string;
  id?: string;
  slug?: string;
}

async function guard() {
  if (!(await isAdmin())) throw new Error("Not authorized");
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const VARIANT_LABELS: Record<string, string> = {
  watches: "Finish",
  perfumes: "Size",
  jewelry: "Metal",
};

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80";

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "product";
  let slug = root;
  let n = 2;
  // Loop until we find a slug not used by a different product.
  for (;;) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${root}-${n++}`;
  }
}

function revalidateStore(category?: string) {
  revalidateTag("products");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  if (category) revalidatePath(`/category/${category}`);
}

export async function saveProduct(input: ProductInput): Promise<ProductActionResult> {
  try {
    await guard();

    const name = input.name?.trim();
    if (!name) return { ok: false, error: "Product name is required." };
    const category = ["watches", "perfumes", "jewelry"].includes(input.category)
      ? input.category
      : "watches";
    const price = Math.max(0, Math.round((Number(input.priceDollars) || 0) * 100));
    const compareAt =
      input.compareAtDollars != null && Number(input.compareAtDollars) > 0
        ? Math.round(Number(input.compareAtDollars) * 100)
        : null;
    const stock = Math.max(0, Math.round(Number(input.stock) || 0));
    const image = input.image?.trim();

    // Update path — only touch the fields the editor exposes; preserve the rest.
    if (input.id) {
      const existing = await prisma.product.findUnique({ where: { id: input.id } });
      if (existing) {
        const images = Array.isArray(existing.images) ? [...(existing.images as string[])] : [];
        if (image) images[0] = image;
        await prisma.product.update({
          where: { id: input.id },
          data: {
            name,
            category,
            collection: input.collection?.trim() || existing.collection,
            sku: input.sku?.trim() || existing.sku,
            price,
            compareAtPrice: compareAt,
            stock,
            inStock: stock > 0,
            active: input.active,
            badge: input.badge?.trim() || null,
            images: asJson(images.length ? images : [image || PLACEHOLDER_IMG]),
            variantLabel: existing.variantLabel ?? VARIANT_LABELS[category],
            ...(input.shortDescription != null ? { shortDescription: input.shortDescription } : {}),
            ...(input.description != null ? { description: input.description } : {}),
          },
        });
        revalidateStore(category);
        revalidateStore(existing.category); // in case the category changed
        return { ok: true, id: existing.id, slug: existing.slug };
      }
      // id given but not found (e.g. an unseeded seed row) — fall through to create.
    }

    // Create path.
    const slug = await uniqueSlug(name);
    const created = await prisma.product.create({
      data: {
        slug,
        name,
        category,
        price,
        compareAtPrice: compareAt,
        currency: "usd",
        collection: input.collection?.trim() || "General",
        variantLabel: VARIANT_LABELS[category],
        shortDescription: input.shortDescription?.trim() || "",
        description: input.description?.trim() || name,
        images: asJson([image || PLACEHOLDER_IMG]),
        variants: asJson([{ id: "standard", name: "Standard", swatch: "#cbb48a" }]),
        specs: asJson([]),
        features: asJson([]),
        rating: 0,
        reviewCount: 0,
        badge: input.badge?.trim() || null,
        inStock: stock > 0,
        stock,
        sku: input.sku?.trim() || `MER-${slug.toUpperCase().slice(0, 10)}`,
        active: input.active,
        sortOrder: 0,
      },
    });
    revalidateStore(category);
    return { ok: true, id: created.id, slug: created.slug };
  } catch (e) {
    console.error("[saveProduct]", e);
    return { ok: false, error: "Could not save the product. Please try again." };
  }
}

export async function deleteProduct(id: string): Promise<ProductActionResult> {
  try {
    await guard();
    const existing = await prisma.product.findUnique({ where: { id } });
    await prisma.product.delete({ where: { id } });
    revalidateStore(existing?.category);
    return { ok: true };
  } catch (e) {
    console.error("[deleteProduct]", e);
    return { ok: false, error: "Could not delete the product." };
  }
}

/** One-click importer: load the built-in demo catalog into the DB if empty. */
export async function seedCatalog(): Promise<ProductActionResult> {
  try {
    await guard();
    const count = await prisma.product.count();
    if (count > 0) return { ok: true };
    await prisma.product.createMany({
      data: seedProducts.map((p, i) => ({
        slug: p.slug,
        name: p.name,
        category: p.category,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        currency: "usd",
        collection: p.collection,
        variantLabel: p.variantLabel ?? VARIANT_LABELS[p.category] ?? "Finish",
        shortDescription: p.shortDescription,
        description: p.description,
        images: asJson(p.images),
        variants: asJson(p.variants),
        specs: asJson(p.specs),
        features: asJson(p.features),
        rating: p.rating,
        reviewCount: p.reviewCount,
        badge: p.badge ?? null,
        inStock: p.inStock,
        stock: p.stock,
        sku: p.sku,
        isNew: p.isNew ?? false,
        isBestseller: p.isBestseller ?? false,
        active: true,
        sortOrder: i,
      })),
    });
    revalidateStore();
    return { ok: true };
  } catch (e) {
    console.error("[seedCatalog]", e);
    return { ok: false, error: "Could not import the catalog." };
  }
}
