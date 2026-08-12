import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

export interface HomeSection {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  productSlugs: string[];
  visible: boolean;
}

export interface SiteConfig {
  store: {
    name: string;
    tagline: string;
    established: string;
    email: string;
    phone: string;
    /** Digits only, incl. country code (e.g. 923001234567). Empty hides the button. */
    whatsapp: string;
    whatsappMessage: string;
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  announcements: string[];
  home: {
    featured: HomeSection;
    bestsellers: HomeSection;
    newArrivals: HomeSection;
  };
  about: {
    heroEyebrow: string;
    heroTitle: string;
    intro: string;
    values: { title: string; body: string }[];
    stats: { value: string; label: string }[];
    storyEyebrow: string;
    storyTitle: string;
    storyBody: string;
  };
  checkout: {
    freeShippingThreshold: number; // integer cents; 0 disables the free-shipping tier
    shippingFlat: number; // integer cents charged when the order is below the threshold
    taxRatePct: number; // percentage applied to the discounted subtotal
  };
  sale: {
    enabled: boolean;
    headline: string; // e.g. "SALE"
    message: string; // shown on larger screens
    discountLabel: string; // the white pill, e.g. "UP TO 40% OFF"
    endsAt: string; // local datetime (YYYY-MM-DDTHH:mm); empty = no countdown
    href: string; // where the bar links to
  };
  currency: {
    defaultCode: string; // display currency before the shopper picks one
    enabled: string[]; // subset of USD | PKR | GBP | CAD
    rates: Record<string, number>; // units per 1 USD (USD is always 1)
  };
  payments: {
    /** Methods offered at checkout, in order. Turn extras on when they're ready. */
    methods: string[];
    /**
     * Pay-by-wallet details shown to shoppers who'd rather transfer manually
     * (Easypaisa / JazzCash) and send proof of payment.
     */
    manual: {
      enabled: boolean;
      heading: string;
      instructions: string;
      accounts: { provider: string; accountName: string; number: string }[];
    };
  };
}

export const DEFAULT_CONFIG: SiteConfig = {
  store: {
    name: "ZAMIRA",
    tagline: "Timepieces · Fragrances · Fine Jewelry",
    established: "Est. 2026",
    email: "care@zamira.pk",
    phone: "+92 300 000 0000",
    whatsapp: "",
    whatsappMessage: "Hi! I'd like to ask about a product on your store.",
    instagram: "#",
    facebook: "#",
    youtube: "#",
    twitter: "#",
  },
  announcements: [
    "Now live: Perfumes & Jewelry",
    "Free worldwide shipping",
    "2-year international warranty",
    "Complimentary engraving",
    "30-day returns",
  ],
  home: {
    featured: {
      title: "The Signature Edit",
      subtitle: "A cross-section of the pieces we’re proudest of.",
      ctaLabel: "Shop all",
      ctaHref: "/shop",
      productSlugs: ["zamira-aera-39", "ambre-royale", "solstice-band", "zamira-heritage-1968"],
      visible: true,
    },
    bestsellers: {
      title: "Bestsellers",
      subtitle: "The pieces our customers reach for most.",
      ctaLabel: "Shop watches",
      ctaHref: "/category/watches",
      productSlugs: ["zamira-aera-39", "zamira-noir-chronograph", "ambre-royale", "solstice-band"],
      visible: true,
    },
    newArrivals: {
      title: "New this season",
      subtitle: "Just landed across the collections.",
      ctaLabel: "View new",
      ctaHref: "/shop?sort=new",
      productSlugs: ["zamira-terra-gmt", "rose-infinie", "lune-pendant", "lumiere-hoops"],
      visible: true,
    },
  },
  about: {
    heroEyebrow: "Our Story",
    heroTitle: "Time, kept honestly",
    intro:
      "ZAMIRA began with a simple frustration: the watches we loved cost more than a car, and the ones we could afford felt like it. So we built the watch we wanted — Swiss-grade mechanics, obsessive finishing, and a price that respects you.",
    values: [
      { title: "Made to last", body: "Over-engineered movements, sapphire crystal and full-grain straps — built for decades, not seasons." },
      { title: "Honest pricing", body: "We sell direct, so you pay for the watch — not the marketing, the middlemen or the marble boutique." },
      { title: "Quietly confident", body: "No loud logos. Just considered design that earns a second glance from the people who know." },
    ],
    stats: [
      { value: "2019", label: "Founded" },
      { value: "50k+", label: "Wrists worldwide" },
      { value: "38", label: "Countries shipped" },
      { value: "4.9★", label: "Average rating" },
    ],
    storyEyebrow: "The Workshop",
    storyTitle: "Every watch passes through one pair of hands",
    storyBody:
      "From the first turn of the crown to the final pressure test, a single watchmaker sees each piece through. It’s slower. It’s more expensive. And it’s the only way we know how to build something worth keeping.",
  },
  checkout: {
    freeShippingThreshold: 15000, // free shipping at $150+
    shippingFlat: 1500, // $15 flat otherwise
    taxRatePct: 0, // no tax by default
  },
  sale: {
    enabled: true,
    headline: "Launch Sale",
    message: "Launch week is live — across all three collections",
    discountLabel: "UP TO 40% OFF",
    endsAt: "2026-07-31T23:59",
    href: "/shop",
  },
  currency: {
    defaultCode: "USD",
    enabled: ["USD", "PKR", "GBP", "CAD"],
    rates: { USD: 1, PKR: 278, GBP: 0.79, CAD: 1.37 },
  },
  payments: {
    methods: ["cod"],
    manual: {
      enabled: true,
      heading: "Prefer to pay by Easypaisa or JazzCash?",
      instructions:
        "Transfer the order total to one of the accounts below, then send us the payment screenshot on WhatsApp with your order number. We'll confirm and dispatch straight away.",
      accounts: [
        { provider: "Easypaisa", accountName: "", number: "" },
        { provider: "JazzCash", accountName: "", number: "" },
      ],
    },
  },
};

/** Deep-merge stored config over the defaults so new fields always resolve. */
export function mergeConfig(stored: Partial<SiteConfig> | null | undefined): SiteConfig {
  const s = stored ?? {};
  return {
    store: { ...DEFAULT_CONFIG.store, ...(s.store ?? {}) },
    announcements:
      Array.isArray(s.announcements) && s.announcements.length
        ? s.announcements
        : DEFAULT_CONFIG.announcements,
    home: {
      featured: { ...DEFAULT_CONFIG.home.featured, ...(s.home?.featured ?? {}) },
      bestsellers: { ...DEFAULT_CONFIG.home.bestsellers, ...(s.home?.bestsellers ?? {}) },
      newArrivals: { ...DEFAULT_CONFIG.home.newArrivals, ...(s.home?.newArrivals ?? {}) },
    },
    about: {
      ...DEFAULT_CONFIG.about,
      ...(s.about ?? {}),
      values: s.about?.values?.length ? s.about.values : DEFAULT_CONFIG.about.values,
      stats: s.about?.stats?.length ? s.about.stats : DEFAULT_CONFIG.about.stats,
    },
    checkout: { ...DEFAULT_CONFIG.checkout, ...(s.checkout ?? {}) },
    sale: { ...DEFAULT_CONFIG.sale, ...(s.sale ?? {}) },
    currency: {
      ...DEFAULT_CONFIG.currency,
      ...(s.currency ?? {}),
      enabled: s.currency?.enabled?.length ? s.currency.enabled : DEFAULT_CONFIG.currency.enabled,
      rates: { ...DEFAULT_CONFIG.currency.rates, ...(s.currency?.rates ?? {}) },
    },
    payments: {
      methods: s.payments?.methods?.length ? s.payments.methods : DEFAULT_CONFIG.payments.methods,
      manual: {
        ...DEFAULT_CONFIG.payments.manual,
        ...(s.payments?.manual ?? {}),
        accounts: s.payments?.manual?.accounts?.length
          ? s.payments.manual.accounts
          : DEFAULT_CONFIG.payments.manual.accounts,
      },
    },
  };
}

/**
 * Cached read for the storefront (revalidated via the "site-config" tag on save).
 * NOTE: bump the cache key version whenever the SiteConfig shape gains new keys —
 * Vercel's data cache persists across deploys, and a stale pre-migration object
 * would otherwise be served to dynamic routes.
 */
export const getSiteConfig = unstable_cache(
  async (): Promise<SiteConfig> => {
    try {
      const row = await prisma.siteSettings.findUnique({ where: { id: "main" } });
      return mergeConfig(row?.config as Partial<SiteConfig> | undefined);
    } catch {
      return DEFAULT_CONFIG;
    }
  },
  ["site-config-v8"],
  { tags: ["site-config"], revalidate: 3600 },
);

/** Uncached read for the admin editor (always current). */
export async function getSiteConfigFresh(): Promise<SiteConfig> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    return mergeConfig(row?.config as Partial<SiteConfig> | undefined);
  } catch {
    return DEFAULT_CONFIG;
  }
}
