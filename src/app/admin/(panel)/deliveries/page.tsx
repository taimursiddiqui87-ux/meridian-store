import { Truck, PackageCheck, Clock, MapPin } from "lucide-react";
import { deliveries } from "@/lib/adminData";
import { PageHeader, Card, CardHead, Pill } from "@/components/admin/AdminUI";

const summary = [
  { label: "Processing", value: deliveries.filter((d) => d.status === "Processing").length, icon: Clock },
  { label: "In transit", value: deliveries.filter((d) => d.status === "In transit").length, icon: Truck },
  { label: "Out for delivery", value: deliveries.filter((d) => d.status === "Out for delivery").length, icon: MapPin },
  { label: "Delivered", value: deliveries.filter((d) => d.status === "Delivered").length, icon: PackageCheck },
];

export default function AdminDeliveriesPage() {
  return (
    <div>
      <PageHeader title="Deliveries" subtitle="Track fulfilment and shipments across couriers." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.label} className="flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brass-100 text-brass-700">
              <s.icon size={19} strokeWidth={1.6} />
            </span>
            <div>
              <p className="font-serif text-3xl leading-none tabular-nums">{s.value}</p>
              <p className="mt-1 text-[12px] uppercase tracking-wider text-ink-muted">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Card>
          <CardHead title="Active shipments" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Destination</th>
                  <th className="px-5 py-3 font-medium">Courier</th>
                  <th className="px-5 py-3 font-medium">Tracking</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">ETA</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {deliveries.map((d) => (
                  <tr key={d.order} className="hover:bg-stone-50/60">
                    <td className="px-5 py-3.5 font-medium text-ink">{d.order}</td>
                    <td className="px-5 py-3.5">{d.customer}</td>
                    <td className="px-5 py-3.5 text-stone-500">{d.city}</td>
                    <td className="px-5 py-3.5">{d.courier}</td>
                    <td className="px-5 py-3.5 font-mono text-[12px] text-stone-500">{d.tracking}</td>
                    <td className="px-5 py-3.5">
                      <Pill status={d.status} />
                    </td>
                    <td className="px-5 py-3.5 text-[13px]">{d.eta}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="rounded-md border border-stone-300 px-3 py-1.5 text-[12px] hover:bg-stone-50">
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
