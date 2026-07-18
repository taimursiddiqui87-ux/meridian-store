"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  X,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import type { Banner } from "@prisma/client";
import { cn } from "@/lib/utils";
import { PageHeader, Card, CardHead, Pill } from "@/components/admin/AdminUI";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  saveBanner,
  deleteBanner,
  toggleBanner,
  moveBanner,
  seedDefaultBanners,
  type BannerInput,
} from "@/app/actions/banners";

const emptyBanner: BannerInput = {
  kind: "hero",
  eyebrow: "",
  title: "",
  subtitle: "",
  image: "",
  align: "left",
  theme: "dark",
  badge: "",
  primaryLabel: "",
  primaryHref: "",
  secondaryLabel: "",
  secondaryHref: "",
  active: true,
};

const toInput = (b: Banner): BannerInput => ({
  id: b.id,
  kind: b.kind,
  eyebrow: b.eyebrow ?? "",
  title: b.title,
  subtitle: b.subtitle ?? "",
  image: b.image,
  align: b.align,
  theme: b.theme,
  badge: b.badge ?? "",
  primaryLabel: b.primaryLabel ?? "",
  primaryHref: b.primaryHref ?? "",
  secondaryLabel: b.secondaryLabel ?? "",
  secondaryHref: b.secondaryHref ?? "",
  active: b.active,
});

