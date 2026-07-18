"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Category, Product } from "@/lib/data/types";

interface ProductCatalogValue {
  products: Product[];
  categories: Category[];
  loading: boolean;
  getProduct: (id: string) => Product | undefined;
}

const ProductCatalogContext = createContext<ProductCatalogValue | null>(null);

export function ProductCatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: { products: Product[]; categories: Category[] }) => {
        if (cancelled) return;
        setProducts(data.products);
        setCategories(data.categories);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const productsById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const value = useMemo<ProductCatalogValue>(
    () => ({
      products,
      categories,
      loading,
      getProduct: (id: string) => productsById.get(id),
    }),
    [products, categories, loading, productsById]
  );

  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>;
}

export function useProductCatalog() {
  const ctx = useContext(ProductCatalogContext);
  if (!ctx) throw new Error("useProductCatalog must be used within ProductCatalogProvider");
  return ctx;
}
