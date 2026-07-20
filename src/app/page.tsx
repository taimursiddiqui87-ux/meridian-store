import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { PromoSplit } from "@/components/home/PromoSplit";
import { BrandStory } from "@/components/home/BrandStory";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { HomeProductSection } from "@/components/home/HomeProductSection";
import { FeaturedTabs, type FeaturedTab } from "@/components/home/FeaturedTabs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { categories, promoBanners, testimonials } from "@/lib/data";
import { getProducts } from "@/lib/products";
import { getHeroBanners } from "@/lib/banners";
import { getSiteConfig } from "@/lib/settings";
import type { Product } from "@/lib/types";

export const revalidate = 300;

export default async function Home() {
  const banners = await getHeroBanners();
  const { home } = await getSiteConfig();
  const catalog = await getProducts();
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  const resolve = (slugs: string[]): Product[] =>
    slugs.map((s) => bySlug.get(s)).filter((p): p is Product => Boolean(p));

  const featuredTabs: FeaturedTab[] = [
    {
      key: "watches",
      label: "Watches",
      href: "/category/watches",
      products: catalog.filter((p) => p.category === "watches"),
    },
    {
      key: "perfumes",
      label: "Perfumes",
      href: "/category/perfumes",
      products: catalog.filter((p) => p.category === "perfumes"),
    },
    {
      key: "jewelry",
      label: "Jewelry",
      href: "/category/jewelry",
      products: catalog.filter((p) => p.category === "jewelry"),
    },
    {
      key: "bestsellers",
      label: "Bestsellers",
      href: "/shop",
      products: catalog.filter((p) => p.isBestseller || p.badge === "Bestseller"),
    },
  ];

  return (
    <>
      <HeroCarousel banners={banners} />
      <TrustBar />

      {/* Categories */}
      <section className="container-luxe py-16 lg:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="The Collections"
            title="Three houses, one standard"
            subtitle="Watches, perfumes and jewelry — three collections held to one obsessive standard of finish."
            align="center"
          />
        </Reveal>
        <Reveal className="mt-12" delay={80}>
          <CategoryShowcase categories={categories} />
        </Reveal>
      </section>

      {/* Featured products with category tabs */}
      <FeaturedTabs tabs={featuredTabs} />

      <HomeProductSection
        section={home.featured}
        products={resolve(home.featured.productSlugs)}
        className="pt-16"
      />

      <section className="container-luxe py-16 lg:py-20">
        <Reveal>
          <PromoSplit promo={promoBanners[0]} />
        </Reveal>
      </section>

      <HomeProductSection section={home.bestsellers} products={resolve(home.bestsellers.productSlugs)} />

      <HomeProductSection section={home.newArrivals} products={resolve(home.newArrivals.productSlugs)} />

      <BrandStory />

      <section className="container-luxe py-16 lg:py-20">
        <Reveal>
          <PromoSplit promo={promoBanners[1]} reverse />
        </Reveal>
      </section>

      <Testimonials testimonials={testimonials} />
      <InstagramGrid />
    </>
  );
}
