import { Mail } from "lucide-react";
import { customers } from "@/lib/adminData";
import { PageHeader, Card, Pill } from "@/components/admin/AdminUI";

export default function AdminCustomersPage() {
  return (
    <div>
      <PageHeader title="Customers" subtitle={`${customers.length} customers · 2 VIP`} />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Total spent</th>
                <th className="px-5 py-3 font-medium">Tier</th>
                <th className="px-5 py-3 font-medium text-right">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {customers.map((c) => (
                <tr key={c.email} className="hover:bg-stone-50/60">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-stone-200 text-[12px] font-semibold text-ink-soft">
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <div>
                        <p className="font-medium text-ink">{c.name}</p>
                        <p className="text-[12px] text-stone-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-stone-500">{c.location}</td>
                  <td className="px-5 py-3.5 tabular-nums">{c.orders}</td>
                  <td className="px-5 py-3.5 font-medium tabular-nums">{c.spent}</td>
                  <td className="px-5 py-3.5">
                    <Pill status={c.tier} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="ml-auto grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-ink">
                      <Mail size={15} />
                    </button>
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
