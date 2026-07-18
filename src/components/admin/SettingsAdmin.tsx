"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Store, LayoutGrid, FileText, Megaphone, Check, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, Card, CardHead } from "@/components/admin/AdminUI";
import type { SiteConfig, HomeSection } from "@/lib/settings";
import {
  saveStoreProfile,
  saveHomepage,
  saveAbout,
  saveAnnouncements,
} from "@/app/actions/settings";

type CatalogItem = { slug: string; name: string; category: string; image: string };

const tabs = [
  { id: "store", label: "Store profile", icon: Store },
  { id: "home", label: "Homepage", icon: LayoutGrid },
  { id: "about", label: "About page", icon: FileText },
  { id: "announce", label: "Announcements", icon: Megaphone },
] as const;

const homeSectionKeys: { key: keyof SiteConfig["home"]; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "bestsellers", label: "Bestsellers" },
  { key: "newArrivals", label: "New Arrivals" },
];

export function SettingsAdmin({
  config,
  catalog,
}: {
  config: SiteConfig;
  catalog: CatalogItem[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("store");
  const [cfg, setCfg] = useState<SiteConfig>(config);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState<string | null>(null);

  const run = (label: string, fn: () => Promise<void>) =>
    start(async () => {
      try {
        await fn();
        setSaved(label);
        router.refresh();
      } catch (e) {
        console.error(e);
      }
    });

  const SaveButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <div className="flex items-center gap-3">
      {saved === label && !pending && (
        <span className="flex items-center gap-1 text-[12px] text-success">
          <Check size={14} /> Saved
        </span>
      )}
      <button
        onClick={onClick}
        disabled={pending}
        className="btn rounded-lg bg-ink px-5 py-2.5 text-[13px] text-paper hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </div>
  );

  return (
    <div>
      <PageHeader title="Settings" subtitle="Customise your store — changes go live instantly.">
        <a href="/" target="_blank" className="btn rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-[13px] hover:bg-stone-50">
          View store ↗
        </a>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside>
          <Card className="p-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setSaved(null);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] transition-colors",
                  tab === t.id ? "bg-ink text-paper" : "text-ink-soft hover:bg-stone-100",
                )}
              >
                <t.icon size={16} strokeWidth={1.7} /> {t.label}
              </button>
            ))}
          </Card>
        </aside>

        <div className="space-y-6">
          {/* STORE PROFILE */}
          {tab === "store" && (
            <Card>
              <CardHead title="Store profile" />
              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <Field label="Store name">
                  <input className="field-input" value={cfg.store.name} onChange={(e) => setStore("name", e.target.value)} />
                </Field>
                <Field label="Tagline">
                  <input className="field-input" value={cfg.store.tagline} onChange={(e) => setStore("tagline", e.target.value)} />
                </Field>
                <Field label="Established (e.g. Est. 2019)">
                  <input className="field-input" value={cfg.store.established} onChange={(e) => setStore("established", e.target.value)} />
                </Field>
                <Field label="Support email">
                  <input className="field-input" value={cfg.store.email} onChange={(e) => setStore("email", e.target.value)} />
                </Field>
                <Field label="Phone">
                  <input className="field-input" value={cfg.store.phone} onChange={(e) => setStore("phone", e.target.value)} />
                </Field>
                <div />
                <Field label="Instagram URL">
                  <input className="field-input" value={cfg.store.instagram} onChange={(e) => setStore("instagram", e.target.value)} />
                </Field>
                <Field label="Facebook URL">
                  <input className="field-input" value={cfg.store.facebook} onChange={(e) => setStore("facebook", e.target.value)} />
                </Field>
                <Field label="YouTube URL">
                  <input className="field-input" value={cfg.store.youtube} onChange={(e) => setStore("youtube", e.target.value)} />
                </Field>
                <Field label="Twitter / X URL">
                  <input className="field-input" value={cfg.store.twitter} onChange={(e) => setStore("twitter", e.target.value)} />
                </Field>
              </div>
              <div className="flex justify-end border-t border-stone-100 px-5 py-4">
                <SaveButton label="store" onClick={() => run("store", () => saveStoreProfile(cfg.store))} />
              </div>
            </Card>
          )}

          {/* HOMEPAGE */}
          {tab === "home" && (
            <>
              {homeSectionKeys.map(({ key, label }) => (
                <Card key={key}>
                  <CardHead
                    title={`Homepage · ${label}`}
                    action={
                      <button
                        onClick={() => setSection(key, { visible: !cfg.home[key].visible })}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
                          cfg.home[key].visible ? "bg-success/10 text-success" : "bg-stone-100 text-stone-500",
                        )}
                      >
                        {cfg.home[key].visible ? <Eye size={13} /> : <EyeOff size={13} />}
                        {cfg.home[key].visible ? "Shown" : "Hidden"}
                      </button>
                    }
                  />
                  <div className="space-y-4 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Section title">
                        <input className="field-input" value={cfg.home[key].title} onChange={(e) => setSection(key, { title: e.target.value })} />
                      </Field>
                      <Field label="Subtitle">
                        <input className="field-input" value={cfg.home[key].subtitle} onChange={(e) => setSection(key, { subtitle: e.target.value })} />
                      </Field>
                      <Field label="Button label">
                        <input className="field-input" value={cfg.home[key].ctaLabel} onChange={(e) => setSection(key, { ctaLabel: e.target.value })} />
                      </Field>
                      <Field label="Button link">
                        <input className="field-input" value={cfg.home[key].ctaHref} onChange={(e) => setSection(key, { ctaHref: e.target.value })} />
                      </Field>
                    </div>
                    <div>
                      <p className="field-label">
                        Products in this section
                        <span className="ml-2 normal-case text-stone-400">{cfg.home[key].productSlugs.length} selected · shown in the order you pick</span>
                      </p>
                      <ProductPicker
                        catalog={catalog}
                        selected={cfg.home[key].productSlugs}
                        onToggle={(slug) => toggleProduct(key, slug)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-stone-100 px-5 py-4">
                    <SaveButton label="home" onClick={() => run("home", () => saveHomepage(cfg.home))} />
                  </div>
                </Card>
              ))}
            </>
          )}

          {/* ABOUT */}
          {tab === "about" && (
            <Card>
              <CardHead title="About page" />
              <div className="space-y-5 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Hero eyebrow"><input className="field-input" value={cfg.about.heroEyebrow} onChange={(e) => setAbout("heroEyebrow", e.target.value)} /></Field>
                  <Field label="Hero title"><input className="field-input" value={cfg.about.heroTitle} onChange={(e) => setAbout("heroTitle", e.target.value)} /></Field>
                </div>
                <Field label="Intro paragraph"><textarea rows={3} className="field-input resize-none" value={cfg.about.intro} onChange={(e) => setAbout("intro", e.target.value)} /></Field>

                <div>
                  <p className="field-label">Values (3)</p>
                  <div className="space-y-3">
                    {cfg.about.values.map((v, i) => (
                      <div key={i} className="grid gap-2 border border-stone-200 p-3 sm:grid-cols-[1fr_2fr]">
                        <input className="field-input" placeholder="Title" value={v.title} onChange={(e) => setValue(i, "title", e.target.value)} />
                        <input className="field-input" placeholder="Description" value={v.body} onChange={(e) => setValue(i, "body", e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="field-label">Stats (4)</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {cfg.about.stats.map((s, i) => (
                      <div key={i} className="grid grid-cols-2 gap-2 border border-stone-200 p-3">
                        <input className="field-input" placeholder="Value" value={s.value} onChange={(e) => setStat(i, "value", e.target.value)} />
                        <input className="field-input" placeholder="Label" value={s.label} onChange={(e) => setStat(i, "label", e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Story eyebrow"><input className="field-input" value={cfg.about.storyEyebrow} onChange={(e) => setAbout("storyEyebrow", e.target.value)} /></Field>
                  <Field label="Story title"><input className="field-input" value={cfg.about.storyTitle} onChange={(e) => setAbout("storyTitle", e.target.value)} /></Field>
                </div>
                <Field label="Story body"><textarea rows={3} className="field-input resize-none" value={cfg.about.storyBody} onChange={(e) => setAbout("storyBody", e.target.value)} /></Field>
              </div>
              <div className="flex justify-end border-t border-stone-100 px-5 py-4">
                <SaveButton label="about" onClick={() => run("about", () => saveAbout(cfg.about))} />
              </div>
            </Card>
          )}

          {/* ANNOUNCEMENTS */}
          {tab === "announce" && (
            <Card>
              <CardHead title="Announcement bar" />
              <div className="space-y-3 p-5">
                <p className="text-[13px] text-ink-muted">Scrolling messages shown across the top of the store.</p>
                {cfg.announcements.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className="field-input flex-1"
                      value={a}
                      onChange={(e) => {
                        const next = [...cfg.announcements];
                        next[i] = e.target.value;
                        setCfg({ ...cfg, announcements: next });
                        setSaved(null);
                      }}
                    />
                    <button
                      onClick={() => setCfg({ ...cfg, announcements: cfg.announcements.filter((_, j) => j !== i) })}
                      className="grid h-9 w-9 place-items-center rounded-md text-stone-400 hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setCfg({ ...cfg, announcements: [...cfg.announcements, "New announcement"] })}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-stone-300 px-4 py-2.5 text-[12px] text-ink-muted hover:border-ink hover:text-ink"
                >
                  <Plus size={14} /> Add message
                </button>
              </div>
              <div className="flex justify-end border-t border-stone-100 px-5 py-4">
                <SaveButton label="announce" onClick={() => run("announce", () => saveAnnouncements(cfg.announcements))} />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  // ---- state helpers ----
  function setStore<K extends keyof SiteConfig["store"]>(k: K, v: SiteConfig["store"][K]) {
    setCfg({ ...cfg, store: { ...cfg.store, [k]: v } });
    setSaved(null);
  }
  function setAbout<K extends keyof SiteConfig["about"]>(k: K, v: SiteConfig["about"][K]) {
    setCfg({ ...cfg, about: { ...cfg.about, [k]: v } });
    setSaved(null);
  }
  function setValue(i: number, k: "title" | "body", v: string) {
    const values = cfg.about.values.map((x, j) => (j === i ? { ...x, [k]: v } : x));
    setCfg({ ...cfg, about: { ...cfg.about, values } });
    setSaved(null);
  }
  function setStat(i: number, k: "value" | "label", v: string) {
    const stats = cfg.about.stats.map((x, j) => (j === i ? { ...x, [k]: v } : x));
    setCfg({ ...cfg, about: { ...cfg.about, stats } });
    setSaved(null);
  }
  function setSection(key: keyof SiteConfig["home"], patch: Partial<HomeSection>) {
    setCfg({ ...cfg, home: { ...cfg.home, [key]: { ...cfg.home[key], ...patch } } });
    setSaved(null);
  }
  function toggleProduct(key: keyof SiteConfig["home"], slug: string) {
    const cur = cfg.home[key].productSlugs;
    const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
    setSection(key, { productSlugs: next });
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

function ProductPicker({
  catalog,
  selected,
  onToggle,
}: {
  catalog: CatalogItem[];
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="mt-1 max-h-72 overflow-y-auto rounded-lg border border-stone-200">
      {catalog.map((p) => {
        const on = selected.includes(p.slug);
        return (
          <button
            key={p.slug}
            onClick={() => onToggle(p.slug)}
            className={cn(
              "flex w-full items-center gap-3 border-b border-stone-50 px-3 py-2 text-left transition-colors last:border-0",
              on ? "bg-brass-50" : "hover:bg-stone-50",
            )}
          >
            <span className={cn("grid h-[18px] w-[18px] shrink-0 place-items-center border", on ? "border-ink bg-ink text-paper" : "border-stone-300")}>
              {on && <Check size={12} strokeWidth={3} />}
            </span>
            <span className="relative h-9 w-8 shrink-0 overflow-hidden rounded bg-cream">
              <Image src={p.image} alt="" fill sizes="32px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] text-ink">{p.name}</span>
              <span className="block text-[11px] capitalize text-stone-400">{p.category}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
