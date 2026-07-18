"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { getSiteConfigFresh, type SiteConfig } from "@/lib/settings";

async function guard() {
  if (!(await isAdmin())) throw new Error("Not authorized");
}

async function persist(patch: Partial<SiteConfig>) {
  const current = await getSiteConfigFresh();
  const merged = { ...current, ...patch };
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    create: { id: "main", config: merged as object },
    update: { config: merged as object },
  });
  revalidateTag("site-config");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/admin/settings");
}

export async function saveStoreProfile(store: SiteConfig["store"]) {
  await guard();
  await persist({ store });
}

export async function saveAnnouncements(announcements: string[]) {
  await guard();
  await persist({ announcements: announcements.map((a) => a.trim()).filter(Boolean) });
}

export async function saveHomepage(home: SiteConfig["home"]) {
  await guard();
  await persist({ home });
}

export async function saveAbout(about: SiteConfig["about"]) {
  await guard();
  await persist({ about });
}

export async function saveCheckout(checkout: SiteConfig["checkout"]) {
  await guard();
  await persist({
    checkout: {
      freeShippingThreshold: Math.max(0, Math.round(Number(checkout.freeShippingThreshold) || 0)),
      shippingFlat: Math.max(0, Math.round(Number(checkout.shippingFlat) || 0)),
      taxRatePct: Math.max(0, Math.min(100, Number(checkout.taxRatePct) || 0)),
    },
  });
}
