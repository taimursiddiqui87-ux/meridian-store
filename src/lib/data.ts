import type {
  Category,
  Product,
  HeroBanner,
  PromoBanner,
  Testimonial,
} from "./types";

/**
 * MERIDIAN — demo catalog.
 * This is the single source of truth for the storefront. In Phase 3 the admin
 * backend writes to this same shape (later backed by a database/API).
 *
 * All imagery uses Unsplash; swap `img(...)` ids for your real product photos.
 */
export const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const BRAND = {
  name: "MERIDIAN",
  tagline: "Timeless by design.",
  established: "Est. 2019",
  email: "care@meridian.example",
  phone: "+1 (800) 555-0142",
  currency: "USD",
};

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */

export const categories: Category[] = [
  {
    slug: "watches",
    name: "Watches",
    tagline: "Mechanical & automatic timepieces",
    description:
      "Swiss-inspired movements, sapphire crystal and hand-finished cases. The collection that started it all.",
    image: img("1523275335684-37898b6baf30", 1200),
    status: "live",
  },
  {
    slug: "perfumes",
    name: "Perfumes",
    tagline: "Hand-blended extraits de parfum",
    description:
      "Small-batch extraits built on amber, oud and cedar — blended by hand and bottled in weighted glass to linger like memory.",
    image: img("1615634260167-c8cdede054de", 1200),
    status: "coming-soon",
    launch: "Autumn 2026",
  },
  {
    slug: "jewelry",
    name: "Jewelry",
    tagline: "Recycled gold & sterling silver",
    description:
      "Everyday essentials in recycled 14k gold and sterling silver — hand-finished pieces made to be worn daily and handed down.",
    image: img("1573408301185-9146fe634ad0", 1200),
    status: "coming-soon",
    launch: "Winter 2026",
  },
];

/* ------------------------------------------------------------------ */
/*  Products                                                           */
/* ------------------------------------------------------------------ */

const baseSpecs = (over: Partial<Record<string, string>> = {}) => [
  { label: "Movement", value: over.movement ?? "Automatic, 42-hour reserve" },
  { label: "Case", value: over.case ?? "39mm brushed 316L steel" },
  { label: "Crystal", value: over.crystal ?? "Anti-reflective sapphire" },
  { label: "Water resistance", value: over.water ?? "100m / 10 ATM" },
  { label: "Strap", value: over.strap ?? "Italian leather, quick-release" },
  { label: "Warranty", value: "2-year international" },
];

