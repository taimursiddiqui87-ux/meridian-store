# MERIDIAN — Premium Multi-Category E-commerce

**Live demo:** [meridian-store-beige.vercel.app](https://meridian-store-beige.vercel.app) · **Admin:** [/admin](https://meridian-store-beige.vercel.app/admin) · **Repo:** [taimursiddiqui87-ux/meridian-store](https://github.com/taimursiddiqui87-ux/meridian-store)

A Shopify-style storefront **and** admin backend for a premium watch brand, built to expand into two upcoming product lines (Eyewear, Leather Goods).

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS** — one codebase serves both the customer-facing storefront and the admin dashboard.

> `MERIDIAN` is a placeholder brand. Product names, prices, copy and images all live in a single data file and are trivial to change — see [Customizing](#customizing).

---

## Getting started

```bash
npm install
npm run dev
```

- Storefront → http://localhost:3000
- Admin backend → http://localhost:3000/admin

```bash
npm run build   # production build (type-checks + prerenders all routes)
npm run start   # serve the production build
```

---

## What's built (Phase 1 — Design)

### Storefront (customer-facing)
| Route | Description |
|-------|-------------|
| `/` | Homepage — **multi-banner hero carousel**, trust bar, category showcase, bestsellers, promo banners, new arrivals, brand story, reviews, Instagram grid |
| `/shop` | Product listing with **filters** (collection, price, availability), **sort**, and search |
| `/product/[slug]` | Product detail — image gallery, variants, quantity, add-to-cart, spec accordions, related products |
| `/category/[slug]` | "Coming Soon" pages for upcoming lines (Eyewear, Leather Goods) with notify-me capture |
| `/cart` | Full cart page + a slide-out cart drawer available site-wide |
| `/checkout` | Multi-step checkout (contact → shipping → delivery → payment) with **order confirmation + email message** |
| `/account/login`, `/account/signup` | Auth screens |
| `/account/orders` | Order history with tracking |
| `/about` | Brand story |

Plus a persistent cart (localStorage), a custom 404, and full responsive + light-motion design.

### Admin backend (`/admin`)
| Route | Description |
|-------|-------------|
| `/admin` | **Daily report dashboard** — KPIs, 14-day revenue chart, recent orders, traffic channels, low-stock alerts, top products |
| `/admin/orders` | Orders table with status tabs & search |
| `/admin/products` | **Add / edit / delete products & manage inventory** (fully interactive) |
| `/admin/deliveries` | Shipment tracking board across couriers |
| `/admin/customers` | Customer list with tiers |
| `/admin/content` | **Banner & content manager** — reorder hero slides, promos, announcement bar |
| `/admin/settings` | Store, shipping, payment & notification settings |

---

## Roadmap

- **Phase 1 — Design** ✅ _(this delivery)_ — full responsive UI for storefront + admin, with working cart, filtering, and interactive product management.
- **Phase 2 — Commerce logic** — real auth (login/signup), Stripe/PayPal payments, order persistence, and transactional **order-confirmation emails**.
- **Phase 3 — Live backend** — connect the admin to a real database/API so product, inventory, order and banner changes persist.

---

## Project structure

```
src/
├── app/                    # Routes (App Router)
│   ├── layout.tsx          # Root layout + fonts + providers
│   ├── page.tsx            # Homepage
│   ├── shop/ product/ category/ cart/ checkout/ account/ about/
│   └── admin/              # Admin backend (its own shell)
├── components/
│   ├── layout/             # Header, Footer, AnnouncementBar, Chrome
│   ├── home/               # Homepage sections (HeroCarousel, etc.)
│   ├── product/ shop/ cart/ auth/ category/
│   ├── admin/              # AdminShell + admin views
│   └── ui/                 # Reusable primitives (Stars, Reveal, etc.)
├── context/CartContext.tsx # Cart state (persisted)
└── lib/
    ├── data.ts             # ⭐ Storefront catalog — single source of truth
    ├── adminData.ts        # Admin mock analytics/orders/deliveries
    ├── types.ts            # Shared types
    └── utils.ts            # cn(), formatPrice()
```

---

## Customizing

- **Brand name / tagline / contact** → `src/lib/data.ts` → `BRAND`
- **Products** (name, price, images, variants, specs) → `src/lib/data.ts` → `products` (prices are integer **cents**)
- **Categories & upcoming lines** → `src/lib/data.ts` → `categories`
- **Hero & promo banners** → `src/lib/data.ts` → `heroBanners`, `promoBanners`
- **Colors, fonts, motion** → `tailwind.config.ts` (brass/stone/ink palette, Cormorant Garamond + Inter)
- **Product images** currently use Unsplash; swap the `img("photo-id")` references for your own product photography.

---

## Notes

- Payments, authentication and email are **UI-only** in Phase 1 (clearly marked as demo). No real transactions occur.
- Product images are loaded from Unsplash for the design; replace with your own assets before launch.
- `images.unoptimized` is enabled for zero-config previews — enable Next.js image optimization (or a CDN) for production.
