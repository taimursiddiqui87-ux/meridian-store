import { Resend } from "resend";
import type { Order, OrderItem } from "@prisma/client";
import { formatPrice } from "./utils";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "MERIDIAN <onboarding@resend.dev>";

export async function sendOrderConfirmation(order: Order & { items: OrderItem[] }) {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — skipping confirmation email for", order.orderNumber);
    return;
  }
  if (!order.email) return;

  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Your MERIDIAN order ${order.orderNumber} is confirmed`,
      html: renderOrderEmail(order),
    });
  } catch (e) {
    console.error("[email] failed to send confirmation", e);
  }
}

function renderOrderEmail(order: Order & { items: OrderItem[] }) {
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

  return `
  <div style="background:#F6F1E9;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#FBF9F5;border:1px solid #EEEAE2;">
      <div style="background:#17130F;padding:28px;text-align:center;">
        <div style="font-family:Georgia,serif;font-size:26px;letter-spacing:4px;color:#FBF9F5;">MERIDIAN</div>
      </div>
      <div style="padding:32px 28px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#B0863F;">Order confirmed</div>
        <h1 style="font-family:Georgia,serif;font-size:28px;color:#17130F;margin:8px 0 4px;">Thank you for your order</h1>
        <p style="font-size:14px;color:#4A4237;margin:0 0 24px;">
          Order <strong>#${order.orderNumber}</strong> — we're preparing it now and will email tracking within 24 hours.
        </p>
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
        ${
          order.shippingAddress
            ? `<div style="margin-top:24px;font-size:13px;color:#4A4237;"><div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8C8069;margin-bottom:4px;">Shipping to</div>${order.shippingAddress}</div>`
            : ""
        }
      </div>
      <div style="background:#17130F;padding:20px 28px;text-align:center;">
        <p style="font-size:12px;color:#8C8069;margin:0;">Every Meridian ships insured with a 2-year warranty.</p>
        <p style="font-size:12px;color:#8C8069;margin:6px 0 0;">Questions? Reply to this email.</p>
      </div>
    </div>
  </div>`;
}
