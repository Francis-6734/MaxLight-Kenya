import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/shop-client";
import {
  getAllClientProducts,
  getClientCategoriesWithSubcategories,
} from "@/lib/catalog";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse lighting, electronics, décor, smart home and security products at MaxLight Kenya.",
  alternates: {
    canonical: `${SITE_URL}/shop`,
  },
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getAllClientProducts(),
    getClientCategoriesWithSubcategories(),
  ]);

  return (
    <ShopClient initialProducts={products} initialCategories={categories} />
  );
}
