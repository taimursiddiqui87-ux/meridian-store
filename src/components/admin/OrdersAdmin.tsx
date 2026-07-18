"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, ChevronRight, Inbox, X, AlertCircle, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, Card, Pill } from "@/components/admin/AdminUI";
import { updateOrder } from "@/app/actions/orders";

export interface OrderLine {
  name: string;
  variant: string;
  quantity: number;
  price: string;
}

export interface OrderRow {
  orderId: string;
  id: string; // order number
  customer: string;
  email: string;
  product: string;
  items: number;
  total: string;
  status: string; // capitalized for display
  statusKey: string; // lowercase for actions
  date: string;
  payment: string;
  address: string;
  tracking: string;
  lineItems: OrderLine[];
}

const tabs = ["All", "Pending", "Paid", "Fulfilled", "Cancelled"] as const;
const STATUS_OPTIONS = ["pending", "paid", "fulfilled", "cancelled"] as const;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function OrdersAdmin({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<OrderRow | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (tab !== "All" && o.status !== tab) return false;
      if (q && !`${o.id} ${o.customer} ${o.email} ${o.product}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [orders, tab, query]);

  const count = (t: (typeof tabs)[number]) =>
    t === "All" ? orders.length : orders.filter((o) => o.status === t).length;

  const changeStatus = (orderId: string, status: string) =>
    start(async () => {
      setError(null);
      const res = await updateOrder(orderId, { status });
      if (!res.ok) setError(res.error ?? "Update failed.");
      else router.refresh();
    });

  const saveDrawer = (orderId: string, status: string, tracking: string) =>
    start(async () => {
      setError(null);
      const res = await updateOrder(orderId, { status, trackingNumber: tracking });
      if (!res.ok) setError(res.error ?? "Update failed.");
      else {
        setActive(null);
        router.refresh();
      }
    });

  const exportCsv = () => {
    const header = ["Order", "Customer", "Email", "Items", "Total", "Payment", "Status", "Tracking", "Date"];
    const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
    const lines = orders.map((o) =>
      [o.id, o.customer, o.email, String(o.items), o.total, o.payment, o.status, o.tracking, o.date]
        .map(esc)
        .join(","),
    );
    const csv = [header.map(esc).join(","), ...lines].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "meridian-orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"} · live from your store`}
      >
        <button
          onClick={exportCsv}
          disabled={orders.length === 0}
          className="btn rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-[13px] hover:bg-stone-50 disabled:opacity-50"
        >
          <Download size={15} /> Export CSV
        </button>
      </PageHeader>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-3 border-b border-stone-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[13px] transition-colors",
                  tab === t ? "bg-ink text-paper" : "text-ink-muted hover:bg-stone-100",
                )}
              >
                {t}
                <span className={cn("ml-1.5", tab === t ? "text-paper/60" : "text-stone-400")}>{count(t)}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 sm:w-64">
            <Search size={16} className="text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders…"
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="grid place-items-center py-20 text-center">
            <div>
              <Inbox size={30} className="mx-auto mb-3 text-stone-300" />
              <p className="font-serif text-2xl">No orders yet</p>
              <p className="mt-1 text-sm text-ink-muted">
                Orders placed at checkout will appear here in real time.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map((o) => (
                  <tr
                    key={o.orderId}
                    onClick={() => setActive(o)}
                    className="cursor-pointer hover:bg-stone-50/60"
                  >
                    <td className="px-5 py-3.5 font-medium text-ink">{o.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-ink">{o.customer}</p>
                      <p className="text-[12px] text-stone-400">{o.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-stone-500">{o.items}</td>
                    <td className="px-5 py-3.5 tabular-nums">{o.total}</td>
                    <td className="px-5 py-3.5 text-[13px] text-stone-500">{o.payment}</td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={o.statusKey}
                        disabled={pending}
                        onChange={(e) => changeStatus(o.orderId, e.target.value)}
                        className="rounded-md border border-stone-200 bg-white px-2 py-1 text-[13px] outline-none focus:border-ink"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {cap(s)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-stone-500">{o.date}</td>
                    <td className="px-5 py-3.5 text-right">
                      <ChevronRight size={16} className="text-stone-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {active && (
        <OrderDrawer
          key={active.orderId}
          order={active}
          pending={pending}
          onClose={() => setActive(null)}
          onSave={saveDrawer}
        />
      )}
    </div>
  );
}

function OrderDrawer({
  order,
  pending,
  onClose,
  onSave,
}: {
  order: OrderRow;
  pending: boolean;
  onClose: () => void;
  onSave: (orderId: string, status: string, tracking: string) => void;
}) {
  const [status, setStatus] = useState(order.statusKey);
  const [tracking, setTracking] = useState(order.tracking);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <div>
            <h2 className="font-serif text-2xl">{order.id}</h2>
            <p className="text-[13px] text-ink-muted">{order.date}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-ink-muted hover:text-ink">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div>
            <p className="label-caps mb-2 text-stone-400">Customer</p>
            <p className="text-ink">{order.customer}</p>
            <p className="text-[13px] text-ink-muted">{order.email}</p>
            {order.address && <p className="mt-1 text-[13px] text-ink-muted">{order.address}</p>}
          </div>

          <div>
            <p className="label-caps mb-2 text-stone-400">Items</p>
            <div className="divide-y divide-stone-100">
              {order.lineItems.map((li, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2 text-[13px]">
                  <span className="text-ink">
                    {li.name}
                    <span className="text-stone-400">
                      {" "}
                      · {li.variant} × {li.quantity}
                    </span>
                  </span>
                  <span className="tabular-nums text-ink-muted">{li.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3">
              <span className="text-[13px] font-medium">Total</span>
              <span className="tabular-nums font-medium">{order.total}</span>
            </div>
            <p className="mt-1 text-[12px] text-stone-400">Payment: {order.payment}</p>
          </div>

          <div>
            <label className="field-label">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-[13px] transition-colors",
                    status === s ? "border-ink bg-ink text-paper" : "border-stone-200 hover:border-stone-300",
                  )}
                >
                  {cap(s)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label flex items-center gap-1.5">
              <Truck size={14} /> Tracking number
            </label>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. TCS-123456789"
              className="field-input"
            />
            <p className="mt-1.5 text-[12px] text-stone-400">
              Shown to the customer once the order is dispatched.
            </p>
          </div>
        </div>

        <div className="flex gap-3 border-t border-stone-200 p-6">
          <button onClick={onClose} className="btn flex-1 rounded-lg border border-stone-300 py-3 text-[13px] hover:bg-stone-50">
            Cancel
          </button>
          <button
            onClick={() => onSave(order.orderId, status, tracking)}
            disabled={pending}
            className="btn flex-[2] rounded-lg bg-ink py-3 text-[13px] text-paper hover:bg-ink-soft disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
