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
      "Small-batch extraits built on amber, oud and cedar — blended by hand in Grasse and bottled in weighted glass to linger like memory.",
    image: img("1615634260167-c8cdede054de", 1200),
    status: "live",
  },
  {
    slug: "jewelry",
    name: "Jewelry",
    tagline: "Recycled gold & sterling silver",
    description:
      "Everyday essentials in recycled 14k gold and sterling silver — hand-finished in Vicenza and made to be handed down.",
    image: img("1573408301185-9146fe634ad0", 1200),
    status: "live",
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

const perfumeSpecs = (o: { top: string; heart: string; base: string; conc?: string }) => [
  { label: "Concentration", value: o.conc ?? "Extrait de parfum · 28%" },
  { label: "Size", value: "50 ml / 1.7 fl oz" },
  { label: "Top notes", value: o.top },
  { label: "Heart notes", value: o.heart },
  { label: "Base notes", value: o.base },
  { label: "Longevity", value: "10–12 hours on skin" },
  { label: "Origin", value: "Composed & bottled in Grasse, France" },
];

const jewelrySpecs = (o: { material: string; stone?: string; dims: string; fit?: string }) => [
  { label: "Material", value: o.material },
  ...(o.stone ? [{ label: "Stone", value: o.stone }] : []),
  { label: "Dimensions", value: o.dims },
  ...(o.fit ? [{ label: "Fit", value: o.fit }] : []),
  { label: "Care", value: "Polishing cloth included" },
  { label: "Origin", value: "Handmade in Vicenza, Italy" },
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

  /* ---------------- Perfumes ---------------- */

  {
    id: "p-ambre",
    slug: "ambre-meridien",
    name: "Ambre Méridien",
    category: "perfumes",
    price: 18500,
    currency: "USD",
    collection: "Ambrée",
    variantLabel: "Size",
    shortDescription: "Extrait · Amber, saffron & cedar",
    description:
      "Our signature scent. Saffron and bergamot open onto a heart of labdanum and rose, resting on a base of warm amber, cedar and skin musk. Composed in Grasse and macerated for six weeks, it wears close — a scent for the person beside you, not the room.",
    images: [img("1615634260167-c8cdede054de"), img("1587017539504-67cfbddac569"), img("1592945403244-b3fbafd7f539")],
    variants: [{ id: "50ml", name: "50 ml · Extrait de Parfum", swatch: "#A66A2E" }],
    specs: perfumeSpecs({
      top: "Saffron, bergamot",
      heart: "Labdanum, Rose de Mai",
      base: "Amber, Atlas cedar, musk",
    }),
    features: [
      "Small-batch extrait, numbered bottle",
      "Weighted glass flacon with brass cap",
      "Two 2 ml travel sprays included",
      "Recyclable glass, FSC-certified box",
    ],
    rating: 4.9,
    reviewCount: 87,
    badge: "Bestseller",
    inStock: true,
    stock: 42,
    sku: "MER-PF-AMB-50",
    isBestseller: true,
  },
  {
    id: "p-lumiere",
    slug: "premiere-lumiere",
    name: "Première Lumière",
    category: "perfumes",
    price: 14500,
    currency: "USD",
    collection: "Fraîche",
    variantLabel: "Size",
    shortDescription: "Extrait · Neroli & white tea",
    description:
      "Morning, bottled. Tunisian neroli and cold bergamot lift into white tea and orange blossom, grounded by a whisper of white musk. Luminous without sweetness — the scent of pressed linen and open windows.",
    images: [img("1541643600914-78b084683601"), img("1563170351-be82bc888aa4"), img("1594035910387-fea47794261f")],
    variants: [{ id: "50ml", name: "50 ml · Extrait de Parfum", swatch: "#E8D9A8" }],
    specs: perfumeSpecs({
      top: "Neroli, cold bergamot",
      heart: "White tea, orange blossom",
      base: "White musk, blond woods",
    }),
    features: [
      "Small-batch extrait, numbered bottle",
      "Weighted glass flacon with brass cap",
      "Two 2 ml travel sprays included",
      "Recyclable glass, FSC-certified box",
    ],
    rating: 4.8,
    reviewCount: 64,
    inStock: true,
    stock: 55,
    sku: "MER-PF-LUM-50",
  },
  {
    id: "p-minuit",
    slug: "minuit-dore",
    name: "Minuit Doré",
    category: "perfumes",
    price: 21000,
    currency: "USD",
    collection: "Ambrée",
    variantLabel: "Size",
    shortDescription: "Extrait · Oud, vanilla & smoke",
    description:
      "The late hour. Smoked oud and black vanilla fold into incense and a trace of rum, finished with golden benzoin. Poured in our smallest batches and aged the longest — dense, quiet, unforgettable.",
    images: [img("1588405748880-12d1d2a59f75"), img("1608528577891-eb055944f2e7"), img("1615634260167-c8cdede054de")],
    variants: [{ id: "50ml", name: "50 ml · Extrait de Parfum", swatch: "#6B4A1F" }],
    specs: perfumeSpecs({
      top: "Rum accord, pink pepper",
      heart: "Smoked oud, incense",
      base: "Black vanilla, benzoin",
      conc: "Extrait de parfum · 30%",
    }),
    features: [
      "Aged twelve weeks before bottling",
      "Weighted glass flacon with brass cap",
      "Two 2 ml travel sprays included",
      "Recyclable glass, FSC-certified box",
    ],
    rating: 5.0,
    reviewCount: 41,
    badge: "Limited",
    inStock: true,
    stock: 12,
    sku: "MER-PF-MIN-50",
  },
  {
    id: "p-jardin",
    slug: "jardin-de-pierre",
    name: "Jardin de Pierre",
    category: "perfumes",
    price: 16000,
    currency: "USD",
    collection: "Boisée",
    variantLabel: "Size",
    shortDescription: "Extrait · Vetiver & fig leaf",
    description:
      "A stone garden after rain. Green fig leaf and crushed herbs over Haitian vetiver and stone pine, dried down with mineral ambergris. Cool, rooted and quietly architectural.",
    images: [img("1585386959984-a4155224a1ad"), img("1523293182086-7651a899d37f"), img("1588405748880-12d1d2a59f75")],
    variants: [{ id: "50ml", name: "50 ml · Extrait de Parfum", swatch: "#7A7D4F" }],
    specs: perfumeSpecs({
      top: "Fig leaf, crushed herbs",
      heart: "Haitian vetiver, stone pine",
      base: "Ambergris accord, oakmoss",
    }),
    features: [
      "Small-batch extrait, numbered bottle",
      "Weighted glass flacon with brass cap",
      "Two 2 ml travel sprays included",
      "Recyclable glass, FSC-certified box",
    ],
    rating: 4.7,
    reviewCount: 52,
    inStock: true,
    stock: 31,
    sku: "MER-PF-JAR-50",
  },
  {
    id: "p-rose",
    slug: "rose-infinie",
    name: "Rose Infinie",
    category: "perfumes",
    price: 17500,
    currency: "USD",
    collection: "Florale",
    variantLabel: "Size",
    shortDescription: "Extrait · Rose de Mai & suede",
    description:
      "A rose with its thorns kept on. Rose de Mai from Grasse is sharpened with pink pepper and lychee, then softened into suede and sandalwood. Romantic, but never naïve.",
    images: [img("1594035910387-fea47794261f"), img("1592945403244-b3fbafd7f539"), img("1563170351-be82bc888aa4")],
    variants: [{ id: "50ml", name: "50 ml · Extrait de Parfum", swatch: "#D9A0A6" }],
    specs: perfumeSpecs({
      top: "Pink pepper, lychee",
      heart: "Rose de Mai, peony",
      base: "Suede accord, sandalwood",
    }),
    features: [
      "Rose de Mai harvested in Grasse",
      "Weighted glass flacon with brass cap",
      "Two 2 ml travel sprays included",
      "Recyclable glass, FSC-certified box",
    ],
    rating: 4.8,
    reviewCount: 38,
    badge: "New",
    inStock: true,
    stock: 24,
    sku: "MER-PF-ROS-50",
    isNew: true,
  },
  {
    id: "p-cuir",
    slug: "cuir-celeste",
    name: "Cuir Céleste",
    category: "perfumes",
    price: 23000,
    currency: "USD",
    collection: "Boisée",
    variantLabel: "Size",
    shortDescription: "Extrait · Leather, iris & tonka",
    description:
      "The scent of the watchmaker's bench — supple leather and cool iris warmed by tonka bean and a breath of hay. Our most tactile composition, built to age with you like a strap does.",
    images: [img("1592945403244-b3fbafd7f539"), img("1523293182086-7651a899d37f"), img("1587017539504-67cfbddac569")],
    variants: [{ id: "50ml", name: "50 ml · Extrait de Parfum", swatch: "#8A5A33" }],
    specs: perfumeSpecs({
      top: "Bergamot, hay",
      heart: "Leather accord, orris butter",
      base: "Tonka bean, vetiver",
      conc: "Extrait de parfum · 30%",
    }),
    features: [
      "Orris butter aged three years",
      "Weighted glass flacon with brass cap",
      "Two 2 ml travel sprays included",
      "Recyclable glass, FSC-certified box",
    ],
    rating: 4.9,
    reviewCount: 29,
    inStock: true,
    stock: 18,
    sku: "MER-PF-CUI-50",
  },

  /* ---------------- Jewelry ---------------- */

  {
    id: "j-solstice",
    slug: "solstice-band",
    name: "Solstice Band",
    category: "jewelry",
    price: 32000,
    currency: "USD",
    collection: "Rings",
    variantLabel: "Metal",
    shortDescription: "Ring · Hand-forged 14k gold",
    description:
      "A ring with the weight of a promise. Hand-forged from recycled 14k gold and softly faceted so it catches low light the way a dial does. Worn alone or stacked — made to outlast trends and owners alike.",
    images: [img("1611652022419-a9419f74343d"), img("1608042314453-ae338d80c427"), img("1603561591411-07134e71a2a9")],
    variants: [
      { id: "gold", name: "14k Gold", swatch: "#C9A24B" },
      { id: "rosegold", name: "14k Rose Gold", swatch: "#B76E56" },
      { id: "silver", name: "Sterling Silver", swatch: "#C6C9CC" },
    ],
    specs: jewelrySpecs({
      material: "Recycled 14k solid gold",
      dims: "3.5 mm band width",
      fit: "Sizes 5–12 · free resizing within 60 days",
    }),
    features: [
      "Recycled solid gold — never plated",
      "Hand-forged and hand-polished",
      "Complimentary resizing within 60 days",
      "Presented in the signature Meridian case",
    ],
    rating: 4.9,
    reviewCount: 112,
    badge: "Bestseller",
    inStock: true,
    stock: 26,
    sku: "MER-JW-SOL-R",
    isBestseller: true,
  },
  {
    id: "j-eclat",
    slug: "eclat-solitaire",
    name: "Éclat Solitaire",
    category: "jewelry",
    price: 45000,
    currency: "USD",
    collection: "Rings",
    variantLabel: "Metal",
    shortDescription: "Ring · White sapphire solitaire",
    description:
      "One stone, held high. A hand-cut white sapphire in a six-claw crown of recycled gold, engineered like a movement — every angle set to return light. The quiet alternative to the expected solitaire.",
    images: [img("1605100804763-247f67b3557e"), img("1515562141207-7a88fb7ce338"), img("1608042314453-ae338d80c427")],
    variants: [
      { id: "gold", name: "14k Gold", swatch: "#C9A24B" },
      { id: "whitegold", name: "14k White Gold", swatch: "#DDD9CE" },
    ],
    specs: jewelrySpecs({
      material: "Recycled 14k solid gold",
      stone: "1.0 ct hand-cut white sapphire",
      dims: "6-claw crown · 1.8 mm band",
      fit: "Sizes 4–10 · free resizing within 60 days",
    }),
    features: [
      "Hand-cut, conflict-free white sapphire",
      "Six-claw crown setting",
      "Recycled solid gold — never plated",
      "Presented in the signature Meridian case",
    ],
    rating: 5.0,
    reviewCount: 44,
    badge: "Limited",
    inStock: true,
    stock: 7,
    sku: "MER-JW-ECL-R",
  },
  {
    id: "j-cascade",
    slug: "cascade-chain",
    name: "Cascade Chain",
    category: "jewelry",
    price: 29000,
    currency: "USD",
    collection: "Necklaces",
    variantLabel: "Metal",
    shortDescription: "Necklace · Layered curb chain",
    description:
      "Two weights of hand-linked curb chain, layered to move like water. Solid through and through, with our brass-etched clasp signed the way we sign a caseback.",
    images: [img("1535632066927-ab7c9ab60908"), img("1610694955371-d4a3e0ce4b52"), img("1599643478518-a784e5dc4c8f")],
    variants: [
      { id: "gold", name: "14k Gold", swatch: "#C9A24B" },
      { id: "silver", name: "Sterling Silver", swatch: "#C6C9CC" },
    ],
    specs: jewelrySpecs({
      material: "Recycled 14k solid gold",
      dims: "41 cm + 46 cm layered · 3 cm extender",
      fit: "Signed lobster clasp",
    }),
    features: [
      "Two hand-linked curb weights",
      "Signed, brass-etched clasp",
      "Recycled solid gold — never plated",
      "Presented in the signature Meridian case",
    ],
    rating: 4.8,
    reviewCount: 76,
    inStock: true,
    stock: 33,
    sku: "MER-JW-CAS-N",
  },
  {
    id: "j-lune",
    slug: "lune-pendant",
    name: "Lune Pendant",
    category: "jewelry",
    price: 26000,
    currency: "USD",
    collection: "Necklaces",
    variantLabel: "Metal",
    shortDescription: "Necklace · Moonstone pendant",
    description:
      "A sliver of moon, kept close. Rainbow moonstone bezel-set in recycled gold on a fine trace chain — the companion piece to our Luna Moonphase, made for the hours in between.",
    images: [img("1602173574767-37ac01994b2a"), img("1599643478518-a784e5dc4c8f"), img("1603561591411-07134e71a2a9")],
    variants: [
      { id: "gold", name: "14k Gold", swatch: "#C9A24B" },
      { id: "rosegold", name: "14k Rose Gold", swatch: "#B76E56" },
    ],
    specs: jewelrySpecs({
      material: "Recycled 14k solid gold",
      stone: "6 mm rainbow moonstone, bezel-set",
      dims: "45 cm trace chain · 5 cm extender",
    }),
    features: [
      "Bezel-set rainbow moonstone",
      "Companion to the Luna Moonphase watch",
      "Recycled solid gold — never plated",
      "Presented in the signature Meridian case",
    ],
    rating: 4.9,
    reviewCount: 58,
    badge: "New",
    inStock: true,
    stock: 21,
    sku: "MER-JW-LUN-N",
    isNew: true,
  },
  {
    id: "j-perle",
    slug: "perle-studs",
    name: "Perle Studs",
    category: "jewelry",
    price: 18000,
    currency: "USD",
    collection: "Earrings",
    variantLabel: "Metal",
    shortDescription: "Earrings · Freshwater pearl studs",
    description:
      "The daily pearl, done properly. Hand-matched freshwater pearls on solid gold posts with our weighted butterfly backs — substantial enough to feel, subtle enough to forget.",
    images: [img("1573408301185-9146fe634ad0"), img("1617038220319-276d3cfab638"), img("1610694955371-d4a3e0ce4b52")],
    variants: [
      { id: "gold", name: "14k Gold posts", swatch: "#C9A24B" },
      { id: "silver", name: "Sterling Silver posts", swatch: "#C6C9CC" },
    ],
    specs: jewelrySpecs({
      material: "Recycled 14k gold posts",
      stone: "7.5 mm hand-matched freshwater pearls",
      dims: "Weighted butterfly backs",
    }),
    features: [
      "Hand-matched for lustre and shape",
      "Solid gold posts — hypoallergenic",
      "Weighted butterfly backs",
      "Presented in the signature Meridian case",
    ],
    rating: 4.8,
    reviewCount: 93,
    inStock: true,
    stock: 44,
    sku: "MER-JW-PER-E",
  },
  {
    id: "j-hoops",
    slug: "meridien-hoops",
    name: "Méridien Hoops",
    category: "jewelry",
    price: 21000,
    compareAtPrice: 24000,
    currency: "USD",
    collection: "Earrings",
    variantLabel: "Metal",
    shortDescription: "Earrings · Sculpted gold hoops",
    description:
      "Our line, drawn in gold. Sculpted hollow-form hoops with the gentle taper of a lugless case — featherlight at full size, secured with hinged closures that click like a clasp should.",
    images: [img("1617038220319-276d3cfab638"), img("1573408301185-9146fe634ad0"), img("1599643478518-a784e5dc4c8f")],
    variants: [
      { id: "gold", name: "14k Gold", swatch: "#C9A24B" },
      { id: "silver", name: "Sterling Silver", swatch: "#C6C9CC" },
    ],
    specs: jewelrySpecs({
      material: "Recycled 14k solid gold",
      dims: "24 mm diameter · hollow-form",
      fit: "Hinged snap closure",
    }),
    features: [
      "Hollow-form — featherlight all day",
      "Hinged closures, satisfying click",
      "Recycled solid gold — never plated",
      "Presented in the signature Meridian case",
    ],
    rating: 4.7,
    reviewCount: 67,
    badge: "Sale",
    inStock: true,
    stock: 29,
    sku: "MER-JW-HOO-E",
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
    primaryCta: { label: "Shop Watches", href: "/category/watches" },
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
    secondaryCta: { label: "View Collection", href: "/category/watches" },
  },
  {
    id: "hero-perfumes",
    eyebrow: "Now Live · The Perfume Collection",
    title: "A signature you can't see",
    subtitle:
      "Six extraits de parfum, blended by hand in Grasse and bottled in weighted glass. Worn in whispers, remembered for hours.",
    image: img("1588405748880-12d1d2a59f75", 2000),
    align: "left",
    theme: "dark",
    primaryCta: { label: "Shop Perfumes", href: "/category/perfumes" },
    secondaryCta: { label: "Ambre Méridien", href: "/product/ambre-meridien" },
  },
  {
    id: "hero-jewelry",
    eyebrow: "Now Live · The Jewelry Collection",
    title: "Worn close, kept forever",
    subtitle:
      "Recycled gold and sterling essentials, hand-finished in Vicenza and made to be handed down.",
    image: img("1611652022419-a9419f74343d", 2000),
    align: "center",
    theme: "dark",
    primaryCta: { label: "Shop Jewelry", href: "/category/jewelry" },
    secondaryCta: { label: "The Solstice Band", href: "/product/solstice-band" },
  },
];

export const promoBanners: PromoBanner[] = [
  {
    id: "promo-engraving",
    eyebrow: "Complimentary",
    title: "Personal engraving, on the house",
    body: "Add a monogram, a date or a few words to any caseback — complimentary with every timepiece.",
    image: img("1508057198894-247b23fe5ade", 1200),
    cta: { label: "Explore Watches", href: "/category/watches" },
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
  "Now live: Perfumes & Jewelry",
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

/** Same-category products first, then the rest of the store. */
export const relatedProducts = (slug: string, limit = 4) => {
  const current = getProduct(slug);
  if (!current) return products.slice(0, limit);
  const same = products.filter((p) => p.category === current.category && p.slug !== slug);
  const rest = products.filter((p) => p.category !== current.category && p.slug !== slug);
  return [...same, ...rest].slice(0, limit);
};

/** Label used for the collection filter on each category's listing page. */
export const collectionLabels: Record<string, string> = {
  watches: "Collection",
  perfumes: "Scent Family",
  jewelry: "Type",
};

/** Editorial band shown at the bottom of each category storefront. */
export const categoryEditorial: Record<string, PromoBanner> = {
  watches: {
    id: "edit-watches",
    eyebrow: "The Workshop",
    title: "Assembled by hand, tested for years",
    body: "Every Meridian is regulated in six positions and pressure-tested before it ever reaches your wrist.",
    image: img("1533139502658-0198f920d8e8", 1200),
    cta: { label: "Our craft", href: "/about" },
  },
  perfumes: {
    id: "edit-perfumes",
    eyebrow: "The Atelier",
    title: "Blended by hand in Grasse",
    body: "Each extrait is composed in small numbered batches, macerated for six weeks and bottled at up to 30% concentration — strength you wear in whispers, not clouds.",
    image: img("1588405748880-12d1d2a59f75", 1200),
    cta: { label: "Read our story", href: "/about" },
  },
  jewelry: {
    id: "edit-jewelry",
    eyebrow: "The Bench",
    title: "Recycled gold, hand-set stones",
    body: "Every piece begins as reclaimed gold, refined and re-alloyed in Vicenza, then finished at the bench by a single goldsmith — the same way our watches are built.",
    image: img("1599643478518-a784e5dc4c8f", 1200),
    cta: { label: "Our craft", href: "/about" },
  },
};
