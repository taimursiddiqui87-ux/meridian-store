"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X, ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { logoutAction } from "@/app/actions/auth";

type NavItem = { label: string; href: string; mega?: boolean; soon?: boolean };

export type NavProduct = { name: string; slug: string; image: string };

const nav: NavItem[] = [
  { label: "Watches", href: "/category/watches", mega: true },
  { label: "Perfumes", href: "/category/perfumes" },
  { label: "Jewelry", href: "/category/jewelry" },
  { label: "Our Story", href: "/about" },
];

export function Header({
  storeName,
  established,
  watchNav,
}: {
  storeName: string;
  established: string;
  watchNav: NavProduct[];
}) {
  const featuredWatch = watchNav[0];
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<{ name?: string | null; email?: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={cn(
        "sticky top-0 z-40 bg-paper/90 backdrop-blur-md transition-shadow duration-300",
        scrolled ? "shadow-soft" : "border-b border-stone-200/70",
      )}
    >
      <div className="container-luxe">
        <div className="flex h-[68px] items-center justify-between gap-4">
          {/* Left — desktop nav / mobile menu button */}
          <div className="flex flex-1 items-center gap-1">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="-ml-2 grid h-10 w-10 place-items-center text-ink lg:hidden"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <nav className="hidden items-center gap-7 lg:flex">
              {nav.map((item) => (
                <div key={item.label} className="group/nav relative">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 py-6 text-[12.5px] font-medium uppercase tracking-wider2 text-ink transition-colors hover:text-brass-600"
                  >
                    {item.label}
                    {item.soon && (
                      <span className="rounded-full bg-brass-100 px-1.5 py-0.5 text-[8px] tracking-wide text-brass-700">
                        SOON
                      </span>
                    )}
                  </Link>

                  {item.mega && (
                    <div className="invisible absolute left-0 top-full z-50 w-[640px] translate-y-2 opacity-0 transition-all duration-300 ease-luxe group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100">
                      <div className="grid grid-cols-[1.2fr_1fr] gap-6 border border-stone-200 bg-paper p-6 shadow-lift">
                        <div>
                          <p className="label-caps mb-4 text-stone-400">Collections</p>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                            {watchNav.map((p) => (
                              <Link
                                key={p.slug}
                                href={`/product/${p.slug}`}
                                className="group/link flex items-center justify-between text-[13.5px] text-ink-soft transition-colors hover:text-brass-600"
                              >
                                {p.name}
                                <ChevronRight
                                  size={13}
                                  className="opacity-0 transition-opacity group-hover/link:opacity-100"
                                />
                              </Link>
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
                          <Link href={`/product/${featuredWatch.slug}`} className="group/feat relative block overflow-hidden bg-cream">
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
              ))}
            </nav>
          </div>

          {/* Center — wordmark */}
          <Link
            href="/"
            className="shrink-0 text-center"
            aria-label={`${storeName} home`}
          >
            <span className="block font-serif text-[26px] font-semibold leading-none tracking-[0.16em] text-ink">
              {storeName}
            </span>
            <span className="mt-0.5 hidden text-[8px] uppercase tracking-luxe text-stone-400 sm:block">
              {established}
            </span>
          </Link>

          {/* Right — actions */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center text-ink transition-colors hover:text-brass-600"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>
            <Link
              href={user ? "/account" : "/account/login"}
              aria-label={user ? "Your account" : "Sign in"}
              className="relative hidden h-10 w-10 place-items-center text-ink transition-colors hover:text-brass-600 sm:grid"
            >
              <User size={19} strokeWidth={1.5} />
              {user && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brass-500 ring-2 ring-paper" />
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label="Open cart"
              className="relative grid h-10 w-10 place-items-center text-ink transition-colors hover:text-brass-600"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brass-500 px-1 text-[10px] font-semibold text-ink">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search dropdown */}
      <div
        className={cn(
          "overflow-hidden border-stone-200 bg-paper transition-all duration-300 ease-luxe",
          searchOpen ? "max-h-32 border-t" : "max-h-0",
        )}
      >
        <form onSubmit={submitSearch} className="container-luxe flex items-center gap-3 py-5">
          <Search size={20} className="text-stone-400" />
          <input
            autoFocus={searchOpen}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search watches, perfumes, jewelry…"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-stone-400"
          />
          <button type="submit" className="text-[12px] font-medium uppercase tracking-wider2 text-brass-600">
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
            "absolute left-0 top-0 h-full w-[84%] max-w-sm bg-paper shadow-lift transition-transform duration-400 ease-luxe",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <span className="font-serif text-xl font-semibold tracking-[0.14em]">{storeName}</span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-ink">
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
                <span className="flex items-center gap-2">
                  {item.label}
                  {item.soon && (
                    <span className="rounded-full bg-brass-100 px-2 py-0.5 text-[9px] uppercase tracking-wider text-brass-700">
                      Soon
                    </span>
                  )}
                </span>
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
