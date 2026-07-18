import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import type { HomeSection } from "@/lib/settings";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function HomeProductSection({
  section,
  products,
  className,
}: {
  section: HomeSection;
  products: Product[];
  className?: string;
}) {
  if (!section.visible || products.length === 0) return null;
  return (
    <section className={cn("container-luxe pb-8", className)}>
      <Reveal>
        <SectionHeading
          title={section.title}
          subtitle={section.subtitle}
          cta={
            section.ctaLabel && section.ctaHref
              ? { label: section.ctaLabel, href: section.ctaHref }
              : undefined
          }
        />
      </Reveal>
      <Reveal className="mt-12" delay={80}>
        <ProductGrid products={products.slice(0, 4)} />
      </Reveal>
    </section>
  );
}
