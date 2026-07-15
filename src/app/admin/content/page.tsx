import Image from "next/image";
import { Plus, GripVertical, Pencil, Trash2, Eye, Megaphone } from "lucide-react";
import { heroBanners, promoBanners, marqueeItems } from "@/lib/data";
import { PageHeader, Card, CardHead, Pill } from "@/components/admin/AdminUI";

export default function AdminContentPage() {
  return (
    <div>
      <PageHeader
        title="Banners & Content"
        subtitle="Manage the homepage carousel, promotions and announcement bar."
      >
        <button className="btn rounded-lg bg-ink px-4 py-2.5 text-[13px] text-paper hover:bg-ink-soft">
          <Plus size={15} /> Add banner
        </button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Hero carousel */}
          <Card>
            <CardHead
              title={`Hero carousel · ${heroBanners.length} slides`}
              action={<span className="text-[12px] text-stone-400">Drag to reorder</span>}
            />
            <ul className="divide-y divide-stone-50">
              {heroBanners.map((b, i) => (
                <li key={b.id} className="flex items-center gap-4 px-4 py-3.5">
                  <GripVertical size={18} className="shrink-0 cursor-grab text-stone-300" />
                  <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded bg-cream">
                    <Image src={b.image} alt="" fill sizes="96px" className="object-cover" />
                    <span className="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[9px] font-medium text-paper">
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{b.title}</p>
                    <p className="truncate text-[12px] text-stone-400">{b.eyebrow}</p>
                  </div>
                  <Pill status={i === 2 ? "Draft" : "Active"} />
                  <div className="flex items-center gap-1">
                    <button className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-ink">
                      <Pencil size={15} />
                    </button>
                    <button className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-danger/10 hover:text-danger">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Promotions */}
          <Card>
            <CardHead title="Promotional banners" />
            <ul className="divide-y divide-stone-50">
              {promoBanners.map((p) => (
                <li key={p.id} className="flex items-center gap-4 px-4 py-3.5">
                  <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded bg-cream">
                    <Image src={p.image} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{p.title}</p>
                    <p className="truncate text-[12px] text-stone-400">{p.eyebrow}</p>
                  </div>
                  <Pill status="Active" />
                  <button className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-ink">
                    <Pencil size={15} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card>
            <CardHead title="Announcement bar" action={<Megaphone size={15} className="text-brass-600" />} />
            <div className="p-5">
              <p className="mb-3 text-[13px] text-ink-muted">Scrolling messages shown site-wide.</p>
              <ul className="space-y-2">
                {marqueeItems.map((m) => (
                  <li
                    key={m}
                    className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2 text-[13px]"
                  >
                    {m}
                    <button className="text-stone-400 hover:text-danger">
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-stone-300 py-2.5 text-[12px] text-ink-muted hover:border-ink hover:text-ink">
                <Plus size={14} /> Add message
              </button>
            </div>
          </Card>

          <Card>
            <CardHead title="Live preview" action={<Eye size={15} className="text-stone-400" />} />
            <div className="p-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-ink">
                <Image src={heroBanners[0].image} alt="" fill sizes="320px" className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-4">
                  <p className="text-[9px] uppercase tracking-wider text-brass-300">
                    {heroBanners[0].eyebrow}
                  </p>
                  <p className="mt-1 font-serif text-lg leading-tight text-paper">
                    {heroBanners[0].title}
                  </p>
                </div>
              </div>
              <a
                href="/"
                target="_blank"
                className="mt-3 block text-center text-[12px] font-medium uppercase tracking-wider2 text-brass-600"
              >
                Open storefront ↗
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
