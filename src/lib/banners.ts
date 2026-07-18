import { prisma } from "./prisma";
import { heroBanners as staticHeroBanners } from "./data";
import type { HeroBanner } from "./types";
import type { Banner } from "@prisma/client";

export function toHeroBanner(b: Banner): HeroBanner {
  return {
    id: b.id,
    eyebrow: b.eyebrow ?? "",
    title: b.title,
    subtitle: b.subtitle ?? "",
    image: b.image,
    align: b.align === "center" ? "center" : "left",
    theme: b.theme === "light" ? "light" : "dark",
    badge: b.badge ?? undefined,
    primaryCta: { label: b.primaryLabel ?? "Shop now", href: b.primaryHref ?? "/shop" },
    secondaryCta:
      b.secondaryLabel && b.secondaryHref
        ? { label: b.secondaryLabel, href: b.secondaryHref }
        : undefined,
  };
}

/** Active hero banners from the DB, ordered; falls back to built-in defaults. */
export async function getHeroBanners(): Promise<HeroBanner[]> {
  try {
    const rows = await prisma.banner.findMany({
      where: { kind: "hero", active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticHeroBanners;
    return rows.map(toHeroBanner);
  } catch {
    return staticHeroBanners;
  }
}

/** Every banner (both kinds, active or not) for the admin manager. */
export async function getAllBanners(): Promise<Banner[]> {
  try {
    return await prisma.banner.findMany({
      orderBy: [{ kind: "asc" }, { sortOrder: "asc" }],
    });
  } catch {
    return [];
  }
}
