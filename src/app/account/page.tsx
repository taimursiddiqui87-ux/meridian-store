import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ChevronRight, Package } from "lucide-react";
import type { Order, OrderItem } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { OrderStatusPill } from "@/components/account/OrderStatusPill";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/account/login");

  let orders: (Order & { items: OrderItem[] })[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId: session.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    });
  } catch {
    orders = [];
  }

  const paid = orders.filter((o) => o.status === "paid" || o.status === "fulfilled");
  const totalSpent = paid.reduce((n, o) => n + o.total, 0);
  const firstName = session.name?.split(" ")[0] ?? "there";

  const stats = [
    { label: "Orders", value: String(orders.length) },
    { label: "Total spent", value: formatPrice(totalSpent) },
    { label: "Member", value: "Since 2026" },
  ];

  return (
    <div className="container-luxe py-10 lg:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account" }]} />
      <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Hello, {firstName}</h1>
      <p className="mt-2 text-ink-muted">{session.email}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <AccountSidebar active="Overview" />
        </aside>

        <div>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="border border-stone-200 bg-cream/40 p-5">
                <p className="font-serif text-2xl sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-[12px] uppercase tracking-wider2 text-ink-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Recent orders</h2>
            <Link href="/account/orders" className="flex items-center gap-1 text-[12px] uppercase tracking-wider2 text-brass-600">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="mt-5 grid place-items-center border border-dashed border-stone-300 py-16 text-center">
              <div>
                <Package size={28} className="mx-auto mb-3 text-stone-300" />
                <p className="font-serif text-xl">No orders yet</p>
                <p className="mt-1 text-sm text-ink-muted">Your purchases will appear here.</p>
                <Link href="/shop" className="btn-primary mt-5">Start shopping</Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="border border-stone-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-cream/40 px-5 py-3 text-sm">
                    <span className="font-medium">#{o.orderNumber}</span>
                    <span className="text-stone-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                    <span className="tabular-nums">{formatPrice(o.total)}</span>
                    <OrderStatusPill status={o.status} />
                  </div>
                  <div className="flex items-center gap-4 px-5 py-4">
                    {o.items[0] && (
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-cream">
                        <Image src={o.items[0].image} alt="" fill sizes="56px" className="object-cover" />
                      </div>
                    )}
                    <p className="text-sm text-ink-soft">
                      {o.items.map((i) => i.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
