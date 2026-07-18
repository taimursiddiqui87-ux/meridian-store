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
  categories,
  promoBanners,
  testimonials,
  getProductsByCategory,
} from "@/lib/data";
import { getHeroBanners } from "@/lib/banners";

export const revalidate = 300;

export default async function Home() {
  const banners = await getHeroBanners();
  const watches = getProductsByCategory("watches");
  const perfumes = getProductsByCategory("perfumes");
  const jewelry = getProductsByCategory("jewelry");

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

      {/* Watches */}
      <section className="container-luxe pb-8">
        <Reveal>
          <SectionHeading
            eyebrow="The Signature Edit"
            title="Bestselling timepieces"
            cta={{ label: "Shop watches", href: "/category/watches" }}
          />
        </Reveal>
        <Reveal className="mt-12" delay={80}>
          <ProductGrid products={watches.slice(0, 4)} />
        </Reveal>
      </section>

      {/* Promo — engraving */}
      <section className="container-luxe py-16 lg:py-20">
        <Reveal>
          <PromoSplit promo={promoBanners[0]} />
        </Reveal>
      </section>

      {/* Perfumes */}
      <section className="bg-cream/60 py-20 lg:py-24">
        <div className="container-luxe">
          <Reveal>
            <SectionHeading
              eyebrow="Just Launched · Grasse, France"
              title="The Perfume Collection"
              subtitle="Six extraits de parfum in weighted glass — worn in whispers, remembered for hours."
              cta={{ label: "Shop perfumes", href: "/category/perfumes" }}
            />
          </Reveal>
          <Reveal className="mt-12" delay={80}>
            <ProductGrid products={perfumes.slice(0, 4)} />
          </Reveal>
        </div>
      </section>

      {/* Jewelry */}
      <section className="container-luxe py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Just Launched · Vicenza, Italy"
            title="The Jewelry Collection"
            subtitle="Recycled gold and sterling essentials, hand-finished and made to be handed down."
            cta={{ label: "Shop jewelry", href: "/category/jewelry" }}
          />
        </Reveal>
        <Reveal className="mt-12" delay={80}>
          <ProductGrid products={jewelry.slice(0, 4)} />
        </Reveal>
      </section>

      <BrandStory />

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
