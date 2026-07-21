"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { markContactMessageReadAction } from "@/lib/actions/contact-actions";

export function MessageReadToggle({ id, read }: { id: string; read: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await markContactMessageReadAction(id, !read);
          if (result.error) toast.error(result.error);
          else router.refresh();
        })
      }
      className="text-sm font-medium hover:underline disabled:opacity-50"
    >
      Mark as {read ? "unread" : "read"}
    </button>
  );
}
