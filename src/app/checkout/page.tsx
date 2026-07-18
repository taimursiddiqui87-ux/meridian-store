import { getSiteConfig } from "@/lib/settings";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const { checkout, store } = await getSiteConfig();
  return <CheckoutView rules={checkout} storeName={store.name} />;
}
