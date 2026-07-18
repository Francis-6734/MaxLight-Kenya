"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ConfirmDeleteButton({
  itemName,
  onDelete,
  successMessage = "Deleted",
}: {
  itemName: string;
  onDelete: () => Promise<{ error?: string }>;
  successMessage?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs whitespace-nowrap">
        Delete {itemName}?
        <button
          className="font-medium text-destructive hover:underline"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await onDelete();
              if (result.error) {
                toast.error(result.error);
              } else {
                toast.success(successMessage);
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
