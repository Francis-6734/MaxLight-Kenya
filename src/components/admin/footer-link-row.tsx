"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FooterLinkForm } from "@/components/admin/footer-link-form";
import { updateFooterLinkAction, deleteFooterLinkAction } from "@/lib/actions/settings-actions";

export function FooterLinkRow({ link }: { link: { id: string; column: string; label: string; href: string } }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (editing) {
    return (
      <div className="border-b border-border py-3">
        <FooterLinkForm
          initialValues={link}
          action={updateFooterLinkAction.bind(null, link.id)}
          onSaved={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 text-sm last:border-0">
      <div>
        <span className="font-medium">{link.label}</span>
        <span className="ml-2 text-muted-foreground">{link.href}</span>
      </div>
      {confirming ? (
        <span className="flex items-center gap-2 text-xs">
          Delete?
          <button
            disabled={pending}
            className="font-medium text-destructive hover:underline"
            onClick={() =>
              startTransition(async () => {
                const result = await deleteFooterLinkAction(link.id);
                if (result.error) toast.error(result.error);
                else {
                  toast.success("Link deleted");
                  router.refresh();
                }
              })
            }
          >
            Yes
          </button>
          <button className="text-muted-foreground hover:underline" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </span>
      ) : (
        <div className="flex items-center gap-3">
          <button onClick={() => setEditing(true)} className="font-medium hover:underline">
            Edit
          </button>
          <button onClick={() => setConfirming(true)} className="font-medium text-destructive hover:underline">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
