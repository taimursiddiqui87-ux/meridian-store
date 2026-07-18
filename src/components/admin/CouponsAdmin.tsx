"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Ticket, AlertCircle } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { PageHeader, Card, Pill } from "@/components/admin/AdminUI";
import { saveCoupon, deleteCoupon } from "@/app/actions/coupons";

export interface CouponRow {
  id: string;
  code: string;
  type: string; // percent | fixed
  value: number; // percent, or cents for fixed
  active: boolean;
  minSubtotal: number; // cents
  expiresAt: string; // yyyy-mm-dd or ""
}

interface Draft {
  id?: string;
  code: string;
  type: "percent" | "fixed";
  value: number; // percent or dollars (fixed)
  minDollars: number;
  active: boolean;
  expiresAt: string;
}

const emptyDraft: Draft = {
  code: "",
  type: "percent",
  value: 10,
  minDollars: 0,
  active: true,
  expiresAt: "",
};

function toDraft(r: CouponRow): Draft {
  return {
    id: r.id,
    code: r.code,
    type: r.type === "fixed" ? "fixed" : "percent",
    value: r.type === "fixed" ? Math.round(r.value / 100) : r.value,
    minDollars: r.minSubtotal ? Math.round(r.minSubtotal / 100) : 0,
    active: r.active,
    expiresAt: r.expiresAt,
  };
}

const describe = (r: CouponRow) =>
  r.type === "fixed" ? `${formatPrice(r.value)} off` : `${r.value}% off`;

export function CouponsAdmin({ initial }: { initial: CouponRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const doSave = (d: Draft) =>
    start(async () => {
      setError(null);
      const res = await saveCoupon({
        id: d.id,
        code: d.code,
        type: d.type,
        value: d.value,
        active: d.active,
        minSubtotalDollars: d.minDollars,
        expiresAt: d.expiresAt || null,
      });
      if (!res.ok) setError(res.error ?? "Save failed.");
      else {
        setEditing(null);
        router.refresh();
      }
    });

  const doDelete = (id: string) =>
    start(async () => {
      setError(null);
      const res = await deleteCoupon(id);
      if (!res.ok) setError(res.error ?? "Delete failed.");
      else router.refresh();
    });

  return (
    <div>
      <PageHeader title="Discounts" subtitle={`${initial.length} promo code${initial.length === 1 ? "" : "s"}`}>
        <button
          onClick={() => {
            setError(null);
            setEditing({ ...emptyDraft });
          }}
          disabled={pending}
          className="btn rounded-lg bg-ink px-4 py-2.5 text-[13px] text-paper hover:bg-ink-soft disabled:opacity-50"
        >
          <Plus size={15} /> New code
        </button>
      </PageHeader>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <Card>
        {initial.length === 0 ? (
          <div className="grid place-items-center py-20 text-center">
            <div>
              <Ticket size={30} className="mx-auto mb-3 text-stone-300" />
              <p className="font-serif text-2xl">No promo codes yet</p>
              <p className="mt-1 text-sm text-ink-muted">
                Create a code to run a launch sale or reward customers.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Discount</th>
                  <th className="px-5 py-3 font-medium">Min. order</th>
                  <th className="px-5 py-3 font-medium">Expires</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {initial.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/60">
                    <td className="px-5 py-3.5 font-medium tracking-wide text-ink">{r.code}</td>
                    <td className="px-5 py-3.5">{describe(r)}</td>
                    <td className="px-5 py-3.5 tabular-nums text-stone-500">
                      {r.minSubtotal ? formatPrice(r.minSubtotal) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-stone-500">{r.expiresAt || "Never"}</td>
                    <td className="px-5 py-3.5">
                      <Pill status={r.active ? "Active" : "Draft"} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setError(null);
                            setEditing(toDraft(r));
                          }}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing && (
        <CouponDrawer
          key={editing.id || "new"}
          initial={editing}
          pending={pending}
          onClose={() => setEditing(null)}
          onSave={doSave}
        />
      )}
    </div>
  );
}

function CouponDrawer({
  initial,
  pending,
  onClose,
  onSave,
}: {
  initial: Draft;
  pending: boolean;
  onClose: () => void;
  onSave: (d: Draft) => void;
}) {
  const [form, setForm] = useState<Draft>(initial);
  const set = (patch: Partial<Draft>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="font-serif text-2xl">{initial.id ? "Edit code" : "New promo code"}</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-muted hover:text-ink">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div>
            <label className="field-label">Code</label>
            <input
              value={form.code}
              onChange={(e) => set({ code: e.target.value.toUpperCase() })}
              placeholder="LAUNCH10"
              className="field-input uppercase tracking-wide"
            />
          </div>

          <div>
            <label className="field-label">Discount type</label>
            <div className="flex gap-2">
              {[
                { label: "Percent (%)", val: "percent" as const },
                { label: "Fixed ($)", val: "fixed" as const },
              ].map((t) => (
                <button
                  key={t.val}
                  onClick={() => set({ type: t.val })}
                  className={cn(
                    "flex-1 rounded-lg border py-2.5 text-sm transition-colors",
                    form.type === t.val ? "border-ink bg-ink text-paper" : "border-stone-200 hover:border-stone-300",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">{form.type === "percent" ? "Percent off" : "Amount off ($)"}</label>
              <input
                type="number"
                min={1}
                value={form.value || ""}
                onChange={(e) => set({ value: Number(e.target.value) })}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Min. order ($)</label>
              <input
                type="number"
                min={0}
                value={form.minDollars || ""}
                onChange={(e) => set({ minDollars: Number(e.target.value) })}
                placeholder="0"
                className="field-input"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Expires (optional)</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => set({ expiresAt: e.target.value })}
              className="field-input"
            />
          </div>

          <div>
            <label className="field-label">Status</label>
            <div className="flex gap-2">
              {[
                { label: "Active", val: true },
                { label: "Disabled", val: false },
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
            onClick={() => onSave(form)}
            disabled={pending || !form.code.trim()}
            className="btn flex-[2] rounded-lg bg-ink py-3 text-[13px] text-paper hover:bg-ink-soft disabled:opacity-50"
          >
            {pending ? "Saving…" : initial.id ? "Save changes" : "Create code"}
          </button>
        </div>
      </div>
    </div>
  );
}