export const products: Product[] = [
  {
    id: "w-aera",
    slug: "meridian-aera-39",
    name: "Aera 39",
    category: "watches",
    price: 129000,
    currency: "USD",
    collection: "Aera",
    shortDescription: "Automatic · Midnight-blue dial",
    description:
      "The Aera 39 is our defining silhouette — a sunburst midnight-blue dial framed by a hand-polished 39mm case. Powered by a self-winding movement visible through the exhibition caseback, it wears as easily with linen as it does with a tailored cuff.",
    images: [
      img("1523275335684-37898b6baf30"),
      img("1524592094714-0f0654e20314"),
      img("1547996160-81dfa63595aa"),
    ],
    variants: [
      { id: "blue", name: "Midnight Blue", swatch: "#26324a" },
      { id: "silver", name: "Silver Sunray", swatch: "#c9ccce" },
      { id: "onyx", name: "Onyx", swatch: "#1c1c1e" },
    ],
    specs: baseSpecs({ case: "39mm brushed 316L steel", movement: "Automatic MER-01, 42-hour reserve" }),
    features: [
      "In-house MER-01 automatic movement",
      "Sunburst dial with applied indices",
      "Sapphire crystal, anti-reflective coating",
      "Quick-release Italian leather strap",
    ],
    rating: 4.9,
    reviewCount: 214,
    badge: "Bestseller",
    inStock: true,
    stock: 38,
    sku: "MER-AERA-39-BLU",
    isBestseller: true,
  },
  {
    id: "w-noir",
    slug: "meridian-noir-chronograph",
    name: "Noir Chronograph",
    category: "watches",
    price: 168000,
    currency: "USD",
    collection: "Noir",
    shortDescription: "Chronograph · Blacked-out steel",
    description:
      "A stealth chronograph finished in matte black PVD. Three registers, a tachymeter bezel and luminous hands make the Noir as capable as it is understated.",
    images: [img("1611591437281-460bfbe1220a"), img("1526045612212-70caf35c14df"), img("1533139502658-0198f920d8e8")],
    variants: [
      { id: "black", name: "Matte Black", swatch: "#161618" },
      { id: "gunmetal", name: "Gunmetal", swatch: "#3a3d42" },
    ],
    specs: baseSpecs({ movement: "Meca-quartz chronograph", case: "41mm black PVD steel", water: "50m / 5 ATM" }),
    features: [
      "Meca-quartz chronograph module",
      "Matte black PVD coating",
      "SuperLumiNova® indices & hands",
      "Tachymeter bezel",
    ],
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    stock: 22,
    sku: "MER-NOIR-41-BLK",
    isBestseller: true,
  },
  {
    id: "w-heritage",
    slug: "meridian-heritage-1968",
    name: "Heritage 1968",
    category: "watches",
    price: 215000,
    currency: "USD",
    collection: "Heritage",
    shortDescription: "Dress · Rose gold",
    description:
      "A tribute to mid-century elegance. The Heritage 1968 pairs a warm champagne dial with a slim rose-gold case and a domed crystal that bends the light just so.",
    images: [img("1539874754764-5a96559165b0"), img("1434056886845-dac89ffe9b56"), img("1508057198894-247b23fe5ade")],
    variants: [
      { id: "rosegold", name: "Rose Gold / Champagne", swatch: "#b76e56" },
      { id: "yellowgold", name: "Yellow Gold / Cream", swatch: "#c9a24b" },
    ],
    specs: baseSpecs({ case: "38mm rose-gold PVD steel", crystal: "Domed sapphire", strap: "Alligator-grain leather" }),
    features: [
      "Slim 8.9mm profile",
      "Domed sapphire crystal",
      "Champagne sunburst dial",
      "Alligator-grain leather strap",
    ],
    rating: 5.0,
    reviewCount: 88,
    badge: "Limited",
    inStock: true,
    stock: 9,
    sku: "MER-HERI-38-RG",
  },
  {
    id: "w-terra",
    slug: "meridian-terra-gmt",
    name: "Terra GMT",
    category: "watches",
    price: 149000,
    currency: "USD",
    collection: "Terra",
    shortDescription: "GMT · Sage green",
    description:
      "Built for travellers. A true GMT complication tracks a second time zone against a 24-hour bezel, all beneath a scratch-resistant sapphire dome on a rugged sage dial.",
    images: [img("1594534475808-b18fc33b045e"), img("1508057198894-247b23fe5ade"), img("1620625515032-6ed0c1790c75")],
    variants: [
      { id: "sage", name: "Sage Green", swatch: "#5c6b53" },
      { id: "steel", name: "Steel Blue", swatch: "#3f5568" },
    ],
    specs: baseSpecs({ movement: "Automatic GMT, 40-hour reserve", case: "40mm brushed steel", water: "200m / 20 ATM" }),
    features: [
      "True GMT second-time-zone hand",
      "24-hour rotating bezel",
      "200m water resistance",
      "Screw-down crown",
    ],
    rating: 4.9,
    reviewCount: 132,
    badge: "New",
    inStock: true,
    stock: 27,
    sku: "MER-TERRA-40-SG",
    isNew: true,
  },
  {
    id: "w-luna",
    slug: "meridian-luna-moonphase",
    name: "Luna Moonphase",
    category: "watches",
    price: 198000,
    currency: "USD",
    collection: "Luna",
    shortDescription: "Moonphase · Ivory",
    description:
      "A poetic complication. The Luna traces the lunar cycle across an ivory dial with a hand-finished mother-of-pearl moon disc — quietly mechanical, endlessly watchable.",
    images: [img("1620625515032-6ed0c1790c75"), img("1533139502658-0198f920d8e8"), img("1523275335684-37898b6baf30")],
    variants: [
      { id: "ivory", name: "Ivory", swatch: "#efe7d6" },
      { id: "slate", name: "Slate", swatch: "#4a4f57" },
    ],
    specs: baseSpecs({ movement: "Automatic moonphase", case: "39mm polished steel", crystal: "Box sapphire" }),
    features: [
      "Mother-of-pearl moonphase disc",
      "Automatic movement with moon complication",
      "Box-domed sapphire crystal",
      "Sunray ivory dial",
    ],
    rating: 4.9,
    reviewCount: 74,
    inStock: true,
    stock: 14,
    sku: "MER-LUNA-39-IV",
  },
  {
    id: "w-field",
    slug: "meridian-field-officer",
    name: "Field Officer",
    category: "watches",
    price: 92000,
    currency: "USD",
    collection: "Field",
    shortDescription: "Field · Khaki",
    description:
      "Utilitarian by design. A high-legibility khaki dial, sword hands and a sailcloth strap make the Field Officer the honest everyday companion — tough, light and quietly handsome.",
    images: [img("1587836374828-4dbafa94cf0e"), img("1547996160-81dfa63595aa"), img("1526045612212-70caf35c14df")],
    variants: [
      { id: "khaki", name: "Khaki", swatch: "#7a7350" },
      { id: "black", name: "Black", swatch: "#1f1f22" },
    ],
    specs: baseSpecs({ movement: "Automatic, 40-hour reserve", case: "38mm bead-blasted steel", strap: "Sailcloth with leather backing" }),
    features: [
      "High-legibility field dial",
      "Bead-blasted anti-glare case",
      "Luminous sword hands",
      "Sailcloth strap",
    ],
    rating: 4.7,
    reviewCount: 198,
    inStock: true,
    stock: 51,
    sku: "MER-FIELD-38-KH",
  },
  {
    id: "w-onyx",
    slug: "meridian-onyx-slim",
    name: "Onyx Slim",
    category: "watches",
    price: 115000,
    currency: "USD",
    collection: "Onyx",
    shortDescription: "Minimalist · All black",
    description:
      "Reduction as luxury. The Onyx Slim strips the dial to two hands and a whisper of an index, cased in 6.8mm of blackened steel. Nothing to add, nothing to take away.",
    images: [img("1524592094714-0f0654e20314"), img("1526045612212-70caf35c14df"), img("1611591437281-460bfbe1220a")],
    variants: [
      { id: "black", name: "All Black", swatch: "#141416" },
      { id: "graphite", name: "Graphite", swatch: "#4b4e54" },
    ],
    specs: baseSpecs({ movement: "Swiss quartz", case: "40mm black steel, 6.8mm thin", strap: "Milanese mesh" }),
    features: [
      "Ultra-slim 6.8mm case",
      "Minimalist two-hand dial",
      "Milanese mesh bracelet",
      "Scratch-resistant coating",
    ],
    rating: 4.8,
    reviewCount: 143,
    inStock: true,
    stock: 33,
    sku: "MER-ONYX-40-BLK",
  },
  {
    id: "w-aurora",
    slug: "meridian-aurora-two-tone",
    name: "Aurora Two-Tone",
    category: "watches",
    price: 176000,
    compareAtPrice: 198000,
    currency: "USD",
    collection: "Aurora",
    shortDescription: "Two-tone · Steel & gold",
    description:
      "The Aurora balances brushed steel against warm gold accents for a look that reads dressy or relaxed. A fluted bezel catches the light with every turn of the wrist.",
    images: [img("1434056886845-dac89ffe9b56"), img("1539874754764-5a96559165b0"), img("1508057198894-247b23fe5ade")],
    variants: [
      { id: "twotone", name: "Steel / Gold", swatch: "#caa96b" },
      { id: "steel", name: "Full Steel", swatch: "#c4c7ca" },
    ],
    specs: baseSpecs({ case: "39mm two-tone steel", movement: "Automatic, 42-hour reserve" }),
    features: [
      "Two-tone brushed & gold finish",
      "Fluted bezel",
      "Automatic movement",
      "Five-link bracelet",
    ],
    rating: 4.8,
    reviewCount: 61,
    badge: "Sale",
    inStock: true,
    stock: 18,
    sku: "MER-AUR-39-TT",
  },
];

