"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { usePersistedState } from "./use-persisted-state";
import type { Product } from "@/lib/data";
import { useProductCatalog } from "@/components/providers/product-catalog-provider";
import { toast } from "sonner";

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface ResolvedCartLine extends CartLine {
  product: Product;
}

interface CartContextValue {
  lines: CartLine[];
  resolvedLines: ResolvedCartLine[];
  totalCount: number;
  totalPrice: number;
  addItem: (productId: string, quantity?: number) => void;
  addItems: (productIds: string[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = usePersistedState<CartLine[]>("maxlight:cart", []);
  const { getProduct } = useProductCatalog();

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      const product = getProduct(productId);
      setLines((prev) => {
        const existing = prev.find((l) => l.productId === productId);
        if (existing) {
          return prev.map((l) =>
            l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l
          );
        }
        return [...prev, { productId, quantity }];
      });
      toast.success(`${product?.name ?? "Item"} added to cart`);
    },
    [setLines, getProduct]
  );

  const addItems = useCallback(
    (productIds: string[]) => {
      setLines((prev) => {
        let next = prev;
        for (const productId of productIds) {
          const existingIndex = next.findIndex((l) => l.productId === productId);
          if (existingIndex >= 0) {
            next = next.map((l, i) => (i === existingIndex ? { ...l, quantity: l.quantity + 1 } : l));
          } else {
            next = [...next, { productId, quantity: 1 }];
          }
        }
        return next;
      });
    },
    [setLines]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setLines((prev) => prev.filter((l) => l.productId !== productId));
    },
    [setLines]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setLines((prev) => prev.map((l) => (l.productId === productId ? { ...l, quantity } : l)));
    },
    [setLines, removeItem]
  );

  const clear = useCallback(() => setLines([]), [setLines]);

  const resolvedLines = useMemo(
    () =>
      lines
        .map((line) => {
          const product = getProduct(line.productId);
          return product ? { ...line, product } : null;
        })
        .filter((l): l is ResolvedCartLine => l !== null),
    [lines, getProduct]
  );

  const totalCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const totalPrice = useMemo(
    () => resolvedLines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
    [resolvedLines]
  );

  const value = useMemo(
    () => ({ lines, resolvedLines, totalCount, totalPrice, addItem, addItems, removeItem, updateQuantity, clear }),
    [lines, resolvedLines, totalCount, totalPrice, addItem, addItems, removeItem, updateQuantity, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
