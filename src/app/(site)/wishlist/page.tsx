"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { useWishlist } from "@/lib/store/wishlist-context";

export default function WishlistPage() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="container-max flex flex-col items-center justify-center gap-4 py-32 text-center">
        <Heart className="h-12 w-12 text-muted-foreground" strokeWidth={1.25} />
        <h1 className="font-heading text-2xl">Your wishlist is empty</h1>
        <p className="text-muted-foreground">Save products you love and come back to them anytime.</p>
        <Link href="/shop" className="mt-2 inline-flex h-11 items-center rounded-lg bg-foreground px-6 text-sm font-medium text-background">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-max py-10">
      <h1 className="font-heading text-3xl">Your Wishlist</h1>
      <p className="mt-1 text-muted-foreground">{items.length} saved products</p>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
