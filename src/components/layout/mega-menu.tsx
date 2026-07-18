"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { roomLinks, styleLinks } from "@/lib/nav-data";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { Category } from "@/lib/data/types";

export type MegaMenuKey = "shop" | "rooms" | "style";

export function MegaMenu({
  active,
  onNavigate,
  categories,
}: {
  active: MegaMenuKey | null;
  onNavigate: () => void;
  categories: Category[];
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute inset-x-0 top-full z-40 border-t border-border bg-background shadow-xl"
        >
          <div className="container-max py-8">
            {active === "shop" && <ShopPanel onNavigate={onNavigate} categories={categories} />}
            {active === "rooms" && <RoomsPanel onNavigate={onNavigate} />}
            {active === "style" && <StylePanel onNavigate={onNavigate} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ShopPanel({ onNavigate, categories }: { onNavigate: () => void; categories: Category[] }) {
  return (
    <div className="grid grid-cols-4 gap-x-8 gap-y-6">
      {categories.map((cat) => {
        const Icon = (Icons[cat.placeholder.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Package;
        return (
          <div key={cat.id}>
            <Link
              href={`/shop?category=${cat.slug}`}
              onClick={onNavigate}
              className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-foreground/70">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              </span>
              {cat.name}
            </Link>
            <ul className="space-y-1.5">
              {cat.subcategories.slice(0, 5).map((sub) => (
                <li key={sub.slug}>
                  <Link
                    href={`/shop?category=${cat.slug}&sub=${sub.slug}`}
                    onClick={onNavigate}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <div className="col-span-4 mt-2 flex items-center justify-between border-t border-border pt-5">
        <p className="font-heading text-lg">Everything your home deserves, under one roof.</p>
        <Link
          href="/shop"
          onClick={onNavigate}
          className="flex items-center gap-1.5 text-sm font-medium hover:underline"
        >
          Shop all products <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function RoomsPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div>
      <div className="mb-6 grid grid-cols-4 gap-4 sm:grid-cols-8">
        {roomLinks.map((room) => {
          const Icon = (Icons[room.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Home;
          return (
            <Link
              key={room.slug}
              href={`/shop?room=${room.slug}`}
              onClick={onNavigate}
              className="group flex flex-col items-center gap-2 rounded-xl p-3 text-center hover:bg-muted"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-gold/30">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="text-xs font-medium">{room.name}</span>
            </Link>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <p className="text-sm text-muted-foreground">
          Or browse our full <span className="font-medium text-foreground">Inspiration Hub</span> for complete
          room designs you can shop in one click.
        </p>
        <div className="flex shrink-0 items-center gap-5">
          <Link
            href="/room-visualizer"
            onClick={onNavigate}
            className="flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            Room Visualizer <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/room-estimator"
            onClick={onNavigate}
            className="flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            Room Cost Estimator <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/rooms"
            onClick={onNavigate}
            className="flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            Explore Inspiration <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StylePanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {styleLinks.map((style, i) => (
        <Link
          key={style.slug}
          href={`/shop?style=${style.slug}`}
          onClick={onNavigate}
          className="group relative flex h-24 items-end overflow-hidden rounded-xl"
        >
          <ImagePlaceholder
            gradient={
              [
                "from-stone-300 via-stone-100 to-white",
                "from-amber-200 via-amber-50 to-white",
                "from-slate-800 via-slate-600 to-slate-400",
                "from-rose-100 via-stone-50 to-white",
                "from-emerald-100 via-stone-50 to-white",
              ][i % 5]
            }
            icon="Palette"
            className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
            iconClassName="hidden"
          />
          <span className="relative z-10 w-full bg-black/40 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm">
            {style.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
