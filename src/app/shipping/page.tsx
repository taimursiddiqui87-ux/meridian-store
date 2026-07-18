import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/settings";
import { PolicyLayout } from "@/components/marketing/PolicyLayout";

export const metadata: Metadata = { title: "Shipping" };
export const revalidate = 3600;

export default async function ShippingPage() {
  const { store } = await getSiteConfig();
  return (
    <PolicyLayout
      title="Shipping"
      intro={`Every ${store.name} order is dispatched from our workshop in signature packaging, fully insured and tracked door to door.`}
      sections={[
        {
          heading: "Processing time",
          body: [
            "In-stock orders are prepared and dispatched within 24 hours (Monday–Saturday). Engraved and made-to-order pieces may take 2–4 additional working days.",
            "You'll receive an email with your tracking number the moment your order leaves us.",
          ],
        },
        {
          heading: "Delivery estimates",
          body: [
            "Domestic orders typically arrive within 2–4 working days. International orders arrive within 5–10 working days depending on destination and customs clearance.",
            "Delivery windows are estimates, not guarantees — courier delays and customs inspections can occasionally add time.",
          ],
        },
        {
          heading: "Shipping cost",
          body: [
            "Shipping is calculated at checkout based on your cart and destination. Complimentary shipping applies automatically to qualifying orders.",
            "Any import duties or taxes charged on international deliveries are the responsibility of the recipient.",
          ],
        },
        {
          heading: "Need help?",
          body: [`Questions about a delivery? Email us at ${store.email} and we'll track it down for you.`],
        },
      ]}
    />
  );
}
