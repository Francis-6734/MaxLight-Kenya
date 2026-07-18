"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { usePersistedState } from "./use-persisted-state";
import type { Product } from "@/lib/data";
import { useProductCatalog } from "@/components/providers/product-catalog-provider";
import { toast } from "sonner";

interface WishlistContextValue {
  productIds: string[];
  items: Product[];
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [productIds, setProductIds] = usePersistedState<string[]>("maxlight:wishlist", []);
  const { getProduct } = useProductCatalog();

  const isWishlisted = useCallback((productId: string) => productIds.includes(productId), [productIds]);

  const toggle = useCallback(
    (productId: string) => {
      const product = getProduct(productId);
      setProductIds((prev) => {
        if (prev.includes(productId)) {
          toast(`${product?.name ?? "Item"} removed from wishlist`);
          return prev.filter((id) => id !== productId);
        }
        toast.success(`${product?.name ?? "Item"} added to wishlist`);
        return [...prev, productId];
      });
    },
    [setProductIds, getProduct]
  );

  const clear = useCallback(() => setProductIds([]), [setProductIds]);

  const items = useMemo(
    () => productIds.map((id) => getProduct(id)).filter((p): p is Product => !!p),
    [productIds, getProduct]
  );

  const value = useMemo(
    () => ({ productIds, items, isWishlisted, toggle, clear }),
    [productIds, items, isWishlisted, toggle, clear]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
