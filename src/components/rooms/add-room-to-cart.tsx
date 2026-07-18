"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart-context";
import { toast } from "sonner";

export function AddRoomToCart({ productIds, roomTitle }: { productIds: string[]; roomTitle: string }) {
  const { addItems } = useCart();

  return (
    <Button
      size="lg"
      className="h-12 gap-2 bg-foreground px-6"
      onClick={() => {
        addItems(productIds);
        toast.success(`Added all ${productIds.length} items from ${roomTitle} to your cart`);
      }}
    >
      <ShoppingBag className="h-4 w-4" /> Add Complete Room to Cart
    </Button>
  );
}
