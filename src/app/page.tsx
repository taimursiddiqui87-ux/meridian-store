import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { PromoSplit } from "@/components/home/PromoSplit";
import { BrandStory } from "@/components/home/BrandStory";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { HomeProductSection } from "@/components/home/HomeProductSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { categories, promoBanners, testimonials, getProduct } from "@/lib/data";
import { getHeroBanners } from "@/lib/banners";
import { getSiteConfig } from "@/lib/settings";
import type { Product } from "@/lib/types";

export const revalidate = 300;

export default async function Home() {
  const banners = await getHeroBanners();
  const { home } = await getSiteConfig();
  const resolve = (slugs: string[]): Product[] =>
    slugs.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));

  return (
    <>
      <HeroCarousel banners={banners} />
      <TrustBar />

      {/* Categories */}
      <section className="container-luxe py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="The Collections"
            title="Three houses, one standard"
            subtitle="Watches, perfumes and jewelry — three collections held to one obsessive standard of finish."
          />
        </Reveal>
        <Reveal className="mt-12" delay={80}>
          <CategoryShowcase categories={categories} />
        </Reveal>
      </section>

      <HomeProductSection section={home.featured} products={resolve(home.featured.productSlugs)} />

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
