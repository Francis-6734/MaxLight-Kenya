"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { useCart } from "@/lib/store/cart-context";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { resolvedLines, totalPrice, totalCount, updateQuantity, removeItem } = useCart();

  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open cart"
        className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
      >
        <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
        {totalCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
            {totalCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Your Cart</SheetTitle>
        </SheetHeader>

        {resolvedLines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.25} />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <SheetClose
              render={
                <Link href="/shop" className={cn(buttonVariants({ variant: "outline", size: "sm" }))} />
              }
            >
              Continue Shopping
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6">
              {resolvedLines.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 border-b border-border pb-4">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md"
                  >
                    <ImagePlaceholder gradient={product.placeholder.gradient} icon={product.placeholder.icon} image={product.imageUrl} />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="line-clamp-1 text-sm font-medium hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-muted-foreground">{formatKES(product.price)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-border px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-medium">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <SheetFooter className="gap-3 border-t border-border pt-4">
              <div className="flex items-center justify-between text-base font-medium">
                <span>Subtotal</span>
                <span>{formatKES(totalPrice)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping & installation calculated at checkout.</p>
              <Link href="/cart" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
                View Cart & Checkout
              </Link>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
