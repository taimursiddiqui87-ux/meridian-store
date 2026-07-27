"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
  DownloadCloud,
  AlertCircle,
  Film,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, Card, Pill } from "@/components/admin/AdminUI";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { saveProduct, deleteProduct, seedCatalog } from "@/app/actions/products";

export interface AdminRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection: string;
  sku: string;
  price: number; // dollars
  compareAt: number; // dollars (0 = none)
  stock: number;
  active: boolean;
  images: string[];
  videoUrl: string;
  badge: string;
}

const CATEGORIES = [
  { value: "watches", label: "Watches" },
  { value: "perfumes", label: "Perfumes" },
  { value: "jewelry", label: "Jewelry" },
];

const emptyRow: AdminRow = {
  id: "",
  slug: "",
  name: "",
  category: "watches",
  collection: "",
  sku: "",
  price: 0,
  compareAt: 0,
  stock: 0,
  active: true,
  images: [],
  videoUrl: "",
  badge: "",
};

export function ProductsAdmin({ initial, persisted }: { initial: AdminRow[]; persisted: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AdminRow | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initial;
    return initial.filter((r) =>
      `${r.name} ${r.collection} ${r.sku} ${r.category}`.toLowerCase().includes(q),
    );
  }, [initial, query]);

  const totalUnits = initial.reduce((n, r) => n + r.stock, 0);

  const openNew = () => {
    setError(null);
    setEditing({ ...emptyRow });
    setIsNew(true);
  };
  const openEdit = (row: AdminRow) => {
    setError(null);
    setEditing(row);
    setIsNew(false);
  };

  const doImport = () =>
    start(async () => {
      const res = await seedCatalog();
      if (!res.ok) setError(res.error ?? "Import failed.");
      else router.refresh();
    });

  const doSave = (row: AdminRow) =>
    start(async () => {
      const res = await saveProduct({
        id: row.id || undefined,
        name: row.name,
        category: row.category,
        collection: row.collection,
        sku: row.sku,
        priceDollars: row.price,
        compareAtDollars: row.compareAt || null,
        stock: row.stock,
        active: row.active,
        images: row.images,
        videoUrl: row.videoUrl || null,
        badge: row.badge || null,
      });
      if (!res.ok) {
        setError(res.error ?? "Save failed.");
      } else {
        setEditing(null);
        router.refresh();
      }
    });

  const doDelete = (id: string) =>
    start(async () => {
      const res = await deleteProduct(id);
      if (!res.ok) setError(res.error ?? "Delete failed.");
      else router.refresh();
    });

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${initial.length} products · ${totalUnits} units in stock`}
      >
        {persisted && (
          <button
            onClick={openNew}
            disabled={pending}
            className="btn rounded-lg bg-ink px-4 py-2.5 text-[13px] text-paper hover:bg-ink-soft disabled:opacity-50"
          >
            <Plus size={15} /> Add product
          </button>
        )}
      </PageHeader>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {!persisted && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-brass-300 bg-brass-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Package size={20} className="mt-0.5 shrink-0 text-brass-600" />
            <div>
              <p className="font-medium text-ink">You&apos;re viewing the built-in demo catalog</p>
              <p className="mt-0.5 text-[13px] text-ink-muted">
                Import it once to start editing, adding and removing products. Everything then
                saves to your store&apos;s database.
              </p>
            </div>
          </div>
          <button
            onClick={doImport}
            disabled={pending}
            className="btn shrink-0 rounded-lg bg-ink px-4 py-2.5 text-[13px] text-paper hover:bg-ink-soft disabled:opacity-50"
          >
            <DownloadCloud size={15} /> {pending ? "Importing…" : "Import demo catalog"}
          </button>
        </div>
      )}

      <Card>
        <div className="flex items-center gap-3 border-b border-stone-100 px-4 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3">
            <Search size={16} className="text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, SKU or category…"
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Inventory</th>
                <th className="px-5 py-3 font-medium">Status</th>
                {persisted && <th className="px-5 py-3 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded bg-cream">
                        {r.images[0] && (
                          <Image src={r.images[0]} alt="" fill sizes="36px" className="object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-ink">
                        {r.name}
                        <span className="ml-2 text-[11px] font-normal text-stone-400">
                          {r.images.length > 1 && `${r.images.length} photos`}
                          {r.videoUrl && (r.images.length > 1 ? " · video" : "video")}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-stone-500">{r.sku}</td>
                  <td className="px-5 py-3 text-[13px] capitalize">{r.category}</td>
                  <td className="px-5 py-3 tabular-nums">${r.price.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn("tabular-nums", r.stock <= 10 ? "font-semibold text-danger" : "text-ink")}
                    >
                      {r.stock}
                    </span>
                    <span className="text-stone-400"> in stock</span>
                  </td>
                  <td className="px-5 py-3">
                    <Pill status={r.active ? "Active" : "Draft"} />
                  </td>
                  {persisted && (
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(r)}
                          disabled={pending}
                          className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-ink disabled:opacity-40"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => doDelete(r.id)}
                          disabled={pending}
                          className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-danger/10 hover:text-danger disabled:opacity-40"
                          aria-label="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={persisted ? 7 : 6} className="px-5 py-16 text-center text-stone-400">
                    <Package size={28} className="mx-auto mb-3 opacity-40" />
                    No products match “{query}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && (
        <ProductDrawer
          key={editing.id || "new"}
          initial={editing}
          isNew={isNew}
          pending={pending}
          onClose={() => setEditing(null)}
          onSave={doSave}
        />
      )}
    </div>
  );
}

function ProductDrawer({
  initial,
  isNew,
  pending,
  onClose,
  onSave,
}: {
  initial: AdminRow;
  isNew: boolean;
  pending: boolean;
  onClose: () => void;
  onSave: (r: AdminRow) => void;
}) {
  const [form, setForm] = useState<AdminRow>(initial);
  const [imageUrl, setImageUrl] = useState("");
  const set = (patch: Partial<AdminRow>) => setForm((f) => ({ ...f, ...patch }));

  const addImage = (url: string) =>
    setForm((f) => (f.images.length >= 8 ? f : { ...f, images: [...f.images, url.trim()] }));
  const removeImage = (i: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }));
  const moveImage = (i: number, dir: number) =>
    setForm((f) => {
      const next = [...f.images];
      const j = i + dir;
      if (j < 0 || j >= next.length) return f;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...f, images: next };
    });

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="font-serif text-2xl">{isNew ? "Add product" : "Edit product"}</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-muted hover:text-ink">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Gallery — multiple photos, first one is the main image */}
          <div>
            <label className="field-label">
              Photos
              <span className="ml-2 normal-case text-stone-400">
                {form.images.length}/8 · first photo is the main image
              </span>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {form.images.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="group/img relative aspect-[4/5] overflow-hidden rounded-lg bg-cream ring-1 ring-stone-200"
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-ink/85 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-paper">
                      Main
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-0.5 bg-ink/70 p-1 opacity-0 transition-opacity group-hover/img:opacity-100">
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      aria-label="Move left"
                      className="grid h-5 w-5 place-items-center rounded text-paper hover:bg-white/20 disabled:opacity-30"
                    >
                      <ArrowLeft size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label="Remove photo"
                      className="grid h-5 w-5 place-items-center rounded text-paper hover:bg-danger"
                    >
                      <Trash2 size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      disabled={i === form.images.length - 1}
                      aria-label="Move right"
                      className="grid h-5 w-5 place-items-center rounded text-paper hover:bg-white/20 disabled:opacity-30"
                    >
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
              {form.images.length === 0 && (
                <div className="col-span-4 grid h-20 place-items-center rounded-lg border border-dashed border-stone-300 text-[12px] text-stone-400">
                  No photos yet
                </div>
              )}
            </div>

            {form.images.length < 8 && (
              <>
                <ImageUploader
                  folder="products"
                  label="Add photo from your device"
                  onUploaded={(url) => addImage(url)}
                  className="mt-3"
                />
                <div className="mt-2 flex gap-2">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (imageUrl.trim()) {
                          addImage(imageUrl);
                          setImageUrl("");
                        }
                      }
                    }}
                    placeholder="…or paste an image URL"
                    className="field-input flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageUrl.trim()) {
                        addImage(imageUrl);
                        setImageUrl("");
                      }
                    }}
                    className="btn rounded-lg border border-stone-300 px-4 text-[12px] uppercase tracking-wider2 hover:border-ink"
                  >
                    Add
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Video */}
          <div>
            <label className="field-label">Product video (optional)</label>
            {form.videoUrl ? (
              <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
                <Film size={18} className="shrink-0 text-brass-600" />
                <span className="min-w-0 flex-1 truncate text-[12px] text-ink-muted">
                  {form.videoUrl.split("/").pop()}
                </span>
                <button
                  type="button"
                  onClick={() => set({ videoUrl: "" })}
                  aria-label="Remove video"
                  className="grid h-7 w-7 place-items-center rounded text-stone-500 hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <>
                <ImageUploader
                  folder="product-videos"
                  kind="video"
                  onUploaded={(url) => set({ videoUrl: url })}
                />
                <input
                  value={form.videoUrl}
                  onChange={(e) => set({ videoUrl: e.target.value })}
                  placeholder="…or paste an MP4 URL"
                  className="field-input mt-2"
                />
              </>
            )}
            <p className="mt-1.5 text-[11px] text-stone-400">
              MP4 or WebM, up to 100 MB. Shown first in the product gallery.
            </p>
          </div>

          <div>
            <label className="field-label">Product name</label>
            <input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Aera 39" className="field-input" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Category</label>
              <select
                value={form.category}
                onChange={(e) => set({ category: e.target.value })}
                className="field-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Collection</label>
              <input value={form.collection} onChange={(e) => set({ collection: e.target.value })} placeholder="e.g. Aera" className="field-input" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">SKU</label>
              <input value={form.sku} onChange={(e) => set({ sku: e.target.value })} placeholder="MER-…" className="field-input" />
            </div>
            <div>
              <label className="field-label">Badge (optional)</label>
              <input value={form.badge} onChange={(e) => set({ badge: e.target.value })} placeholder="e.g. Sale, New" className="field-input" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="field-label">Price (USD)</label>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) => set({ price: Number(e.target.value) })}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Compare-at</label>
              <input
                type="number"
                value={form.compareAt || ""}
                onChange={(e) => set({ compareAt: Number(e.target.value) })}
                placeholder="0"
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Stock</label>
              <input
                type="number"
                value={form.stock || ""}
                onChange={(e) => set({ stock: Number(e.target.value) })}
                className="field-input"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Status</label>
            <div className="flex gap-2">
              {[
                { label: "Active", val: true },
                { label: "Draft", val: false },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => set({ active: s.val })}
                  className={cn(
                    "flex-1 rounded-lg border py-2.5 text-sm transition-colors",
                    form.active === s.val ? "border-ink bg-ink text-paper" : "border-stone-200 hover:border-stone-300",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-stone-200 p-6">
          <button onClick={onClose} className="btn flex-1 rounded-lg border border-stone-300 py-3 text-[13px] hover:bg-stone-50">
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...form, name: form.name || "Untitled", sku: form.sku || "MER-NEW" })}
            disabled={pending}
            className="btn flex-[2] rounded-lg bg-ink py-3 text-[13px] text-paper hover:bg-ink-soft disabled:opacity-50"
          >
            {pending ? "Saving…" : isNew ? "Create product" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
