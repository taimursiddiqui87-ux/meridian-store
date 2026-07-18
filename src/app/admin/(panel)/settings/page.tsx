import { getSiteConfigFresh } from "@/lib/settings";
import { getAdminProducts } from "@/lib/products";
import { SettingsAdmin } from "@/components/admin/SettingsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [config, products] = await Promise.all([getSiteConfigFresh(), getAdminProducts()]);
  const catalog = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.images[0],
  }));
  return <SettingsAdmin config={config} catalog={catalog} />;
}
