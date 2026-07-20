"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "./AnnouncementBar";
import { SaleBar } from "./SaleBar";
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
  sale,
}: {
  children: React.ReactNode;
  store: SiteConfig["store"];
  announcements: string[];
  watchNav: NavProduct[];
  sale: SiteConfig["sale"];
}) {
  const pathname = usePathname();
  // Admin has its own shell; checkout is a focused, chrome-less funnel.
  if (pathname?.startsWith("/admin") || pathname === "/checkout") {
    return <>{children}</>;
  }
  return (
    <>
      <SaleBar sale={sale} />
      <AnnouncementBar messages={announcements} />
      <Header
        storeName={store.name}
        established={store.established}
        tagline={store.tagline}
        watchNav={watchNav}
      />
      <main>{children}</main>
      <Footer store={store} />
      <CartDrawer />
    </>
  );
}
