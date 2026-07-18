"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { Product } from "@/lib/data";
import { useProductCatalog } from "@/components/providers/product-catalog-provider";
import { cn } from "@/lib/utils";

const PLACEABLE_CATEGORIES: { value: Product["category"]; label: string }[] = [
  { value: "lighting", label: "Lighting" },
  { value: "wall-decor", label: "Wall Décor" },
  { value: "smart-home", label: "Smart Home" },
  { value: "electronics", label: "Electronics" },
  { value: "kitchen", label: "Kitchen" },
  { value: "security", label: "Security" },
];

export function ProductPalette({ onAdd }: { onAdd: (product: Product) => void }) {
  const [category, setCategory] = useState<Product["category"]>("lighting");
  const { products } = useProductCatalog();
  const items = products.filter((p) => p.category === category);

  return (
    <div>
      <p className="mb-3 text-sm font-semibold">Add Products</p>
      <div className="flex flex-wrap gap-1.5">
        {PLACEABLE_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium",
              category === c.value ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid max-h-[420px] grid-cols-2 gap-2 overflow-y-auto pr-1">
        {items.map((product) => (
          <button
            key={product.id}
            onClick={() => onAdd(product)}
            className="group flex flex-col overflow-hidden rounded-lg border border-border text-left hover:border-foreground/30"
          >
            <div className="relative aspect-square">
              <ImagePlaceholder gradient={product.placeholder.gradient} icon={product.placeholder.icon} image={product.imageUrl} iconClassName="h-5 w-5" />
            </div>
            <p className="line-clamp-1 px-2 py-1.5 text-xs">{product.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
