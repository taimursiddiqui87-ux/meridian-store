"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { products as catalog } from "@/lib/data";
import { PageHeader, Card, Pill } from "@/components/admin/AdminUI";

interface Row {
  id: string;
  name: string;
  collection: string;
  sku: string;
  price: number; // dollars
  stock: number;
  status: "Active" | "Draft";
  image: string;
}

const seed: Row[] = catalog.map((p) => ({
  id: p.id,
  name: p.name,
  collection: p.collection,
  sku: p.sku,
  price: Math.round(p.price / 100),
  stock: p.stock,
  status: "Active",
  image: p.images[0],
}));

const empty: Row = {
  id: "",
  name: "",
  collection: "",
  sku: "",
  price: 0,
  stock: 0,
  status: "Active",
  image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80",
};

export function ProductsAdmin() {
  const [rows, setRows] = useState<Row[]>(seed);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => `${r.name} ${r.collection} ${r.sku}`.toLowerCase().includes(q));
  }, [rows, query]);

  const openNew = () => {
    setEditing({ ...empty, id: "new-" + Date.now() });
    setIsNew(true);
  };
  const openEdit = (row: Row) => {
    setEditing(row);
    setIsNew(false);
  };
  const remove = (id: string) => setRows((r) => r.filter((x) => x.id !== id));

  const save = (row: Row) => {
    setRows((prev) => {
      const exists = prev.some((p) => p.id === row.id);
      return exists ? prev.map((p) => (p.id === row.id ? row : p)) : [row, ...prev];
    });
    setEditing(null);
  };

  const totalUnits = rows.reduce((n, r) => n + r.stock, 0);

  return (
    <div>
      <PageHeader title="Products" subtitle={`${rows.length} products · ${totalUnits} units in stock`}>
        <button
          onClick={openNew}
          className="btn rounded-lg bg-ink px-4 py-2.5 text-[13px] text-paper hover:bg-ink-soft"
        >
          <Plus size={15} /> Add product
        </button>
      </PageHeader>

      <Card>
        <div className="flex items-center gap-3 border-b border-stone-100 px-4 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3">
            <Search size={16} className="text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products or SKU…"
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Collection</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Inventory</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded bg-cream">
                        <Image src={r.image} alt="" fill sizes="36px" className="object-cover" />
                      </div>
                      <span className="font-medium text-ink">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-stone-500">{r.sku}</td>
                  <td className="px-5 py-3 text-[13px]">{r.collection}</td>
                  <td className="px-5 py-3 tabular-nums">${r.price.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "tabular-nums",
                        r.stock <= 10 ? "font-semibold text-danger" : "text-ink",
                      )}
                    >
                      {r.stock}
                    </span>
                    <span className="text-stone-400"> in stock</span>
                  </td>
                  <td className="px-5 py-3">
                    <Pill status={r.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(r)}
                        className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-ink"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => remove(r.id)}
                        className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-danger/10 hover:text-danger"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-stone-400">
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
          key={editing.id}
          initial={editing}
          isNew={isNew}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function ProductDrawer({
  initial,
  isNew,
  onClose,
  onSave,
}: {
  initial: Row;
  isNew: boolean;
  onClose: () => void;
  onSave: (r: Row) => void;
}) {
  const [form, setForm] = useState<Row>(initial);
  const set = (patch: Partial<Row>) => setForm((f) => ({ ...f, ...patch }));

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
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-cream">
              <Image src={form.image} alt="" fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex-1">
              <label className="field-label">Image URL</label>
              <input value={form.image} onChange={(e) => set({ image: e.target.value })} className="field-input" />
            </div>
          </div>

          <div>
            <label className="field-label">Product name</label>
            <input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Aera 39" className="field-input" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Collection</label>
              <input value={form.collection} onChange={(e) => set({ collection: e.target.value })} className="field-input" />
            </div>
            <div>
              <label className="field-label">SKU</label>
              <input value={form.sku} onChange={(e) => set({ sku: e.target.value })} placeholder="MER-…" className="field-input" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              {(["Active", "Draft"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => set({ status: s })}
                  className={cn(
                    "flex-1 rounded-lg border py-2.5 text-sm transition-colors",
                    form.status === s ? "border-ink bg-ink text-paper" : "border-stone-200 hover:border-stone-300",
                  )}
                >
                  {s}
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
            className="btn flex-[2] rounded-lg bg-ink py-3 text-[13px] text-paper hover:bg-ink-soft"
          >
            {isNew ? "Create product" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
