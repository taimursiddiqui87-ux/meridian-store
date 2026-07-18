import type { Metadata } from "next";
import { Mail, Phone, Clock } from "lucide-react";
import { getSiteConfig } from "@/lib/settings";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactForm } from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team — we're happy to help with orders, products and care.",
};
export const revalidate = 3600;

export default async function ContactPage() {
  const { store } = await getSiteConfig();

  return (
    <div className="container-luxe py-10 lg:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <h1 className="font-serif text-4xl leading-none sm:text-5xl">Get in touch</h1>
          <p className="mt-5 leading-relaxed text-ink-muted text-pretty">
            Questions about an order, a product or aftercare? Our team is here to help and typically
            replies within one business day.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <Mail size={20} className="mt-0.5 text-brass-600" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] uppercase tracking-wider2 text-stone-400">Email</p>
                <a href={`mailto:${store.email}`} className="text-ink link-underline">
                  {store.email}
                </a>
              </div>
            </div>
            {store.phone && (
              <div className="flex items-start gap-4">
                <Phone size={20} className="mt-0.5 text-brass-600" strokeWidth={1.5} />
                <div>
                  <p className="text-[11px] uppercase tracking-wider2 text-stone-400">Phone</p>
                  <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="text-ink link-underline">
                    {store.phone}
                  </a>
                </div>
              </div>
            )}
            <div className="flex items-start gap-4">
              <Clock size={20} className="mt-0.5 text-brass-600" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] uppercase tracking-wider2 text-stone-400">Hours</p>
                <p className="text-ink">Monday – Saturday, 9am – 6pm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-stone-200 p-6 sm:p-8">
          <h2 className="font-serif text-2xl">Send us a message</h2>
          <p className="mt-1 text-sm text-ink-muted">We&apos;ll get back to you by email.</p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
