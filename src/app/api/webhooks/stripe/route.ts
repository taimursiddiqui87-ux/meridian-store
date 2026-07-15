import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";

function formatAddress(details: Stripe.Checkout.Session.CustomerDetails | null): string | null {
  const a = details?.address;
  if (!a) return null;
  return [a.line1, a.line2, a.city, a.state, a.postal_code, a.country].filter(Boolean).join(", ");
}

export async function POST(req: Request) {
  if (!stripe) return new Response("Stripe not configured", { status: 503 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook secret not configured", { status: 500 });

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (e) {
    console.error("[webhook] signature verification failed", e);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const orderId = s.metadata?.orderId;

    if (orderId) {
      try {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "paid",
            email: s.customer_details?.email ?? undefined,
            customerName: s.customer_details?.name ?? undefined,
            shippingAddress: formatAddress(s.customer_details),
          },
          include: { items: true },
        });
        await sendOrderConfirmation(order);
      } catch (e) {
        console.error("[webhook] failed to finalize order", e);
      }
    }
  }

  return new Response("ok", { status: 200 });
}
