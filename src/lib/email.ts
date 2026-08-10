import { Resend } from "resend";
import { getSiteConfigFresh } from "./settings";
import type { Order, OrderItem } from "@prisma/client";
import { formatMoney } from "./money";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://meridian-store-beige.vercel.app";

/** Store name for email copy — follows whatever the client sets in Settings. */
async function storeName(): Promise<string> {
  try {
    const { store } = await getSiteConfigFresh();
    return store.name || "ZAMIRA";
  } catch {
    return "ZAMIRA";
  }
}

/**
 * Keeps the sending address from EMAIL_FROM but always uses the current store
 * name as the display name, so renaming the store never leaves a stale brand.
 */
function fromAddress(name: string): string {
  const raw = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const match = raw.match(/<([^>]+)>/);
  const address = (match ? match[1] : raw).trim();
  return `${name} <${address}>`;
}

type FullOrder = Order & { items: OrderItem[] };

const methodLabel: Record<string, string> = {
  cod: "Cash on Delivery",
  card: "Credit / Debit Card",
  stripe: "Stripe",
  payoneer: "Payoneer",
  fastpay: "FastPay",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

/** Sends the customer confirmation AND the admin new-order notification. */
export async function sendOrderEmails(order: FullOrder) {
  const name = await storeName();
  await Promise.allSettled([sendCustomerConfirmation(order, name), sendAdminNotification(order, name)]);
}

/** Emails a customer's contact-form message to the store admin. Returns true if dispatched. */
export async function sendContactEmail(msg: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!resend || !adminEmail) {
    console.log("[email] contact message (not dispatched — email not configured):", msg);
    return false;
  }
  try {
    await resend.emails.send({
      from: fromAddress(await storeName()),
      to: adminEmail,
      replyTo: msg.email,
      subject: `Contact form: ${msg.subject || "New message"}`,
      html: `
      <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;">
        <h2 style="font-family:Georgia,serif;">New contact message</h2>
        <p><strong>From:</strong> ${msg.name} &lt;${msg.email}&gt;</p>
        <p><strong>Subject:</strong> ${msg.subject || "—"}</p>
        <hr style="border:none;border-top:1px solid #EEEAE2;"/>
        <p style="white-space:pre-wrap;color:#4A4237;">${msg.message.replace(/</g, "&lt;")}</p>
      </div>`,
    });
    return true;
  } catch (e) {
    console.error("[email] contact message failed", e);
    return false;
  }
}

/** Sends a password-reset link. Returns true if an email was actually dispatched. */
export async function sendPasswordResetEmail(to: string, link: string): Promise<boolean> {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — password reset link for", to, "→", link);
    return false;
  }
  const name = await storeName();
  try {
    await resend.emails.send({
      from: fromAddress(name),
      to,
      subject: `Reset your ${name} password`,
      html: `
      <div style="background:#F6F1E9;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
        <div style="max-width:520px;margin:0 auto;background:#FBF9F5;border:1px solid #EEEAE2;">
          <div style="background:#17130F;padding:28px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:26px;letter-spacing:4px;color:#FBF9F5;">${name}</div>
          </div>
          <div style="padding:32px 28px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#B0863F;">Password reset</div>
            <h1 style="font-family:Georgia,serif;font-size:26px;color:#17130F;margin:8px 0 12px;">Reset your password</h1>
            <p style="font-size:14px;color:#4A4237;margin:0 0 24px;">
              We received a request to reset your password. This link expires in 1 hour.
              If you didn't ask for this, you can safely ignore this email.
            </p>
            <a href="${link}" style="display:inline-block;background:#17130F;color:#FBF9F5;text-decoration:none;padding:14px 28px;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Reset password</a>
            <p style="font-size:12px;color:#8C8069;margin:24px 0 0;">Or paste this link into your browser:<br/>${link}</p>
          </div>
        </div>
      </div>`,
    });
    return true;
  } catch (e) {
    console.error("[email] password reset failed", e);
    return false;
  }
}

async function sendCustomerConfirmation(order: FullOrder, name: string) {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — skipping customer email for", order.orderNumber);
    return;
  }
  if (!order.email) return;
  try {
    await resend.emails.send({
      from: fromAddress(name),
      to: order.email,
      subject: `Your ${name} order ${order.orderNumber} is confirmed`,
      html: renderOrderEmail(order, "customer", name),
    });
  } catch (e) {
    console.error("[email] customer confirmation failed", e);
  }
}

async function sendAdminNotification(order: FullOrder, name: string) {
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
      from: fromAddress(name),
      to: adminEmail,
      subject: `New order ${order.orderNumber} · ${formatMoney(order.total, order.displayCurrency || "USD", order.displayRate || 1)} · ${methodLabel[order.paymentMethod] ?? order.paymentMethod}`,
      html: renderOrderEmail(order, "admin", name),
    });
  } catch (e) {
    console.error("[email] admin notification failed", e);
  }
}

function renderOrderEmail(order: FullOrder, variant: "customer" | "admin", brand: string) {
  const isAdmin = variant === "admin";
  // Show the amounts in whatever currency the shopper was browsing in.
  const cur = order.displayCurrency || "USD";
  const rate = order.displayRate || 1;
  const fmt = (cents: number) => formatMoney(cents, cur, rate);
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
          ${fmt(i.price * i.quantity)}
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
        <div style="font-family:Georgia,serif;font-size:26px;letter-spacing:4px;color:#FBF9F5;">${brand}</div>
      </div>
      <div style="padding:32px 28px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#B0863F;">${eyebrow}</div>
        <h1 style="font-family:Georgia,serif;font-size:28px;color:#17130F;margin:8px 0 4px;">${heading}</h1>
        <p style="font-size:14px;color:#4A4237;margin:0 0 24px;">${intro}</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${rows}
          <tr>
            <td style="padding:16px 0 4px;font-size:13px;color:#8C8069;">Subtotal</td>
            <td align="right" style="padding:16px 0 4px;font-size:13px;color:#17130F;">${fmt(order.subtotal)}</td>
          </tr>
          ${
            order.discount > 0
              ? `<tr><td style="padding:4px 0;font-size:13px;color:#3F7D5A;">Discount${order.couponCode ? ` (${order.couponCode})` : ""}</td><td align="right" style="padding:4px 0;font-size:13px;color:#3F7D5A;">−${fmt(order.discount)}</td></tr>`
              : ""
          }
          <tr>
            <td style="padding:4px 0;font-size:13px;color:#8C8069;">Shipping</td>
            <td align="right" style="padding:4px 0;font-size:13px;color:#3F7D5A;">${order.shipping === 0 ? "Free" : fmt(order.shipping)}</td>
          </tr>
          ${
            order.tax > 0
              ? `<tr><td style="padding:4px 0;font-size:13px;color:#8C8069;">Tax</td><td align="right" style="padding:4px 0;font-size:13px;color:#17130F;">${fmt(order.tax)}</td></tr>`
              : ""
          }
          <tr>
            <td style="padding:12px 0 0;font-family:Georgia,serif;font-size:18px;color:#17130F;border-top:1px solid #DDD6C9;">Total</td>
            <td align="right" style="padding:12px 0 0;font-family:Georgia,serif;font-size:18px;color:#17130F;border-top:1px solid #DDD6C9;">${fmt(order.total)}</td>
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
