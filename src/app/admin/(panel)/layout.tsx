import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSiteConfig } from "@/lib/settings";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  const { store } = await getSiteConfig();
  return (
    <AdminShell admin={admin} storeName={store.name}>
      {children}
    </AdminShell>
  );
}
