"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X, ChevronRight, LogOut, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { logoutAction } from "@/app/actions/auth";
import { CurrencySelect } from "./CurrencySelect";

type NavItem = { label: string; href: string; mega?: boolean };

export type NavProduct = { name: string; slug: string; image: string; collection: string };

const WATCH_GROUPS = ["Men", "Women", "Sport"] as const;

const nav: NavItem[] = [
  { label: "Watches", href: "/category/watches", mega: true },
  { label: "Perfumes", href: "/category/perfumes" },
  { label: "Jewelry", href: "/category/jewelry" },
  { label: "Shop All", href: "/shop" },
  { label: "Our Story", href: "/about" },
  { label: "Track Order", href: "/account/orders" },
];

export function Header({
  storeName,
  established,
  tagline,
  watchNav,
}: {
  storeName: string;
  established: string;
  tagline: string;
  watchNav: NavProduct[];
}) {
  const featuredWatch = watchNav[0];
  const watchGroups = WATCH_GROUPS.map((g) => ({
    label: g,
    items: watchNav.filter((p) => p.collection === g),
  })).filter((g) => g.items.length > 0);
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<{ name?: string | null; email?: string } | null>(null);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    let active = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        if (active) setUser(d.user);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-ink text-paper shadow-soft">
      {/* Main bar — search / big centered wordmark / currency + account + cart */}
      <div className="container-luxe">
        <div className="relative flex h-[74px] items-center justify-between gap-3 lg:h-[86px]">
          {/* Left */}
          <div className="flex flex-1 items-center gap-1">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="-ml-2 grid h-11 w-11 place-items-center text-paper lg:hidden"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="hidden h-11 items-center gap-2.5 text-paper/80 transition-colors hover:text-brass-300 lg:flex"
            >
              <Search size={19} strokeWidth={1.5} />
              <span className="text-[12px] uppercase tracking-wider2">Search</span>
            </button>
          </div>

          {/* Center — prominent gold wordmark (matches the ZAMIRA logo lockup) */}
          <Link href="/" className="shrink-0 text-center" aria-label={`${storeName} home`}>
            <span className="block bg-gradient-to-b from-[#F0E3BC] via-brass-400 to-brass-700 bg-clip-text font-serif text-[30px] font-semibold leading-none tracking-[0.2em] text-transparent sm:text-[34px] lg:text-[38px]">
              {storeName}
            </span>
            <span className="mt-1.5 block text-[7px] uppercase tracking-[0.3em] text-paper/70 sm:text-[8px]">
              {tagline}
              <span className="hidden text-brass-300/90 lg:inline"> · {established}</span>
            </span>
          </Link>

          {/* Right */}
          <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1.5">
            <CurrencySelect />
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="grid h-11 w-11 place-items-center text-paper transition-colors hover:text-brass-300 lg:hidden"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>
            <Link
              href={user ? "/account" : "/account/login"}
              aria-label={user ? "Your account" : "Sign in"}
              className="relative hidden h-11 w-11 place-items-center text-paper transition-colors hover:text-brass-300 sm:grid"
            >
              <User size={19} strokeWidth={1.5} />
              {user && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brass-400 ring-2 ring-ink" />
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label="Open cart"
              className="relative grid h-11 w-11 place-items-center text-paper transition-colors hover:text-brass-300"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brass-400 px-1 text-[10px] font-bold text-ink">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Nav row (desktop) */}
      <nav className="hidden border-t border-white/10 lg:block">
        <div className="container-luxe flex items-center justify-center gap-9">
          {nav.map((item) => {
            const active =
              item.href !== "/" && pathname?.startsWith(item.href) && item.href !== "/account/orders";
            return (
              <div key={item.label} className="group/nav relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 py-4 text-[12px] font-semibold uppercase tracking-wider2 transition-colors",
                    active ? "text-brass-300" : "text-paper/85 hover:text-brass-300",
                  )}
                >
                  {item.label}
                </Link>
                {active && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-brass-400" />}

                {item.mega && (
                  <div className="invisible absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-300 ease-luxe group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100">
                    <div className="grid grid-cols-[2fr_1fr] gap-6 rounded-b-2xl border border-stone-200 bg-paper p-6 text-ink shadow-lift">
                      <div>
                        <div className="grid grid-cols-3 gap-6">
                          {watchGroups.map((g) => (
                            <div key={g.label}>
                              <Link
                                href={`/category/watches?c=${g.label}`}
                                className="label-caps mb-3 block text-brass-600 hover:text-brass-700"
                              >
                                {g.label === "Sport" ? "Sport" : `${g.label}'s`} Watches
                              </Link>
                              <div className="space-y-2">
                                {g.items.map((p) => (
                                  <Link
                                    key={p.slug}
                                    href={`/product/${p.slug}`}
                                    className="group/link flex items-center justify-between text-[13px] text-ink-soft transition-colors hover:text-brass-600"
                                  >
                                    {p.name}
                                    <ChevronRight
                                      size={12}
                                      className="opacity-0 transition-opacity group-hover/link:opacity-100"
                                    />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Link
                          href="/category/watches"
                          className="mt-5 inline-block text-[12px] font-medium uppercase tracking-wider2 text-brass-600 link-underline"
                        >
                          View all watches
                        </Link>
                      </div>
                      {featuredWatch && (
                        <Link
                          href={`/product/${featuredWatch.slug}`}
                          className="group/feat relative block overflow-hidden rounded-xl bg-cream"
                        >
                          <Image
                            src={featuredWatch.image}
                            alt={featuredWatch.name}
                            width={320}
                            height={360}
                            className="h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover/feat:scale-105"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4">
                            <p className="text-[10px] uppercase tracking-wider2 text-brass-300">
                              Bestseller
                            </p>
                            <p className="font-serif text-lg text-paper">{featuredWatch.name}</p>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Search dropdown */}
      <div
        className={cn(
          "overflow-hidden border-white/10 bg-ink-soft transition-all duration-300 ease-luxe",
          searchOpen ? "max-h-32 border-t" : "max-h-0",
        )}
      >
        <form onSubmit={submitSearch} className="container-luxe flex items-center gap-3 py-5">
          <Search size={20} className="text-paper/50" />
          <input
            autoFocus={searchOpen}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search watches, perfumes, jewelry…"
            className="flex-1 bg-transparent text-base text-paper outline-none placeholder:text-paper/40"
          />
          <button type="submit" className="text-[12px] font-semibold uppercase tracking-wider2 text-brass-300">
            Search
          </button>
        </form>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[84%] max-w-sm bg-paper text-ink shadow-lift transition-transform duration-400 ease-luxe",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-stone-200 bg-ink px-5 py-5 text-paper">
            <span className="font-serif text-2xl font-semibold tracking-[0.16em]">{storeName}</span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-paper">
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-col px-5 py-2">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between border-b border-stone-100 py-4 font-serif text-2xl text-ink"
              >
                {item.label}
                <ChevronRight size={18} className="text-stone-300" />
              </Link>
            ))}
          </nav>
          <div className="px-5 py-4">
            {user ? (
              <div className="space-y-1">
                <p className="px-1 pb-2 text-[13px] text-ink-muted">
                  Signed in as <span className="font-medium text-ink">{user.name || user.email}</span>
                </p>
                <Link
                  href="/account"
                  className="flex items-center gap-3 py-3 text-sm uppercase tracking-wider2 text-ink-muted"
                >
                  <User size={18} /> My account
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 py-3 text-sm uppercase tracking-wider2 text-ink-muted"
                >
                  <Package size={18} /> Track order
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 py-3 text-left text-sm uppercase tracking-wider2 text-ink-muted"
                  >
                    <LogOut size={18} /> Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/account/login"
                className="flex items-center gap-3 py-3 text-sm uppercase tracking-wider2 text-ink-muted"
              >
                <User size={18} /> Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
