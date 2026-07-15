"use client";

import { useMemo, useState } from "react";
import { Search, Download, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { recentOrders } from "@/lib/adminData";
import { PageHeader, Card, Pill } from "@/components/admin/AdminUI";

const tabs = ["All", "Paid", "Fulfilled", "Pending", "Refunded"] as const;

export function OrdersAdmin() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recentOrders.filter((o) => {
      if (tab !== "All" && o.status !== tab) return false;
      if (q && !`${o.id} ${o.customer} ${o.email} ${o.product}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tab, query]);

  const count = (t: (typeof tabs)[number]) =>
    t === "All" ? recentOrders.length : recentOrders.filter((o) => o.status === t).length;

  return (
    <div>
      <PageHeader title="Orders" subtitle="Manage, fulfil and track every order.">
        <button className="btn rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-[13px] hover:bg-stone-50">
          <Download size={15} /> Export CSV
        </button>
      </PageHeader>

      <Card>
        {/* Tabs + search */}
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
                <span className={cn("ml-1.5", tab === t ? "text-paper/60" : "text-stone-400")}>
                  {count(t)}
                </span>
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
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
                <tr key={o.id} className="cursor-pointer hover:bg-stone-50/60">
                  <td className="px-5 py-3.5 font-medium text-ink">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-ink">{o.customer}</p>
                    <p className="text-[12px] text-stone-400">{o.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-stone-500">{o.items}</td>
                  <td className="px-5 py-3.5 tabular-nums">{o.total}</td>
                  <td className="px-5 py-3.5 text-[13px] text-stone-500">{o.payment}</td>
                  <td className="px-5 py-3.5">
                    <Pill status={o.status} />
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
      </Card>
    </div>
  );
}
