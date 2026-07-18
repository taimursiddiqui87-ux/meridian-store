"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

const STATUSES = ["pending", "paid", "fulfilled", "cancelled"] as const;
export type OrderStatus = (typeof STATUSES)[number];

export interface UpdateOrderResult {
  ok: boolean;
  error?: string;
}

export async function updateOrder(
  orderId: string,
  patch: { status?: string; trackingNumber?: string | null },
): Promise<UpdateOrderResult> {
  try {
    if (!(await isAdmin())) return { ok: false, error: "Not authorized." };

    const data: { status?: string; trackingNumber?: string | null } = {};
    if (patch.status != null) {
      if (!(STATUSES as readonly string[]).includes(patch.status)) {
        return { ok: false, error: "Invalid status." };
      }
      data.status = patch.status;
    }
    if (patch.trackingNumber !== undefined) {
      const t = patch.trackingNumber?.trim();
      data.trackingNumber = t ? t : null;
    }
    if (Object.keys(data).length === 0) return { ok: true };

    await prisma.order.update({ where: { id: orderId }, data });
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    console.error("[updateOrder]", e);
    return { ok: false, error: "Could not update the order." };
  }
}
