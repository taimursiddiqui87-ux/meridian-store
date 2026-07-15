export type CategoryStatus = "live" | "coming-soon";

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  status: CategoryStatus;
  launch?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  swatch: string; // hex color for the swatch dot
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // Category slug
  price: number; // integer cents
  compareAtPrice?: number; // integer cents (original price when on sale)
  currency: string;
  collection: string;
  shortDescription: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  specs: Spec[];
  features: string[];
  rating: number;
  reviewCount: number;
  badge?: string;
  inStock: boolean;
  stock: number;
  sku: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface HeroBanner {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  align: "left" | "center";
  theme: "dark" | "light";
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface PromoBanner {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  cta: { label: string; href: string };
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  variant: string;
  quantity: number;
}
