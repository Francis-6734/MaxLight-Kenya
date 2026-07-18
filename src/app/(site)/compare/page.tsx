"use client";

import Link from "next/link";
import { Scale, Star, X } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { useCompare } from "@/lib/store/compare-context";
import { formatKES, slugToLabel } from "@/lib/format";

export default function ComparePage() {
  const { items, toggle, clear } = useCompare();

  if (items.length === 0) {
    return (
      <div className="container-max flex flex-col items-center justify-center gap-4 py-32 text-center">
        <Scale className="h-12 w-12 text-muted-foreground" strokeWidth={1.25} />
        <h1 className="font-heading text-2xl">No products to compare</h1>
        <p className="text-muted-foreground">Add up to 4 products from the shop to compare them side by side.</p>
        <Link href="/shop" className="mt-2 inline-flex h-11 items-center rounded-lg bg-foreground px-6 text-sm font-medium text-background">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-max py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl">Compare Products</h1>
          <p className="mt-1 text-muted-foreground">{items.length} of 4 products selected</p>
        </div>
        <button onClick={clear} className="text-sm text-muted-foreground hover:underline">
          Clear all
        </button>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <tbody>
            <tr>
              <td className="w-40" />
              {items.map((p) => (
                <td key={p.id} className="px-3 pb-4 align-top">
                  <div className="relative">
                    <button
                      onClick={() => toggle(p.id)}
                      className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow"
                      aria-label={`Remove ${p.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="relative aspect-square overflow-hidden rounded-xl">
                      <ImagePlaceholder gradient={p.placeholder.gradient} icon={p.placeholder.icon} image={p.imageUrl} />
                    </div>
                    <Link href={`/product/${p.slug}`} className="mt-2 block text-sm font-medium hover:underline">
                      {p.name}
                    </Link>
                  </div>
                </td>
              ))}
            </tr>

            {[
              { label: "Price", render: (p: (typeof items)[number]) => <span className="font-semibold">{formatKES(p.price)}</span> },
              {
                label: "Rating",
                render: (p: (typeof items)[number]) => (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {p.rating} ({p.reviewCount})
                  </span>
                ),
              },
              { label: "Brand", render: (p: (typeof items)[number]) => p.brand },
              { label: "Category", render: (p: (typeof items)[number]) => slugToLabel(p.category) },
              { label: "Subcategory", render: (p: (typeof items)[number]) => slugToLabel(p.subcategory) },
              {
                label: "Suitable Rooms",
                render: (p: (typeof items)[number]) => p.rooms.map((r) => slugToLabel(r)).join(", "),
              },
              { label: "Style", render: (p: (typeof items)[number]) => p.styles.map((s) => slugToLabel(s)).join(", ") },
              {
                label: "Availability",
                render: (p: (typeof items)[number]) => (
                  <span className={p.inStock ? "text-emerald-600" : "text-destructive"}>
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                ),
              },
            ].map((row) => (
              <tr key={row.label} className="border-t border-border">
                <td className="py-3 pr-4 text-sm font-medium text-muted-foreground">{row.label}</td>
                {items.map((p) => (
                  <td key={p.id} className="px-3 py-3 text-sm">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
