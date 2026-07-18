import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/settings";
import { PolicyLayout } from "@/components/marketing/PolicyLayout";

export const metadata: Metadata = { title: "Terms of Service" };
export const revalidate = 3600;

export default async function TermsPage() {
  const { store } = await getSiteConfig();
  return (
    <PolicyLayout
      title="Terms of Service"
      updated="July 2026"
      intro={`These terms govern your use of ${store.name} and any purchase you make from us. By using the site you agree to them.`}
      sections={[
        {
          heading: "Orders & pricing",
          body: [
            "All orders are subject to acceptance and availability. We may cancel an order if an item is out of stock or if a pricing error has occurred, in which case you'll receive a full refund.",
            "Prices and product details may change without notice. The price charged is the one shown at checkout when your order is placed.",
          ],
        },
        {
          heading: "Payment",
          body: [
            "We accept Cash on Delivery and the online payment methods shown at checkout. Title to goods passes to you once payment is received in full (or on delivery for Cash on Delivery orders).",
          ],
        },
        {
          heading: "Returns & warranty",
          body: [
            "Returns are governed by our Returns & Exchanges policy and timepieces by our Warranty — both linked in the footer.",
          ],
        },
        {
          heading: "Acceptable use",
          body: [
            "You agree not to misuse the site, attempt to disrupt it, or use it for any unlawful purpose. All content and branding on the site remain our property.",
          ],
        },
        {
          heading: "Contact",
          body: [`Questions about these terms? Email ${store.email}.`],
        },
      ]}
    />
  );
}
