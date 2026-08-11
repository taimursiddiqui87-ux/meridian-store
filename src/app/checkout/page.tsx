import { getSiteConfig } from "@/lib/settings";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const { checkout, store, payments } = await getSiteConfig();
  return (
    <CheckoutView
      rules={checkout}
      storeName={store.name}
      enabledMethods={payments.methods}
      manual={payments.manual}
      whatsapp={store.whatsapp}
    />
  );
}
