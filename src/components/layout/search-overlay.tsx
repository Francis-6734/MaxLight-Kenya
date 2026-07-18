"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { useProductCatalog } from "@/components/providers/product-catalog-provider";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";

const TRENDING = ["Chandeliers", "Smart Locks", "AC Units", "Wall Art", "Smart Speakers", "Pendant Lights"];

export function SearchOverlay() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { products } = useProductCatalog();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, products]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <DialogTrigger
        aria-label="Search"
        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
      >
        <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </DialogTrigger>
      <DialogContent
        showCloseButton
        className={cn(
          "top-[8%] left-1/2 max-w-full w-[min(680px,calc(100%-2rem))] -translate-x-1/2 -translate-y-0 rounded-2xl p-0 sm:max-w-[680px]"
        )}
      >
        <DialogTitle className="sr-only">Search MaxLight Kenya</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chandeliers, smart locks, wall art..."
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {query.trim() === "" ? (
            <div>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <TrendingUp className="h-3.5 w-3.5" /> Trending searches
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((t) => (
                  <button
                    key={t}
                    onClick={() => setQuery(t)}
                    className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-foreground/30 hover:bg-muted"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;. Try a different search term.
            </p>
          ) : (
            <ul className="space-y-1">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                      <ImagePlaceholder gradient={product.placeholder.gradient} icon={product.placeholder.icon} image={product.imageUrl} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{product.subcategory.replace(/-/g, " ")}</p>
                    </div>
                    <span className="shrink-0 text-sm font-medium">{formatKES(product.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
