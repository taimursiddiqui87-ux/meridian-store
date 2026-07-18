import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/settings";
import { PolicyLayout } from "@/components/marketing/PolicyLayout";

export const metadata: Metadata = { title: "Privacy Policy" };
export const revalidate = 3600;

export default async function PrivacyPage() {
  const { store } = await getSiteConfig();
  return (
    <PolicyLayout
      title="Privacy Policy"
      updated="July 2026"
      intro={`${store.name} respects your privacy. This policy explains what we collect, why, and the choices you have.`}
      sections={[
        {
          heading: "Information we collect",
          body: [
            "When you create an account or place an order we collect your name, email address, shipping address, phone number and order details.",
            "We never see or store full card numbers — payments are handled by our payment providers. We store only a payment reference and the method used.",
          ],
        },
        {
          heading: "How we use it",
          body: [
            "We use your information to process orders, send order and delivery updates, provide support, and — only if you opt in — send occasional marketing emails.",
            "We do not sell your personal data.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "We use essential cookies to keep you signed in and to remember your cart. Analytics cookies, if enabled, help us understand how the store is used.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            `You can request a copy of your data, ask us to correct it, or ask us to delete your account at any time by emailing ${store.email}.`,
            "You can unsubscribe from marketing emails using the link in any such email.",
          ],
        },
        {
          heading: "Contact",
          body: [`Questions about this policy? Email ${store.email}.`],
        },
      ]}
    />
  );
}
