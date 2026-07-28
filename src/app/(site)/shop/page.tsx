import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/shop-client";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse lighting, electronics, décor, smart home and security products at MaxLight Kenya.",
  alternates: { canonical: `${SITE_URL}/shop` },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-max py-24 text-center text-muted-foreground">Loading products...</div>}>
      <ShopClient />
    </Suspense>
  );
}
