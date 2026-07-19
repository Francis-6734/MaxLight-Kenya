"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink, LogOut } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { NAV_ITEMS } from "./admin-sidebar";
import { signOutAction } from "@/lib/actions/auth-actions";
import { cn } from "@/lib/utils";

export function AdminMobileNav({ name, roleLabel }: { name: string; roleLabel: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open admin menu"
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">
            Max<span className="text-gold">Light</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <SheetClose
                key={item.href}
                render={<Link href={item.href} />}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </SheetClose>
            );
          })}
        </div>

        <div className="border-t border-border p-3">
          <SheetClose
            render={<Link href="/" />}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.5} /> View Site
          </SheetClose>
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
      </SheetContent>
    </Sheet>
  );
}
