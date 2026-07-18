"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { heroBanners, promoBanners } from "@/lib/data";

export interface BannerInput {
  id?: string;
  kind: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  align: string;
  theme: string;
  badge: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  active: boolean;
}

async function guard() {
  if (!(await isAdmin())) throw new Error("Not authorized");
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/content");
}

const clean = (input: BannerInput) => ({
  kind: input.kind === "promo" ? "promo" : "hero",
  eyebrow: input.eyebrow?.trim() || null,
  title: input.title?.trim() || "Untitled banner",
  subtitle: input.subtitle?.trim() || null,
  image:
    input.image?.trim() ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=2000&q=80",
  align: input.align === "center" ? "center" : "left",
  theme: input.theme === "light" ? "light" : "dark",
  badge: input.badge?.trim() || null,
  primaryLabel: input.primaryLabel?.trim() || null,
  primaryHref: input.primaryHref?.trim() || null,
  secondaryLabel: input.secondaryLabel?.trim() || null,
  secondaryHref: input.secondaryHref?.trim() || null,
  active: !!input.active,
});

export async function saveBanner(input: BannerInput) {
  await guard();
  const data = clean(input);
  if (input.id) {
    await prisma.banner.update({ where: { id: input.id }, data });
  } else {
    const max = await prisma.banner.aggregate({
      where: { kind: data.kind },
      _max: { sortOrder: true },
    });
    await prisma.banner.create({ data: { ...data, sortOrder: (max._max.sortOrder ?? 0) + 1 } });
  }
  revalidate();
}

export async function deleteBanner(id: string) {
  await guard();
  await prisma.banner.delete({ where: { id } });
  revalidate();
}

export async function toggleBanner(id: string) {
  await guard();
  const b = await prisma.banner.findUnique({ where: { id } });
  if (b) await prisma.banner.update({ where: { id }, data: { active: !b.active } });
  revalidate();
}

export async function moveBanner(id: string, dir: "up" | "down") {
  await guard();
  const current = await prisma.banner.findUnique({ where: { id } });
  if (!current) return;
  const neighbor = await prisma.banner.findFirst({
    where: {
      kind: current.kind,
      sortOrder: dir === "up" ? { lt: current.sortOrder } : { gt: current.sortOrder },
    },
    orderBy: { sortOrder: dir === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;
  await prisma.$transaction([
    prisma.banner.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    prisma.banner.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  revalidate();
}

/** One-click import of the built-in defaults so there's something to edit. */
export async function seedDefaultBanners() {
  await guard();
  let order = 0;
  for (const b of heroBanners) {
    order += 1;
    const data = {
      kind: "hero",
      eyebrow: b.eyebrow,
      title: b.title,
      subtitle: b.subtitle,
      image: b.image,
      align: b.align,
      theme: b.theme,
      badge: b.badge ?? null,
      primaryLabel: b.primaryCta.label,
      primaryHref: b.primaryCta.href,
      secondaryLabel: b.secondaryCta?.label ?? null,
      secondaryHref: b.secondaryCta?.href ?? null,
      active: true,
      sortOrder: order,
    };
    await prisma.banner.upsert({ where: { id: b.id }, create: { id: b.id, ...data }, update: data });
  }
  let promoOrder = 0;
  for (const p of promoBanners) {
    promoOrder += 1;
    const data = {
      kind: "promo",
      eyebrow: p.eyebrow,
      title: p.title,
      subtitle: p.body,
      image: p.image,
      align: "left",
      theme: "dark",
      badge: null,
      primaryLabel: p.cta.label,
      primaryHref: p.cta.href,
      secondaryLabel: null,
      secondaryHref: null,
      active: true,
      sortOrder: promoOrder,
    };
    await prisma.banner.upsert({ where: { id: p.id }, create: { id: p.id, ...data }, update: data });
  }
  revalidate();
}