/* ------------------------------------------------------------------ */
/*  Marketing content — banners, promos, testimonials                 */
/* ------------------------------------------------------------------ */

export const heroBanners: HeroBanner[] = [
  {
    id: "hero-aera",
    eyebrow: "New Season · The Aera Collection",
    title: "Time, beautifully kept",
    subtitle:
      "Hand-finished automatic timepieces engineered to be worn for a lifetime — and passed on.",
    image: img("1523275335684-37898b6baf30", 2000),
    align: "left",
    theme: "dark",
    primaryCta: { label: "Shop Watches", href: "/shop" },
    secondaryCta: { label: "The Aera 39", href: "/product/meridian-aera-39" },
  },
  {
    id: "hero-noir",
    eyebrow: "Signature",
    title: "Made for the hours that matter",
    subtitle:
      "The Noir Chronograph — stealth finish, Swiss-grade precision, unmistakable presence.",
    image: img("1526045612212-70caf35c14df", 2000),
    align: "center",
    theme: "dark",
    primaryCta: { label: "Discover Noir", href: "/product/meridian-noir-chronograph" },
    secondaryCta: { label: "View Collection", href: "/shop" },
  },
  {
    id: "hero-perfumes",
    eyebrow: "Coming Autumn 2026",
    title: "A signature you can't see",
    subtitle:
      "Meridian Perfumes arrives this autumn — small-batch extraits de parfum, blended by hand. Join the list to be first.",
    image: img("1541643600914-78b084683601", 2000),
    align: "left",
    theme: "dark",
    primaryCta: { label: "Get Early Access", href: "/category/perfumes" },
    secondaryCta: { label: "Discover Perfumes", href: "/category/perfumes" },
  },
  {
    id: "hero-jewelry",
    eyebrow: "Coming Winter 2026",
    title: "Worn close, kept forever",
    subtitle:
      "Meridian Jewelry — recycled gold and sterling essentials, finished by hand. Be first in line for the launch.",
    image: img("1515562141207-7a88fb7ce338", 2000),
    align: "center",
    theme: "dark",
    primaryCta: { label: "Get Early Access", href: "/category/jewelry" },
    secondaryCta: { label: "See the Collection", href: "/category/jewelry" },
  },
];

