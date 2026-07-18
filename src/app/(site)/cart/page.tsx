"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { useCart } from "@/lib/store/cart-context";
import { formatKES } from "@/lib/format";

export default function CartPage() {
  const { resolvedLines, totalPrice, updateQuantity, removeItem } = useCart();
  const [coupon, setCoupon] = useState("");
  const deliveryEstimate = resolvedLines.length > 0 ? 1500 : 0;

  if (resolvedLines.length === 0) {
    return (
      <div className="container-max flex flex-col items-center justify-center gap-4 py-32 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" strokeWidth={1.25} />
        <h1 className="font-heading text-2xl">Your cart is empty</h1>
        <p className="text-muted-foreground">Browse our catalog and find something beautiful for your home.</p>
        <Link href="/shop" className="mt-2 inline-flex h-11 items-center rounded-lg bg-foreground px-6 text-sm font-medium text-background">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-max py-10">
      <h1 className="font-heading text-3xl">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-border border-y border-border">
          {resolvedLines.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 py-5">
              <Link href={`/product/${product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                <ImagePlaceholder gradient={product.placeholder.gradient} icon={product.placeholder.icon} image={product.imageUrl} />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/product/${product.slug}`} className="font-medium hover:underline">
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted-foreground">{product.brand}</p>
                  </div>
                  <p className="shrink-0 font-medium">{formatKES(product.price * quantity)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border border-border px-1.5 py-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-border p-6">
          <p className="font-heading text-lg">Order Summary</p>

          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code"
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (!coupon.trim()) return;
                toast.error("This coupon code is not valid or has expired.");
              }}
            >
              Apply
            </Button>
          </div>

          <div className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatKES(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated delivery</span>
              <span>{formatKES(deliveryEstimate)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold">
              <span>Total</span>
              <span>{formatKES(totalPrice + deliveryEstimate)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-foreground text-sm font-medium text-background hover:bg-foreground/90"
          >
            Proceed to Checkout
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            M-Pesa, Visa &amp; Mastercard accepted. VAT included where applicable.
          </p>
        </div>
      </div>
    </div>
  );
}
