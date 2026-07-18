"use client";

import Link from "next/link";
import { Heart, Scale, Star, ShoppingBag } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/data";
import { formatKES } from "@/lib/format";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCompare } from "@/lib/store/compare-context";
import { useCart } from "@/lib/store/cart-context";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { isComparing, toggle: toggleCompare } = useCompare();
  const { addItem } = useCart();
  const wishlisted = isWishlisted(product.id);
  const comparing = isComparing(product.id);
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          <ImagePlaceholder
            gradient={product.placeholder.gradient}
            icon={product.placeholder.icon}
            image={product.imageUrl}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-1.5">
            {product.isNew && <Badge className="bg-royal text-royal-foreground pointer-events-auto">New</Badge>}
            {onSale && <Badge className="bg-gold text-gold-foreground pointer-events-auto">Sale</Badge>}
          </div>
          <div className="pointer-events-auto flex flex-col gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle wishlist"
              aria-pressed={wishlisted}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white",
                wishlisted && "text-red-500"
              )}
            >
              <Heart className="h-4 w-4" fill={wishlisted ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => toggleCompare(product.id)}
              aria-label="Toggle compare"
              aria-pressed={comparing}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white",
                comparing && "text-royal"
              )}
            >
              <Scale className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <button
          onClick={() => addItem(product.id)}
          className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-sm font-medium text-background opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
        </button>
      </div>

      <div className="mt-3 flex-1">
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <Link href={`/product/${product.slug}`} className="line-clamp-1 text-sm font-medium hover:underline">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold">{formatKES(product.price)}</span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatKES(product.compareAtPrice as number)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
