"use client";

import { useState } from "react";
import { Heart, Minus, Plus, Scale, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart-context";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCompare } from "@/lib/store/compare-context";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { isComparing, toggle: toggleCompare } = useCompare();

  const wishlisted = isWishlisted(product.id);
  const comparing = isComparing(product.id);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex items-center gap-1 rounded-full border border-border px-2 py-1.5">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <Button size="lg" className="h-11 flex-1 gap-2" onClick={() => addItem(product.id, quantity)}>
        <ShoppingBag className="h-4 w-4" /> Add to Cart
      </Button>

      <Button
        size="lg"
        variant="outline"
        className={cn("h-11 w-11 shrink-0 p-0", wishlisted && "border-red-200 text-red-500")}
        onClick={() => toggleWishlist(product.id)}
        aria-label="Toggle wishlist"
      >
        <Heart className="h-4 w-4" fill={wishlisted ? "currentColor" : "none"} />
      </Button>

      <Button
        size="lg"
        variant="outline"
        className={cn("h-11 w-11 shrink-0 p-0", comparing && "border-royal/40 text-royal")}
        onClick={() => toggleCompare(product.id)}
        aria-label="Toggle compare"
      >
        <Scale className="h-4 w-4" />
      </Button>
    </div>
  );
}
