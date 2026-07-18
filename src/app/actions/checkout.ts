"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendOrderEmails } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const METHODS = ["cod", "card", "jazzcash", "easypaisa"] as const;
export type PaymentMethod = (typeof METHODS)[number];

export interface CheckoutLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  variant: string;
  quantity: number;
}

export interface CheckoutInput {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  method: string;
  lines: CheckoutLine[];
}

export interface CheckoutResult {
  ok: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  if (!Array.isArray(input.lines) || input.lines.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }
  if (!EMAIL_RE.test(input.email || "")) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!input.firstName?.trim() || !input.address?.trim() || !input.city?.trim() || !input.phone?.trim()) {
    return { ok: false, error: "Please complete your name, phone, address and city." };
  }

  const method: PaymentMethod = (METHODS as readonly string[]).includes(input.method)
    ? (input.method as PaymentMethod)
    : "cod";

  // Inventory check — only enforced for catalog products that exist in the DB
  // (items served from the static seed fallback are treated as always available).
  let dbStock = new Map<string, { name: string; stock: number }>();
  try {
    const ids = input.lines.map((l) => l.productId);
    const rows = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, stock: true },
    });
    dbStock = new Map(rows.map((r) => [r.id, { name: r.name, stock: r.stock }]));
    for (const line of input.lines) {
      const p = dbStock.get(line.productId);
      if (p && p.stock < line.quantity) {
        return {
          ok: false,
          error:
            p.stock <= 0
              ? `"${p.name}" is out of stock.`
              : `Only ${p.stock} of "${p.name}" left in stock.`,
        };
      }
    }
  } catch {
    dbStock = new Map(); // DB unreachable → skip enforcement rather than block checkout
  }

  const session = await getSession();
  // Only attach the order to a user that still exists (a stale session for a
  // deleted account falls back to a guest order rather than failing).
  let userId: string | null = null;
  if (session?.id) {
    try {
      const existing = await prisma.user.findUnique({
        where: { id: session.id },
        select: { id: true },
      });
      userId = existing?.id ?? null;
    } catch {
      userId = null;
    }
  }

  const subtotal = input.lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;
  const orderNumber = "MER-" + Date.now().toString().slice(-6);

  // COD is settled on delivery (unpaid); the gateway methods run in demo mode
  // (marked paid, no real charge) until live merchant credentials are wired in.
  const status = method === "cod" ? "pending" : "paid";
  const shippingAddress = [input.address, input.city, input.postalCode, input.country]
    .map((s) => s?.trim())
    .filter(Boolean)
    .join(", ");

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        email: input.email.trim().toLowerCase(),
        userId,
        status,
        paymentMethod: method,
        currency: "usd",
        subtotal,
        shipping,
        tax,
        total,
        customerName: `${input.firstName} ${input.lastName}`.trim(),
        shippingAddress,
        items: {
          create: input.lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            variant: l.variant,
            price: l.price,
            quantity: l.quantity,
            image: l.image,
          })),
        },
      },
      include: { items: true },
    });

    // Decrement inventory for DB-backed products; flag any that reach zero.
    const decrements = input.lines.filter((l) => dbStock.has(l.productId));
    if (decrements.length) {
      await prisma.$transaction(
        decrements.map((l) =>
          prisma.product.update({
            where: { id: l.productId },
            data: { stock: { decrement: l.quantity } },
          }),
        ),
      );
      await prisma.product.updateMany({
        where: { id: { in: decrements.map((l) => l.productId) }, stock: { lte: 0 } },
        data: { inStock: false },
      });
      revalidateTag("products");
    }

    await sendOrderEmails(order); // customer confirmation + admin notification (no-op until RESEND_API_KEY is set)

    return { ok: true, orderId: order.id, orderNumber };
  } catch (e) {
    console.error("[placeOrder]", e);
    return { ok: false, error: "We couldn't place your order. Please try again in a moment." };
  }
}
