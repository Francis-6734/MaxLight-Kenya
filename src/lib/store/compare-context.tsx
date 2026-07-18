"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { usePersistedState } from "./use-persisted-state";
import type { Product } from "@/lib/data";
import { useProductCatalog } from "@/components/providers/product-catalog-provider";
import { toast } from "sonner";

const MAX_COMPARE = 4;

interface CompareContextValue {
  productIds: string[];
  items: Product[];
  isComparing: (productId: string) => boolean;
  toggle: (productId: string) => void;
  clear: () => void;
  max: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [productIds, setProductIds] = usePersistedState<string[]>("maxlight:compare", []);
  const { getProduct } = useProductCatalog();

  const isComparing = useCallback((productId: string) => productIds.includes(productId), [productIds]);

  const toggle = useCallback(
    (productId: string) => {
      setProductIds((prev) => {
        if (prev.includes(productId)) {
          return prev.filter((id) => id !== productId);
        }
        if (prev.length >= MAX_COMPARE) {
          toast.error(`You can compare up to ${MAX_COMPARE} products at a time`);
          return prev;
        }
        return [...prev, productId];
      });
    },
    [setProductIds]
  );

  const clear = useCallback(() => setProductIds([]), [setProductIds]);

  const items = useMemo(
    () => productIds.map((id) => getProduct(id)).filter((p): p is Product => !!p),
    [productIds, getProduct]
  );

  const value = useMemo(
    () => ({ productIds, items, isComparing, toggle, clear, max: MAX_COMPARE }),
    [productIds, items, isComparing, toggle, clear]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
