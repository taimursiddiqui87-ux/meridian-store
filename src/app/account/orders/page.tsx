import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import type { Order, OrderItem } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { OrderStatusPill } from "@/components/account/OrderStatusPill";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/account/login");

  let orders: (Order & { items: OrderItem[] })[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId: session.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    orders = [];
  }

  return (
    <div className="container-luxe py-10 lg:py-14">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Account", href: "/account" }, { label: "Orders" }]}
      />
      <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Your Orders</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <AccountSidebar active="Orders" />
        </aside>

        <div className="space-y-5">
          {orders.length === 0 ? (
            <div className="grid place-items-center border border-dashed border-stone-300 py-20 text-center">
              <div>
                <Package size={30} className="mx-auto mb-3 text-stone-300" />
                <p className="font-serif text-2xl">No orders yet</p>
                <p className="mt-1 text-sm text-ink-muted">When you place an order, it will appear here.</p>
                <Link href="/shop" className="btn-primary mt-6">Browse the collection</Link>
              </div>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="border border-stone-200">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-cream/40 px-6 py-4">
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-1 text-sm">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider2 text-stone-400">Order</p>
                      <p className="font-medium">#{o.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider2 text-stone-400">Placed</p>
                      <p>{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider2 text-stone-400">Total</p>
                      <p className="tabular-nums">{formatPrice(o.total)}</p>
                    </div>
                  </div>
                  <OrderStatusPill status={o.status} />
                </div>
                <ul className="divide-y divide-stone-50">
                  {o.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-cream">
                        <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-lg">{item.name}</p>
                        <p className="text-[13px] text-stone-400">
                          {item.variant} · Qty {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
