import { img } from "./data";

export const kpis = [
  { label: "Revenue today", value: "$18,420", delta: "+12.4%", up: true, sub: "vs. yesterday" },
  { label: "Orders today", value: "14", delta: "+3", up: true, sub: "vs. yesterday" },
  { label: "Avg. order value", value: "$1,316", delta: "+4.1%", up: true, sub: "30-day avg" },
  { label: "Conversion rate", value: "3.8%", delta: "-0.3%", up: false, sub: "vs. last week" },
];

/** Last 14 days of revenue (in whole dollars) + order counts. */
export const salesSeries = [
  { day: "Jul 2", revenue: 11200, orders: 9 },
  { day: "Jul 3", revenue: 9800, orders: 8 },
  { day: "Jul 4", revenue: 14300, orders: 11 },
  { day: "Jul 5", revenue: 16750, orders: 13 },
  { day: "Jul 6", revenue: 12100, orders: 10 },
  { day: "Jul 7", revenue: 10400, orders: 8 },
  { day: "Jul 8", revenue: 13900, orders: 11 },
  { day: "Jul 9", revenue: 17600, orders: 14 },
  { day: "Jul 10", revenue: 15200, orders: 12 },
  { day: "Jul 11", revenue: 19100, orders: 15 },
  { day: "Jul 12", revenue: 18300, orders: 14 },
  { day: "Jul 13", revenue: 16900, orders: 13 },
  { day: "Jul 14", revenue: 20400, orders: 16 },
  { day: "Jul 15", revenue: 18420, orders: 14 },
];

export type OrderStatus = "Paid" | "Fulfilled" | "Pending" | "Refunded";

export const recentOrders: {
  id: string;
  customer: string;
  email: string;
  product: string;
  items: number;
  total: string;
  status: OrderStatus;
  date: string;
  payment: string;
}[] = [
  { id: "#MER-10462", customer: "Daniel Roberts", email: "daniel.r@email.com", product: "Aera 39", items: 1, total: "$1,290", status: "Paid", date: "Jul 15, 10:24", payment: "Visa •• 6411" },
  { id: "#MER-10461", customer: "Priya Mehta", email: "priya.m@email.com", product: "Terra GMT", items: 1, total: "$1,490", status: "Fulfilled", date: "Jul 15, 09:58", payment: "Apple Pay" },
  { id: "#MER-10460", customer: "Marcus Brandt", email: "m.brandt@email.com", product: "Noir Chronograph", items: 2, total: "$3,360", status: "Paid", date: "Jul 15, 09:12", payment: "Mastercard •• 2087" },
  { id: "#MER-10459", customer: "Sofia Lombardi", email: "sofia.l@email.com", product: "Heritage 1968", items: 1, total: "$2,150", status: "Pending", date: "Jul 15, 08:47", payment: "PayPal" },
  { id: "#MER-10458", customer: "James Okafor", email: "j.okafor@email.com", product: "Field Officer", items: 1, total: "$920", status: "Fulfilled", date: "Jul 14, 18:30", payment: "Visa •• 1194" },
  { id: "#MER-10457", customer: "Elena Ruiz", email: "elena.r@email.com", product: "Luna Moonphase", items: 1, total: "$1,980", status: "Refunded", date: "Jul 14, 16:05", payment: "Klarna" },
  { id: "#MER-10456", customer: "Tom Becker", email: "tom.b@email.com", product: "Onyx Slim", items: 1, total: "$1,150", status: "Fulfilled", date: "Jul 14, 14:22", payment: "Amex •• 3301" },
];

export const topProducts = [
  { name: "Aera 39", sold: 128, revenue: "$165,120", image: img("1523275335684-37898b6baf30", 200), stock: 38 },
  { name: "Noir Chronograph", sold: 96, revenue: "$161,280", image: img("1611591437281-460bfbe1220a", 200), stock: 22 },
  { name: "Terra GMT", sold: 74, revenue: "$110,260", image: img("1594534475808-b18fc33b045e", 200), stock: 27 },
  { name: "Field Officer", sold: 61, revenue: "$56,120", image: img("1587836374828-4dbafa94cf0e", 200), stock: 51 },
];

export const lowStock = [
  { name: "Heritage 1968", sku: "MER-HERI-38-RG", stock: 9 },
  { name: "Luna Moonphase", sku: "MER-LUNA-39-IV", stock: 14 },
  { name: "Aurora Two-Tone", sku: "MER-AUR-39-TT", stock: 18 },
];

export type DeliveryStatus = "Processing" | "In transit" | "Out for delivery" | "Delivered";

export const deliveries: {
  order: string;
  customer: string;
  city: string;
  courier: string;
  tracking: string;
  status: DeliveryStatus;
  eta: string;
}[] = [
  { order: "#MER-10461", customer: "Priya Mehta", city: "Toronto, CA", courier: "DHL Express", tracking: "DH8842019CA", status: "Out for delivery", eta: "Today" },
  { order: "#MER-10458", customer: "James Okafor", city: "Lagos, NG", courier: "FedEx Intl", tracking: "FX2205518NG", status: "In transit", eta: "Jul 18" },
  { order: "#MER-10456", customer: "Tom Becker", city: "Berlin, DE", courier: "DHL Express", tracking: "DH8842004DE", status: "Delivered", eta: "Jul 14" },
  { order: "#MER-10454", customer: "Ana Costa", city: "Lisbon, PT", courier: "UPS Worldwide", tracking: "UP9930712PT", status: "Processing", eta: "Jul 19" },
  { order: "#MER-10452", customer: "Kenji Sato", city: "Osaka, JP", courier: "FedEx Intl", tracking: "FX2205490JP", status: "In transit", eta: "Jul 17" },
];

export const customers = [
  { name: "Daniel Roberts", email: "daniel.r@email.com", orders: 4, spent: "$4,780", location: "London, UK", tier: "VIP" },
  { name: "Priya Mehta", email: "priya.m@email.com", orders: 3, spent: "$3,960", location: "Toronto, CA", tier: "VIP" },
  { name: "Marcus Brandt", email: "m.brandt@email.com", orders: 2, spent: "$3,360", location: "Berlin, DE", tier: "Returning" },
  { name: "Sofia Lombardi", email: "sofia.l@email.com", orders: 1, spent: "$2,150", location: "Milan, IT", tier: "New" },
  { name: "James Okafor", email: "j.okafor@email.com", orders: 2, spent: "$1,840", location: "Lagos, NG", tier: "Returning" },
];

export const channelBreakdown = [
  { label: "Direct", pct: 42, color: "#B0863F" },
  { label: "Organic search", pct: 28, color: "#17130F" },
  { label: "Social", pct: 18, color: "#AA9E88" },
  { label: "Email", pct: 12, color: "#D4B071" },
];
