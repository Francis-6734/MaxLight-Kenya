"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Scale } from "lucide-react";
import { MegaMenu, type MegaMenuKey } from "./mega-menu";
import { SearchOverlay } from "./search-overlay";
import { CartDrawer } from "./cart-drawer";
import { MobileNav } from "./mobile-nav";
import { AccountMenu } from "./account-menu";
import { buttonVariants } from "@/components/ui/button";
import { simpleNavLinks } from "@/lib/nav-data";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCompare } from "@/lib/store/compare-context";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/data/types";
import type { CurrentUser } from "@/lib/auth/current-user";

const MEGA_TRIGGERS: { key: MegaMenuKey; label: string }[] = [
  { key: "shop", label: "Shop" },
  { key: "rooms", label: "Rooms" },
  { key: "style", label: "Style" },
];

export interface AnnouncementData {
  text: string;
  linkLabel: string;
  linkHref: string;
}

export function SiteHeader({
  announcement,
  categories,
  user,
}: {
  announcement: AnnouncementData;
  categories: Category[];
  user: CurrentUser | null;
}) {
  const [active, setActive] = useState<MegaMenuKey | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { productIds: wishlistIds } = useWishlist();
  const { productIds: compareIds } = useCompare();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      onMouseLeave={() => setActive(null)}
      className={cn(
        "sticky top-0 z-50 bg-background/95 backdrop-blur transition-shadow",
        scrolled && "shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
      )}
    >
      <div className="hidden bg-ink text-center text-xs tracking-wide text-white/90 lg:block">
        <p className="py-2">
          {announcement.text}
          {announcement.linkLabel && announcement.linkHref && (
            <>
              {" "}
              <Link href={announcement.linkHref} className="underline underline-offset-2 hover:text-gold">
                {announcement.linkLabel}
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="container-max relative flex h-16 items-center gap-4 lg:h-20">
        <MobileNav categories={categories} />

        <Link
          href="/"
          className="mr-2 flex shrink-0 items-center gap-2 font-heading text-2xl tracking-tight xl:mr-6"
        >
          <Image src="/logo-icon.png" alt="MaxLight" width={36} height={36} className="rounded-lg" priority />
          Max<span className="text-gold">Light</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {MEGA_TRIGGERS.map((item) => (
            <button
              key={item.key}
              onMouseEnter={() => setActive(item.key)}
              onClick={() => setActive((prev) => (prev === item.key ? null : item.key))}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted",
                active === item.key && "bg-muted"
              )}
            >
              {item.label}
            </button>
          ))}
          {simpleNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setActive(null)}
              className="rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SearchOverlay />

          <AccountMenu user={user} />

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted sm:flex"
          >
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          <Link
            href="/compare"
            aria-label="Compare"
            className="relative hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted sm:flex"
          >
            <Scale className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {compareIds.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                {compareIds.length}
              </span>
            )}
          </Link>

          <CartDrawer />

          <Link
            href="/book-consultation"
            className={cn(buttonVariants({ size: "lg" }), "ml-2 hidden bg-foreground xl:inline-flex")}
          >
            Book Consultation
          </Link>
        </div>

        <MegaMenu active={active} onNavigate={() => setActive(null)} categories={categories} />
      </div>
    </header>
  );
}
