"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export interface CouponResult {
  ok: boolean;
  error?: string;
  code?: string;
  discount?: number; // cents
  label?: string;
}

/** Public: validate a promo code against a subtotal and return the discount. */
export async function validateCoupon(codeRaw: string, subtotal: number): Promise<CouponResult> {
  const code = (codeRaw || "").trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a promo code." };
  try {
    const c = await prisma.coupon.findUnique({ where: { code } });
    if (!c || !c.active) return { ok: false, error: "That code isn't valid." };
    if (c.expiresAt && c.expiresAt < new Date()) return { ok: false, error: "That code has expired." };
    if (subtotal < c.minSubtotal) {
      return { ok: false, error: `Spend at least ${formatPrice(c.minSubtotal)} to use this code.` };
    }
    const discount =
      c.type === "fixed"
        ? Math.min(c.value, subtotal)
        : Math.round((subtotal * Math.min(100, Math.max(0, c.value))) / 100);
    const label = c.type === "fixed" ? `${formatPrice(c.value)} off` : `${c.value}% off`;
    return { ok: true, code, discount, label };
  } catch {
    return { ok: false, error: "Couldn't check that code right now. Please try again." };
  }
}

/* --------------------------- Admin management --------------------------- */

export interface CouponInput {
  id?: string;
  code: string;
  type: string; // percent | fixed
  value: number; // percent, or dollars for fixed (converted to cents)
  active: boolean;
  minSubtotalDollars?: number;
  expiresAt?: string | null; // yyyy-mm-dd
}

export interface CouponActionResult {
  ok: boolean;
  error?: string;
}

async function guard() {
  if (!(await isAdmin())) throw new Error("Not authorized");
}

export async function saveCoupon(input: CouponInput): Promise<CouponActionResult> {
  try {
    await guard();
    const code = input.code?.trim().toUpperCase();
    if (!code) return { ok: false, error: "Enter a code." };
    const type = input.type === "fixed" ? "fixed" : "percent";
    let value = Math.round(Number(input.value) || 0);
    if (type === "percent") value = Math.min(100, Math.max(1, value));
    else value = Math.max(1, value) * 100; // dollars → cents
    if (!value) return { ok: false, error: "Enter a discount value." };

    const minSubtotal = Math.max(0, Math.round((Number(input.minSubtotalDollars) || 0) * 100));
    const expiresAt = input.expiresAt ? new Date(`${input.expiresAt}T23:59:59`) : null;

    const data = { code, type, value, active: input.active, minSubtotal, expiresAt };

    if (input.id) {
      await prisma.coupon.update({ where: { id: input.id }, data });
    } else {
      const existing = await prisma.coupon.findUnique({ where: { code } });
      if (existing) return { ok: false, error: "A coupon with that code already exists." };
      await prisma.coupon.create({ data });
    }
    revalidatePath("/admin/discounts");
    return { ok: true };
  } catch (e) {
    console.error("[saveCoupon]", e);
    return { ok: false, error: "Could not save the coupon." };
  }
}

export async function deleteCoupon(id: string): Promise<CouponActionResult> {
  try {
    await guard();
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/discounts");
    return { ok: true };
  } catch (e) {
    console.error("[deleteCoupon]", e);
    return { ok: false, error: "Could not delete the coupon." };
  }
}