export function BannersAdmin({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<BannerInput | null>(null);
  const [pending, start] = useTransition();

  const hero = banners.filter((b) => b.kind === "hero");
  const promo = banners.filter((b) => b.kind === "promo");

  const run = (fn: () => Promise<void>) =>
    start(async () => {
      try {
        await fn();
        router.refresh();
      } catch (e) {
        console.error(e);
      }
    });

  if (banners.length === 0) {
    return (
      <div>
        <PageHeader title="Banners & Content" subtitle="Manage the homepage hero carousel and promotions." />
        <Card className="p-12 text-center">
          <ImageIcon size={34} className="mx-auto mb-4 text-stone-300" />
          <p className="font-serif text-2xl">Start managing your banners</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Import your current homepage banners, then add, remove, reorder and swap images — all
            changes go live on the storefront.
          </p>
          <button
            onClick={() => run(seedDefaultBanners)}
            disabled={pending}
            className="btn mt-6 rounded-lg bg-ink px-6 py-3 text-[13px] text-paper hover:bg-ink-soft disabled:opacity-60"
          >
            {pending ? "Importing…" : "Import current banners"}
          </button>
        </Card>
      </div>
    );
  }

  const Row = ({ b, list }: { b: Banner; list: Banner[] }) => {
    const idx = list.findIndex((x) => x.id === b.id);
    return (
      <li className={cn("flex items-center gap-3 px-4 py-3.5", !b.active && "opacity-55")}>
        <div className="flex flex-col text-stone-400">
          <button
            disabled={idx === 0 || pending}
            onClick={() => run(() => moveBanner(b.id, "up"))}
            className="hover:text-ink disabled:opacity-30"
            aria-label="Move up"
          >
            <ArrowUp size={15} />
          </button>
          <button
            disabled={idx === list.length - 1 || pending}
            onClick={() => run(() => moveBanner(b.id, "down"))}
            className="hover:text-ink disabled:opacity-30"
            aria-label="Move down"
          >
            <ArrowDown size={15} />
          </button>
        </div>

        <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded bg-cream">
          {b.image ? (
            <Image src={b.image} alt="" fill sizes="96px" className="object-cover" />
          ) : (
            <span className="grid h-full place-items-center text-stone-300">
              <ImageIcon size={18} />
            </span>
          )}
          {b.badge && (
            <span className="absolute left-1 top-1 rounded bg-brass-500 px-1 text-[8px] font-bold uppercase text-ink">
              {b.badge}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-ink">{b.title}</p>
          <p className="truncate text-[12px] text-stone-400">{b.eyebrow || b.subtitle}</p>
          {b.primaryHref && (
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-brass-600">
              <ExternalLink size={11} /> {b.primaryHref}
            </span>
          )}
        </div>

        <Pill status={b.active ? "Active" : "Draft"} />

        <div className="flex items-center gap-1">
          <button
            onClick={() => run(() => toggleBanner(b.id))}
            disabled={pending}
            className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-ink"
            aria-label={b.active ? "Hide" : "Show"}
          >
            {b.active ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          <button
            onClick={() => setEditing(toInput(b))}
            className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-ink"
            aria-label="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => run(() => deleteBanner(b.id))}
            disabled={pending}
            className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-danger/10 hover:text-danger"
            aria-label="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </li>
    );
  };

  return (
    <div>
      <PageHeader
        title="Banners & Content"
        subtitle={`${hero.length} hero slides · ${promo.length} promos`}
      >
        <button
          onClick={() => setEditing({ ...emptyBanner, kind: "hero" })}
          className="btn rounded-lg bg-ink px-4 py-2.5 text-[13px] text-paper hover:bg-ink-soft"
        >
          <Plus size={15} /> Add hero banner
        </button>
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardHead title="Homepage hero carousel" action={<span className="text-[12px] text-stone-400">Reorder with arrows</span>} />
          {hero.length ? (
            <ul className="divide-y divide-stone-50">
              {hero.map((b) => (
                <Row key={b.id} b={b} list={hero} />
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-stone-400">No hero slides — add one above.</p>
          )}
        </Card>

        <Card>
          <CardHead
            title="Promotional banners"
            action={
              <button
                onClick={() => setEditing({ ...emptyBanner, kind: "promo" })}
                className="flex items-center gap-1 text-[12px] font-medium text-brass-600"
              >
                <Plus size={13} /> Add promo
              </button>
            }
          />
          {promo.length ? (
            <ul className="divide-y divide-stone-50">
              {promo.map((b) => (
                <Row key={b.id} b={b} list={promo} />
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-stone-400">No promo banners yet.</p>
          )}
        </Card>
      </div>

      {editing && (
        <BannerDrawer
          key={editing.id ?? "new"}
          initial={editing}
          pending={pending}
          onClose={() => setEditing(null)}
          onSave={(input) =>
            run(async () => {
              await saveBanner(input);
              setEditing(null);
            })
          }
        />
      )}
    </div>
  );
}

function BannerDrawer({
  initial,
  pending,
  onClose,
  onSave,
}: {
  initial: BannerInput;
  pending: boolean;
  onClose: () => void;
  onSave: (input: BannerInput) => void;
}) {
  const [form, setForm] = useState<BannerInput>(initial);
  const set = (patch: Partial<BannerInput>) => setForm((f) => ({ ...f, ...patch }));
  const isNew = !initial.id;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="font-serif text-2xl">
            {isNew ? "Add" : "Edit"} {form.kind === "promo" ? "promo" : "hero"} banner
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-muted hover:text-ink">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Live preview */}
          <div className="relative aspect-[16/7] overflow-hidden rounded-lg bg-ink">
            {form.image && <Image src={form.image} alt="" fill sizes="480px" className="object-cover opacity-80" />}
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-transparent" />
            <div className={cn("absolute inset-0 flex flex-col justify-center p-5", form.align === "center" && "items-center text-center")}>
              {form.badge && (
                <span className="mb-1.5 inline-block w-fit bg-brass-500 px-2 py-0.5 text-[9px] font-bold uppercase text-ink">
                  {form.badge}
                </span>
              )}
              <p className="text-[9px] uppercase tracking-wider2 text-brass-300">{form.eyebrow || "Eyebrow"}</p>
              <p className="mt-1 font-serif text-xl leading-tight text-paper">{form.title || "Banner title"}</p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="field-label mb-0">Image</label>
              {form.image && (
                <button onClick={() => set({ image: "" })} className="text-[11px] text-danger hover:underline">
                  Remove image
                </button>
              )}
            </div>
            <ImageUploader folder="banners" onUploaded={(url) => set({ image: url })} className="mb-2" />
            <input
              value={form.image}
              onChange={(e) => set({ image: e.target.value })}
              placeholder="…or paste an image URL"
              className="field-input"
            />
            <p className="mt-1 text-[11px] text-stone-400">Upload from your device, or paste any hosted image URL.</p>
          </div>

          <div>
            <label className="field-label">Eyebrow (small label)</label>
            <input value={form.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} placeholder="New Season" className="field-input" />
          </div>
          <div>
            <label className="field-label">Title</label>
            <input value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="Time, beautifully kept" className="field-input" />
          </div>
          <div>
            <label className="field-label">Subtitle</label>
            <textarea value={form.subtitle} onChange={(e) => set({ subtitle: e.target.value })} rows={2} className="field-input resize-none" />
          </div>
          <div>
            <label className="field-label">Sale / promo badge <span className="normal-case text-stone-400">(optional)</span></label>
            <input value={form.badge} onChange={(e) => set({ badge: e.target.value })} placeholder="e.g. Launch Sale · −20%" className="field-input" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Button label</label>
              <input value={form.primaryLabel} onChange={(e) => set({ primaryLabel: e.target.value })} placeholder="Shop Perfumes" className="field-input" />
            </div>
            <div>
              <label className="field-label">Button link</label>
              <input value={form.primaryHref} onChange={(e) => set({ primaryHref: e.target.value })} placeholder="/category/perfumes" className="field-input" />
            </div>
            <div>
              <label className="field-label">2nd button <span className="normal-case text-stone-400">(optional)</span></label>
              <input value={form.secondaryLabel} onChange={(e) => set({ secondaryLabel: e.target.value })} placeholder="Learn more" className="field-input" />
            </div>
            <div>
              <label className="field-label">2nd link</label>
              <input value={form.secondaryHref} onChange={(e) => set({ secondaryHref: e.target.value })} placeholder="/about" className="field-input" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Text alignment</label>
              <div className="flex gap-2">
                {(["left", "center"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => set({ align: a })}
                    className={cn(
                      "flex-1 rounded-lg border py-2.5 text-sm capitalize transition-colors",
                      form.align === a ? "border-ink bg-ink text-paper" : "border-stone-200 hover:border-stone-300",
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">Visibility</label>
              <button
                onClick={() => set({ active: !form.active })}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm transition-colors",
                  form.active ? "border-success/40 bg-success/5 text-success" : "border-stone-200 text-stone-500",
                )}
              >
                {form.active ? <Eye size={15} /> : <EyeOff size={15} />} {form.active ? "Visible" : "Hidden"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-stone-200 p-6">
          <button onClick={onClose} className="btn flex-1 rounded-lg border border-stone-300 py-3 text-[13px] hover:bg-stone-50">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={pending}
            className="btn flex-[2] rounded-lg bg-ink py-3 text-[13px] text-paper hover:bg-ink-soft disabled:opacity-60"
          >
            {pending ? "Saving…" : isNew ? "Create banner" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
