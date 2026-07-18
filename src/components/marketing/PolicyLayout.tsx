import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export interface PolicySection {
  heading: string;
  body: string[]; // each string is a paragraph
}

export function PolicyLayout({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro?: string;
  updated?: string;
  sections: PolicySection[];
}) {
  return (
    <div className="container-luxe py-10 lg:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />

      <div className="mx-auto mt-6 max-w-3xl">
        <h1 className="font-serif text-4xl leading-none sm:text-5xl">{title}</h1>
        {updated && (
          <p className="mt-3 text-[13px] uppercase tracking-wider2 text-stone-400">
            Last updated {updated}
          </p>
        )}
        {intro && <p className="mt-6 text-lg leading-relaxed text-ink-soft text-pretty">{intro}</p>}

        <div className="mt-10 space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-serif text-2xl">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 leading-relaxed text-ink-muted text-pretty">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
