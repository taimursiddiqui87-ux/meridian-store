import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/settings";
import { PolicyLayout } from "@/components/marketing/PolicyLayout";

export const metadata: Metadata = { title: "Warranty" };
export const revalidate = 3600;

export default async function WarrantyPage() {
  const { store } = await getSiteConfig();
  return (
    <PolicyLayout
      title="Warranty"
      intro={`Every ${store.name} timepiece is covered by a 2-year international warranty against manufacturing defects.`}
      sections={[
        {
          heading: "What's covered",
          body: [
            "The warranty covers defects in materials and workmanship — movement faults, and issues with the case, dial or crystal that arise under normal use.",
            "If we find a covered defect, we'll repair or replace the piece at no cost to you.",
          ],
        },
        {
          heading: "What's not covered",
          body: [
            "Normal wear, accidental damage, water damage beyond the stated resistance, unauthorised repairs, theft and loss are not covered.",
            "Straps, batteries and crystals damaged through everyday wear are considered consumable parts.",
          ],
        },
        {
          heading: "Making a claim",
          body: [
            `Email ${store.email} with your order number and a short description (photos help). We'll issue a service reference and instructions.`,
            "Keep your order confirmation as proof of purchase — it's all you need to make a claim.",
          ],
        },
      ]}
    />
  );
}
