"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteProductAction } from "@/lib/actions/product-actions";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        Delete {productName}?
        <button
          className="font-medium text-destructive hover:underline"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await deleteProductAction(productId);
              if (result.error) {
                toast.error(result.error);
              } else {
                toast.success("Product deleted");
                router.refresh();
              }
              setConfirming(false);
            })
          }
        >
          {pending ? "Deleting..." : "Yes"}
        </button>
        <button className="text-muted-foreground hover:underline" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-sm font-medium text-destructive hover:underline">
      Delete
    </button>
  );
}
