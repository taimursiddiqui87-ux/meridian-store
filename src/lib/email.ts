import { Resend } from "resend";
import type { Order, OrderItem } from "@prisma/client";
import { formatPrice } from "./utils";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "MERIDIAN <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://meridian-store-beige.vercel.app";

type FullOrder = Order & { items: OrderItem[] };

const methodLabel: Record<string, string> = {
  cod: "Cash on Delivery",
  card: "Credit / Debit Card",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

/** Sends the customer confirmation AND the admin new-order notification. */
export async function sendOrderEmails(order: FullOrder) {
  await Promise.allSettled([sendCustomerConfirmation(order), sendAdminNotification(order)]);
}

async function sendCustomerConfirmation(order: FullOrder) {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — skipping customer email for", order.orderNumber);
    return;
  }
  if (!order.email) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Your MERIDIAN order ${order.orderNumber} is confirmed`,
      html: renderOrderEmail(order, "customer"),
    });
  } catch (e) {
    console.error("[email] customer confirmation failed", e);
  }
}

async function sendAdminNotification(order: FullOrder) {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — skipping admin email for", order.orderNumber);
    return;
  }
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmail) {
    console.log("[email] ADMIN_EMAIL not set — skipping admin notification for", order.orderNumber);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to: adminEmail,
      subject: `New order ${order.orderNumber} · ${formatPrice(order.total)} · ${methodLabel[order.paymentMethod] ?? order.paymentMethod}`,
      html: renderOrderEmail(order, "admin"),
    });
  } catch (e) {
    console.error("[email] admin notification failed", e);
  }
}

function renderOrderEmail(order: FullOrder, variant: "customer" | "admin") {
  const isAdmin = variant === "admin";
  const method = methodLabel[order.paymentMethod] ?? order.paymentMethod;

  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #EEEAE2;">
          <div style="font-family:Georgia,serif;font-size:16px;color:#17130F;">${i.name}</div>
          <div style="font-size:12px;color:#8C8069;">${i.variant} · Qty ${i.quantity}</div>
        </td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid #EEEAE2;font-size:14px;color:#17130F;">
          ${formatPrice(i.price * i.quantity)}
        </td>
      </tr>`,
    )
    .join("");

  const eyebrow = isAdmin ? "New order received" : "Order confirmed";
  const heading = isAdmin ? "You have a new order" : "Thank you for your order";
  const intro = isAdmin
    ? `Order <strong>#${order.orderNumber}</strong> was just placed by ${order.customerName || order.email}. Payment method: <strong>${method}</strong>.`
    : `Order <strong>#${order.orderNumber}</strong> — we're preparing it now and will email tracking within 24 hours. Payment: <strong>${method}</strong>.`;

  const detailsBlock = isAdmin
    ? `<div style="margin-top:24px;padding:16px;background:#F6F1E9;font-size:13px;color:#4A4237;">
         <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8C8069;margin-bottom:6px;">Customer</div>
         ${order.customerName ? `${order.customerName}<br/>` : ""}
         ${order.email}<br/>
         ${order.shippingAddress ? `<div style="margin-top:8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8C8069;">Ship to</div>${order.shippingAddress}` : ""}
       </div>`
    : order.shippingAddress
      ? `<div style="margin-top:24px;font-size:13px;color:#4A4237;"><div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8C8069;margin-bottom:4px;">Shipping to</div>${order.shippingAddress}</div>`
      : "";

  const footer = isAdmin
    ? `<a href="${APP_URL}/admin/orders" style="color:#B0863F;text-decoration:none;font-size:13px;">View this order in your dashboard →</a>`
    : `Questions? Just reply to this email.`;

  return `
  <div style="background:#F6F1E9;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#FBF9F5;border:1px solid #EEEAE2;">
      <div style="background:#17130F;padding:28px;text-align:center;">
        <div style="font-family:Georgia,serif;font-size:26px;letter-spacing:4px;color:#FBF9F5;">MERIDIAN</div>
      </div>
      <div style="padding:32px 28px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#B0863F;">${eyebrow}</div>
        <h1 style="font-family:Georgia,serif;font-size:28px;color:#17130F;margin:8px 0 4px;">${heading}</h1>
        <p style="font-size:14px;color:#4A4237;margin:0 0 24px;">${intro}</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${rows}
          <tr>
            <td style="padding:16px 0 4px;font-size:13px;color:#8C8069;">Subtotal</td>
            <td align="right" style="padding:16px 0 4px;font-size:13px;color:#17130F;">${formatPrice(order.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-size:13px;color:#8C8069;">Shipping</td>
            <td align="right" style="padding:4px 0;font-size:13px;color:#3F7D5A;">${order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</td>
          </tr>
          <tr>
            <td style="padding:12px 0 0;font-family:Georgia,serif;font-size:18px;color:#17130F;border-top:1px solid #DDD6C9;">Total</td>
            <td align="right" style="padding:12px 0 0;font-family:Georgia,serif;font-size:18px;color:#17130F;border-top:1px solid #DDD6C9;">${formatPrice(order.total)}</td>
          </tr>
        </table>
        ${detailsBlock}
      </div>
      <div style="background:#17130F;padding:20px 28px;text-align:center;">
        <p style="font-size:12px;color:#8C8069;margin:0;">${footer}</p>
      </div>
    </div>
  </div>`;
}
