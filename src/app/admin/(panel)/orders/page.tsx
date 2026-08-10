import { getAllOrders } from "@/lib/orders";
import { formatOrderTotal, formatMoney } from "@/lib/money";
import { OrdersAdmin, type OrderRow } from "@/components/admin/OrdersAdmin";

export const dynamic = "force-dynamic";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const methodLabel: Record<string, string> = {
  cod: "Cash on Delivery",
  card: "Card",
  stripe: "Stripe",
  payoneer: "Payoneer",
  fastpay: "FastPay",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  const rows: OrderRow[] = orders.map((o) => ({
    orderId: o.id,
    id: o.orderNumber,
    customer: o.customerName || "Guest",
    email: o.email,
    product: o.items.map((i) => i.name).join(", ") || "—",
    items: o.items.reduce((n, i) => n + i.quantity, 0),
    // Shows "Rs. 2,780 ($10)" when the shopper browsed in another currency, so
    // the courier knows exactly what to collect on delivery.
    total: formatOrderTotal(o.total, o.displayCurrency, o.displayRate),
    status: cap(o.status),
    statusKey: o.status,
    date: new Date(o.createdAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    payment: methodLabel[o.paymentMethod] ?? o.paymentMethod,
    address: o.shippingAddress || "",
    tracking: o.trackingNumber || "",
    lineItems: o.items.map((i) => ({
      name: i.name,
      variant: i.variant,
      quantity: i.quantity,
      price: formatMoney(i.price, o.displayCurrency ?? "USD", o.displayRate ?? 1),
    })),
  }));

  return <OrdersAdmin orders={rows} />;
}
