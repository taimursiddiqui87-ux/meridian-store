import { prisma } from "@/lib/prisma";
import { getAdminProducts } from "@/lib/products";
import { ProductsAdmin, type AdminRow } from "@/components/admin/ProductsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [items, count] = await Promise.all([
    getAdminProducts(),
    prisma.product.count().catch(() => 0),
  ]);

  const rows: AdminRow[] = items.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    collection: p.collection,
    sku: p.sku,
    price: Math.round(p.price / 100),
    compareAt: p.compareAtPrice ? Math.round(p.compareAtPrice / 100) : 0,
    stock: p.stock,
    active: p.active !== false,
    image: p.images[0] ?? "",
    badge: p.badge ?? "",
  }));

  return <ProductsAdmin initial={rows} persisted={count > 0} />;
}
