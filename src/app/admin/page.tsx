import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Plus,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { PageHeader, Card, CardHead, Pill } from "@/components/admin/AdminUI";
import {
  kpis,
  salesSeries,
  recentOrders,
  topProducts,
  lowStock,
  channelBreakdown,
} from "@/lib/adminData";

/* Build an SVG area chart from the revenue series. */
function RevenueChart() {
  const W = 640;
  const H = 220;
  const pad = 8;
  const revenues = salesSeries.map((d) => d.revenue);
  const max = Math.max(...revenues);
  const min = Math.min(...revenues) * 0.85;
  const pts = salesSeries.map((d, i) => {
    const x = (i / (salesSeries.length - 1)) * (W - pad * 2) + pad;
    const y = H - pad - ((d.revenue - min) / (max - min)) * (H - pad * 2);
    return [x, y] as const;
  });
  const line = "M " + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L ");
  const area = `${line} L ${W - pad},${H} L ${pad},${H} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B0863F" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#B0863F" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" y1={H * g} x2={W} y2={H * g} stroke="#EEEAE2" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#rev)" />
        <path d={line} fill="none" stroke="#B0863F" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 4 : 0} fill="#B0863F" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between px-2 text-[10px] text-stone-400">
        {salesSeries.filter((_, i) => i % 2 === 0).map((d) => (
          <span key={d.day}>{d.day}</span>
        ))}
      </div>
    </div>
  );
}

function Donut() {
  let acc = 0;
  const stops = channelBreakdown
    .map((c) => {
      const start = acc;
      acc += c.pct;
      return `${c.color} ${start}% ${acc}%`;
    })
    .join(", ");
  return (
    <div className="flex items-center gap-5">
      <div
        className="relative h-28 w-28 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="absolute inset-[22%] grid place-items-center rounded-full bg-white text-center">
          <span className="text-lg font-semibold leading-none">2.4k</span>
          <span className="text-[9px] uppercase tracking-wider text-stone-400">visits</span>
        </div>
      </div>
      <ul className="flex-1 space-y-2">
        {channelBreakdown.map((c) => (
          <li key={c.label} className="flex items-center gap-2 text-[13px]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="flex-1 text-ink-soft">{c.label}</span>
            <span className="font-medium tabular-nums">{c.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const todayReport = [
  { label: "Gross revenue", value: "$18,420" },
  { label: "Orders", value: "14" },
  { label: "Units sold", value: "17" },
  { label: "New customers", value: "6" },
  { label: "Returns / refunds", value: "1" },
  { label: "Avg. order value", value: "$1,316" },
];

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Your store at a glance — Tuesday, 15 July 2026.">
        <button className="btn rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-[13px] hover:bg-stone-50">
          <Download size={15} /> Export
        </button>
        <Link
          href="/admin/products"
          className="btn rounded-lg bg-ink px-4 py-2.5 text-[13px] text-paper hover:bg-ink-soft"
        >
          <Plus size={15} /> Add product
        </Link>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <p className="text-[12px] uppercase tracking-wider2 text-ink-muted">{k.label}</p>
            <p className="mt-2 font-serif text-3xl tabular-nums">{k.value}</p>
            <p
              className={`mt-2 flex items-center gap-1 text-[12px] font-medium ${
                k.up ? "text-success" : "text-danger"
              }`}
            >
              {k.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {k.delta}
              <span className="font-normal text-stone-400">· {k.sub}</span>
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHead
              title="Revenue — last 14 days"
              action={<span className="text-[13px] font-medium text-success">+16.8% ↑</span>}
            />
            <div className="p-5">
              <RevenueChart />
            </div>
          </Card>

          <Card>
            <CardHead
              title="Recent orders"
              action={
                <Link href="/admin/orders" className="flex items-center gap-1 text-[12px] font-medium text-brass-600">
                  View all <ArrowRight size={13} />
                </Link>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400">
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {recentOrders.slice(0, 6).map((o) => (
                    <tr key={o.id} className="hover:bg-stone-50/60">
                      <td className="px-5 py-3.5 font-medium text-ink">{o.id}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-ink">{o.customer}</p>
                        <p className="text-[12px] text-stone-400">{o.product}</p>
                      </td>
                      <td className="px-5 py-3.5 tabular-nums">{o.total}</td>
                      <td className="px-5 py-3.5">
                        <Pill status={o.status} />
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-stone-500">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card>
            <CardHead title="Today's report" />
            <ul className="divide-y divide-stone-50">
              {todayReport.map((r) => (
                <li key={r.label} className="flex items-center justify-between px-5 py-3">
                  <span className="text-[13px] text-ink-muted">{r.label}</span>
                  <span className="font-medium tabular-nums">{r.value}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="Traffic by channel" />
            <div className="p-5">
              <Donut />
            </div>
          </Card>

          <Card>
            <CardHead
              title="Low stock"
              action={<AlertTriangle size={15} className="text-brass-600" />}
            />
            <ul className="divide-y divide-stone-50">
              {lowStock.map((p) => (
                <li key={p.sku} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-[13.5px] font-medium">{p.name}</p>
                    <p className="text-[11px] text-stone-400">{p.sku}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-semibold text-danger">{p.stock} left</span>
                    <button className="rounded-md border border-stone-300 px-2.5 py-1 text-[11px] hover:bg-stone-50">
                      Restock
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="Top products" />
            <ul className="divide-y divide-stone-50">
              {topProducts.map((p) => (
                <li key={p.name} className="flex items-center gap-3 px-5 py-3">
                  <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded bg-cream">
                    <Image src={p.image} alt="" fill sizes="36px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium">{p.name}</p>
                    <p className="text-[11px] text-stone-400">{p.sold} sold</p>
                  </div>
                  <span className="text-[13px] font-medium tabular-nums">{p.revenue}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
