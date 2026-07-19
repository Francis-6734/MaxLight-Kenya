"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  ExternalLink,
  LogOut,
  Newspaper,
  Building2,
  Contact,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { signOutAction } from "@/lib/actions/auth-actions";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/homepage", label: "Homepage", icon: ImageIcon },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/designers", label: "Designers", icon: Contact },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ name, roleLabel }: { name: string; roleLabel: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
      <div className="border-b border-border p-5">
        <Link href="/admin" className="font-heading text-xl">
          Max<span className="text-gold">Light</span>
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">Admin Console</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} /> View Site
        </Link>
        <button
          onClick={() => signOutAction()}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sign Out
        </button>
        <div className="mt-2 border-t border-border px-3 pt-3">
          <p className="line-clamp-1 text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
        </div>
      </div>
    </aside>
  );
}
