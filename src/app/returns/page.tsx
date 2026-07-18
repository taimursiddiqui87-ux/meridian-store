import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/settings";
import { PolicyLayout } from "@/components/marketing/PolicyLayout";

export const metadata: Metadata = { title: "Returns & Exchanges" };
export const revalidate = 3600;

export default async function ReturnsPage() {
  const { store } = await getSiteConfig();
  return (
    <PolicyLayout
      title="Returns & Exchanges"
      intro="If a piece isn't right, we make returning it simple. You have 30 days from delivery to return or exchange most items."
      sections={[
        {
          heading: "30-day window",
          body: [
            "Unworn items in their original condition and packaging can be returned within 30 days of delivery for a full refund to your original payment method.",
            "Refunds are processed within 5–7 working days of us receiving and inspecting the returned item.",
          ],
        },
        {
          heading: "How to start a return",
          body: [
            `Email ${store.email} with your order number and the item you'd like to return or exchange. We'll reply with return instructions.`,
            "Please don't ship anything back before you've heard from us — we'll make sure it's routed correctly.",
          ],
        },
        {
          heading: "Exchanges",
          body: [
            "Want a different variant or size? Start a return and place a new order, or ask us to arrange a direct exchange.",
            "Complimentary ring resizing is available within 60 days on eligible pieces.",
          ],
        },
        {
          heading: "Non-returnable items",
          body: [
            "For hygiene reasons, opened fragrances and pierced earrings can only be returned if faulty. Engraved and personalised items are final sale unless they arrive damaged or defective.",
          ],
        },
      ]}
    />
  );
}
