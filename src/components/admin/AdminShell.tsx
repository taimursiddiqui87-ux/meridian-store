"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Truck,
  Users,
  LayoutTemplate,
  Ticket,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  ExternalLink,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminLogoutAction } from "@/app/actions/admin-auth";

type NavItem = { label: string; href: string; icon: LucideIcon; exact?: boolean };

const nav: { section: string; items: NavItem[] }[] = [
  {
    section: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true }],
  },
  {
    section: "Commerce",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Discounts", href: "/admin/discounts", icon: Ticket },
      { label: "Deliveries", href: "/admin/deliveries", icon: Truck },
      { label: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    section: "Storefront",
    items: [
      { label: "Banners & Content", href: "/admin/content", icon: LayoutTemplate },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function SidebarContent({
  pathname,
  onNavigate,
  username,
  initials,
}: {
  pathname: string;
  onNavigate?: () => void;
  username: string;
  initials: string;
}) {
  return (
    <div className="flex h-full flex-col bg-ink text-paper">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <span className="font-serif text-xl font-semibold tracking-[0.14em]">MERIDIAN</span>
        <span className="rounded bg-brass-500/20 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-brass-300">
          Admin
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {nav.map((group) => (
          <div key={group.section} className="mb-6">
            <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-wider2 text-paper/35">
              {group.section}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors",
                        active ? "bg-white/10 text-paper" : "text-paper/60 hover:bg-white/5 hover:text-paper",
                      )}
                    >
                      <item.icon size={17} strokeWidth={1.7} />
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-paper/60 transition-colors hover:bg-white/5 hover:text-paper"
        >
          <ExternalLink size={16} /> View storefront
        </Link>
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-paper/60 transition-colors hover:bg-white/5 hover:text-paper"
          >
            <LogOut size={16} /> Sign out
          </button>
        </form>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brass-500 text-[13px] font-semibold text-ink">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{username}</p>
            <p className="truncate text-[11px] text-paper/40">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: { username: string };
}) {
  const pathname = usePathname() ?? "/admin";
  const [mobileOpen, setMobileOpen] = useState(false);

  const username = admin.username;
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent pathname={pathname} username={username} initials={initials} />
      </aside>

      <div className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "" : "pointer-events-none")}>
        <div
          onClick={() => setMobileOpen(false)}
          className={cn("absolute inset-0 bg-ink/50 transition-opacity", mobileOpen ? "opacity-100" : "opacity-0")}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-64 transition-transform duration-300 ease-luxe",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <SidebarContent
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
            username={username}
            initials={initials}
          />
        </div>
      </div>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-stone-200 bg-[#F4F2EC]/90 px-4 backdrop-blur lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="hidden max-w-md flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 sm:flex">
            <Search size={16} className="text-stone-400" />
            <input
              placeholder="Search orders, products, customers…"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-stone-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative grid h-10 w-10 place-items-center rounded-lg hover:bg-white" aria-label="Notifications">
              <Bell size={19} strokeWidth={1.6} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brass-500" />
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
