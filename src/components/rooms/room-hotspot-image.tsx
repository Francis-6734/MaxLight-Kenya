"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ShoppingBag, X } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { InspirationRoom, Product } from "@/lib/data";
import { formatKES } from "@/lib/format";
import { useCart } from "@/lib/store/cart-context";
import { cn } from "@/lib/utils";

export function RoomHotspotImage({
  room,
  products,
}: {
  room: InspirationRoom;
  products: Record<string, Product>;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { addItem } = useCart();

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
      <ImagePlaceholder gradient={room.placeholder.gradient} icon={room.placeholder.icon} iconClassName="h-10 w-10" />

      {room.hotspots.map((h) => {
        const product = products[h.productId];
        if (!product) return null;
        const isActive = activeId === product.id;
        const showAbove = h.y > 55;

        return (
          <div key={h.productId} style={{ left: `${h.x}%`, top: `${h.y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => setActiveId(isActive ? null : product.id)}
              aria-label={`View ${product.name}`}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-md ring-4 ring-white/40 transition-transform hover:scale-110",
                isActive && "bg-foreground text-background ring-foreground/20"
              )}
            >
              {isActive ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
            </button>

            {isActive && (
              <div
                className={cn(
                  "absolute left-1/2 z-20 w-56 -translate-x-1/2 rounded-xl bg-white p-3 text-left shadow-xl ring-1 ring-black/5",
                  showAbove ? "bottom-full mb-3" : "top-full mt-3"
                )}
              >
                <div className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
                    <ImagePlaceholder gradient={product.placeholder.gradient} icon={product.placeholder.icon} image={product.imageUrl} />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-xs font-medium text-foreground">{product.name}</p>
                    <p className="mt-0.5 text-xs font-semibold text-foreground">{formatKES(product.price)}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex-1 rounded-full border border-border py-1.5 text-center text-xs font-medium hover:bg-muted"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => addItem(product.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-full bg-foreground py-1.5 text-xs font-medium text-background"
                  >
                    <ShoppingBag className="h-3 w-3" /> Add
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
