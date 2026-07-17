import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { PromoSplit } from "@/components/home/PromoSplit";
import { BrandStory } from "@/components/home/BrandStory";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import {
  heroBanners,
  categories,
  products,
  promoBanners,
  testimonials,
} from "@/lib/data";

export default function Home() {
  return (
    <>
      <HeroCarousel banners={heroBanners} />
      <TrustBar />

      {/* Categories */}
      <section className="container-luxe py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="The Collections"
            title="Three houses, one standard"
            subtitle="It begins with watches. This year, Meridian expands into perfumes and jewelry — each held to the same obsessive finish."
          />
        </Reveal>
        <Reveal className="mt-12" delay={80}>
          <CategoryShowcase categories={categories} />
        </Reveal>
      </section>

      {/* Bestsellers */}
      <section className="container-luxe pb-8">
        <Reveal>
          <SectionHeading
            eyebrow="The Signature Edit"
            title="Bestselling timepieces"
            cta={{ label: "Shop all watches", href: "/shop" }}
          />
        </Reveal>
        <Reveal className="mt-12" delay={80}>
          <ProductGrid products={products.slice(0, 4)} />
        </Reveal>
      </section>

      {/* Promo — engraving */}
      <section className="container-luxe py-16 lg:py-20">
        <Reveal>
          <PromoSplit promo={promoBanners[0]} />
        </Reveal>
      </section>

      {/* New arrivals */}
      <section className="container-luxe pb-8">
        <Reveal>
          <SectionHeading
            eyebrow="New This Season"
            title="Just landed"
            cta={{ label: "View new arrivals", href: "/shop?sort=new" }}
          />
        </Reveal>
        <Reveal className="mt-12" delay={80}>
          <ProductGrid products={products.slice(4, 8)} />
        </Reveal>
      </section>

      <div className="mt-12">
        <BrandStory />
      </div>

      {/* Promo — craft */}
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
