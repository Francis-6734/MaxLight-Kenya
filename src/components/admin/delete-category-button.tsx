"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCategoryAction } from "@/lib/actions/category-actions";

export function DeleteCategoryButton({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        Delete {categoryName}?
        <button
          className="font-medium text-destructive hover:underline"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await deleteCategoryAction(categoryId);
              if (result.error) {
                toast.error(result.error);
              } else {
                toast.success("Category deleted");
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
