import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const { store } = await getSiteConfig();
  return {
    title: { absolute: `Admin · ${store.name}` },
    robots: { index: false, follow: false },
  };
}

// Passthrough: the login page renders on its own; the (panel) group adds the
// authenticated admin shell.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