export const promoBanners: PromoBanner[] = [
  {
    id: "promo-engraving",
    eyebrow: "Complimentary",
    title: "Personal engraving, on the house",
    body: "Add a monogram, a date or a few words to any caseback — complimentary with every timepiece.",
    image: img("1508057198894-247b23fe5ade", 1200),
    cta: { label: "Explore Watches", href: "/shop" },
  },
  {
    id: "promo-craft",
    eyebrow: "The Workshop",
    title: "Assembled by hand, tested for years",
    body: "Every Meridian is regulated in six positions and pressure-tested before it ever reaches your wrist.",
    image: img("1533139502658-0198f920d8e8", 1200),
    cta: { label: "Our Craft", href: "/about" },
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The Aera 39 is the first watch I’ve owned that gets compliments from strangers. It feels twice its price.",
    author: "Daniel R.",
    location: "London, UK",
    rating: 5,
  },
  {
    id: "t2",
    quote:
      "Ordered on Monday, engraved and on my wrist by Thursday. The finishing is genuinely exceptional.",
    author: "Priya M.",
    location: "Toronto, CA",
    rating: 5,
  },
  {
    id: "t3",
    quote:
      "I’ve bought watches five times the cost of my Terra GMT. This is the one I actually reach for.",
    author: "Marcus B.",
    location: "Berlin, DE",
    rating: 5,
  },
  {
    id: "t4",
    quote:
      "Customer care replaced a strap the same day, no questions. That’s why I’ll keep coming back.",
    author: "Sofia L.",
    location: "Milan, IT",
    rating: 5,
  },
];

export const marqueeItems = [
  "Free worldwide shipping",
  "2-year international warranty",
  "Complimentary engraving",
  "30-day returns",
  "Interest-free installments",
];

export const instagramImages = [
  img("1523275335684-37898b6baf30", 600),
  img("1592945403244-b3fbafd7f539", 600), // perfume
  img("1611591437281-460bfbe1220a", 600),
  img("1535632066927-ab7c9ab60908", 600), // jewelry
  img("1524592094714-0f0654e20314", 600),
  img("1587836374828-4dbafa94cf0e", 600),
];

/* ------------------------------------------------------------------ */
/*  Selectors                                                          */
/* ------------------------------------------------------------------ */

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getProductsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);

export const bestsellers = products.filter((p) => p.isBestseller);
export const newArrivals = products.filter((p) => p.isNew || p.badge === "New");
export const featured = products.slice(0, 4);

export const relatedProducts = (slug: string, limit = 4) =>
  products.filter((p) => p.slug !== slug).slice(0, limit);
