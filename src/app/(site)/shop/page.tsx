import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/shop-client";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse lighting, electronics, décor, smart home and security products at MaxLight Kenya.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-max py-24 text-center text-muted-foreground">Loading products...</div>}>
      <ShopClient />
    </Suspense>
  );
}
