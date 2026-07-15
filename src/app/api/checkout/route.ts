import { type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Line {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  variant: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return Response.json(
      { error: "Payments aren't configured yet. Add your Stripe keys (see SETUP.md)." },
      { status: 503 },
    );
  }

  try {
    const { lines } = (await req.json()) as { lines: Line[] };
    if (!Array.isArray(lines) || lines.length === 0) {
      return Response.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const session = await getSession();
    const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;
    const orderNumber = "MER-" + Date.now().toString().slice(-6);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        email: session?.email ?? "",
        userId: session?.id ?? null,
        status: "pending",
        currency: "usd",
        subtotal,
        shipping,
        tax,
        total,
        items: {
          create: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            variant: l.variant,
            price: l.price,
            quantity: l.quantity,
            image: l.image,
          })),
        },
      },
    });

    const origin =
      req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: "usd",
          unit_amount: l.price,
          product_data: {
            name: l.name,
            description: l.variant,
            images: l.image ? [l.image] : [],
          },
        },
      })),
      customer_email: session?.email || undefined,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "IT", "ES", "NL", "AE", "PK", "IN"],
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: { orderId: order.id, orderNumber },
      payment_intent_data: { metadata: { orderId: order.id } },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkout.id },
    });

    return Response.json({ url: checkout.url });
  } catch (e) {
    console.error("[checkout]", e);
    return Response.json(
      { error: "We couldn't start checkout. Please try again in a moment." },
      { status: 500 },
    );
  }
}
