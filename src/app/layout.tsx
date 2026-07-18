import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Chrome } from "@/components/layout/Chrome";
import { getSiteConfig } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const { store } = await getSiteConfig();
  return {
    metadataBase: new URL("https://meridian.example"),
    title: {
      default: `${store.name} — ${store.tagline}`,
      template: `%s · ${store.name}`,
    },
    description:
      "Hand-finished automatic timepieces engineered to be worn for a lifetime. Free worldwide shipping, 2-year warranty and complimentary engraving.",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Chrome store={config.store} announcements={config.announcements}>
            {children}
          </Chrome>
        </CartProvider>
      </body>
    </html>
  );
}
