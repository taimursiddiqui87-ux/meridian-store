import { getSiteConfigFresh } from "@/lib/settings";
import { products } from "@/lib/data";
import { SettingsAdmin } from "@/components/admin/SettingsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const config = await getSiteConfigFresh();
  const catalog = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.images[0],
  }));
  return <SettingsAdmin config={config} catalog={catalog} />;
}
