import { getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { OrdersAdmin, type OrderRow } from "@/components/admin/OrdersAdmin";

export const dynamic = "force-dynamic";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const methodLabel: Record<string, string> = {
  cod: "Cash on Delivery",
  card: "Card",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  const rows: OrderRow[] = orders.map((o) => ({
    id: o.orderNumber,
    customer: o.customerName || "Guest",
    email: o.email,
    product: o.items.map((i) => i.name).join(", ") || "—",
    items: o.items.reduce((n, i) => n + i.quantity, 0),
    total: formatPrice(o.total),
    status: cap(o.status),
    date: new Date(o.createdAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    payment: methodLabel[o.paymentMethod] ?? o.paymentMethod,
  }));

  return <OrdersAdmin orders={rows} />;
}
