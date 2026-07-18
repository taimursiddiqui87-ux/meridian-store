import { prisma } from "@/lib/prisma";
import { CouponsAdmin, type CouponRow } from "@/components/admin/CouponsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  let coupons: Awaited<ReturnType<typeof prisma.coupon.findMany>> = [];
  try {
    coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    coupons = [];
  }

  const rows: CouponRow[] = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type,
    value: c.value,
    active: c.active,
    minSubtotal: c.minSubtotal,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString().slice(0, 10) : "",
  }));

  return <CouponsAdmin initial={rows} />;
}
