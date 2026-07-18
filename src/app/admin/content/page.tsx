import { getAllBanners } from "@/lib/banners";
import { BannersAdmin } from "@/components/admin/BannersAdmin";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const banners = await getAllBanners();
  return <BannersAdmin banners={banners} />;
}
