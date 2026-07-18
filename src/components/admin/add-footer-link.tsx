"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FooterLinkForm } from "@/components/admin/footer-link-form";
import { createFooterLinkAction } from "@/lib/actions/settings-actions";

export function AddFooterLink() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        + Add Link
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-border p-4">
      <FooterLinkForm action={createFooterLinkAction} onSaved={() => setOpen(false)} />
    </div>
  );
}
