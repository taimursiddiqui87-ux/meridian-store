import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Mail, Banknote } from "lucide-react";
import type { Order, OrderItem } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ClearCart } from "@/components/cart/ClearCart";

export const dynamic = "force-dynamic";

const methodLabel: Record<string, string> = {
  cod: "Cash on Delivery",
  card: "Credit / Debit Card",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  let order: (Order & { items: OrderItem[] }) | null = null;
  if (searchParams.order) {
    try {
      order = await prisma.order.findUnique({
        where: { id: searchParams.order },
        include: { items: true },
      });
    } catch {
      order = null;
    }
  }

  const isCod = order?.paymentMethod === "cod";

  return (
    <div className="container-luxe py-16 lg:py-24">
      <ClearCart />
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={40} strokeWidth={1.4} />
        </div>
        <h1 className="mt-6 font-serif text-4xl sm:text-5xl">Thank you for your order</h1>
        {order ? (
          <p className="mt-3 text-ink-muted">
            Order <span className="font-medium text-ink">#{order.orderNumber}</span> is confirmed
            {order.paymentMethod ? <> · {methodLabel[order.paymentMethod] ?? order.paymentMethod}</> : null}.
          </p>
        ) : (
          <p className="mt-3 text-ink-muted">Your order is confirmed and being prepared.</p>
        )}

        {isCod && order && (
          <div className="mt-6 flex items-center justify-center gap-2 border border-brass-200 bg-brass-50 px-5 py-4 text-sm text-ink-soft">
            <Banknote size={18} className="text-brass-600" />
            Please keep <strong className="text-ink">{formatPrice(order.total)}</strong> ready — you’ll
            pay in cash when your order arrives.
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 border-y border-stone-200 py-4 text-sm text-ink-soft">
          <Mail size={17} className="text-brass-600" />
          A confirmation email is on its way to{" "}
          <strong className="text-ink">{order?.email ?? "your inbox"}</strong>
        </div>

        {order && (
          <div className="mx-auto mt-8 max-w-md border border-stone-200 text-left">
            <ul className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 p-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-cream">
                    <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-lg">{item.name}</p>
                    <p className="text-[12px] text-stone-400">{item.variant} · Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-stone-200 px-4 py-4">
              <span className="text-[13px] uppercase tracking-wider2 text-ink-muted">Total</span>
              <span className="font-serif text-2xl tabular-nums">{formatPrice(order.total)}</span>
            </div>
          </div>
        )}

        <p className="mt-6 text-sm text-ink-muted">
          You’ll receive tracking details within 24 hours. Every Meridian ships insured.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/shop" className="btn-primary">Continue shopping</Link>
          <Link href="/account/orders" className="btn-outline">View your orders</Link>
        </div>
      </div>
    </div>
  );
}
