import Link from "next/link";
import { LayoutGrid, Package, MapPin, Heart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";

const items = [
  { label: "Overview", href: "/account", icon: LayoutGrid },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "#", icon: MapPin },
  { label: "Wishlist", href: "#", icon: Heart },
];

export function AccountSidebar({ active }: { active: string }) {
  return (
    <div className="border border-stone-200 p-2">
      {items.map((m) => (
        <Link
          key={m.label}
          href={m.href}
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
            m.label === active ? "bg-ink text-paper" : "text-ink-soft hover:bg-cream",
          )}
        >
          <m.icon size={17} strokeWidth={1.5} /> {m.label}
        </Link>
      ))}
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-ink-muted hover:bg-cream"
        >
          <LogOut size={17} strokeWidth={1.5} /> Sign out
        </button>
      </form>
    </div>
  );
}
