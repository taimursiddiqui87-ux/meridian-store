import { getSiteConfig } from "@/lib/settings";
import { CartView } from "@/components/cart/CartView";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const { checkout } = await getSiteConfig();
  return <CartView rules={checkout} />;
}
