import "server-only";
import { prisma } from "./prisma";
import type { Order, OrderItem } from "@prisma/client";

export type OrderWithItems = Order & { items: OrderItem[] };

/** All orders, newest first, with their line items. */
export async function getAllOrders(): Promise<OrderWithItems[]> {
  try {
    return await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}
