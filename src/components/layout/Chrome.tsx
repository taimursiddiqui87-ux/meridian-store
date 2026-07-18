"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header, type NavProduct } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import type { SiteConfig } from "@/lib/settings";

/**
 * Storefront chrome is shown on all routes except the admin backend,
 * which provides its own full-screen shell. Branding comes from Site Settings.
 */
export function Chrome({
  children,
  store,
  announcements,
  watchNav,
}: {
  children: React.ReactNode;
  store: SiteConfig["store"];
  announcements: string[];
  watchNav: NavProduct[];
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    <>
      <AnnouncementBar messages={announcements} />
      <Header storeName={store.name} established={store.established} watchNav={watchNav} />
      <main>{children}</main>
      <Footer store={store} />
      <CartDrawer />
    </>
  );
}
