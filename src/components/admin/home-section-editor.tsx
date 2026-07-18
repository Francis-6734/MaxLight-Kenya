"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateHomeSectionAction } from "@/lib/actions/homepage-actions";

export function HomeSectionEditor({
  section,
}: {
  section: { id: string; eyebrow: string; title: string; description: string };
}) {
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const boundAction = updateHomeSectionAction.bind(null, section.id);
  const [state, formAction, pending] = useActionState(boundAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success("Section updated");
      router.refresh();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- closes the inline editor once the save action resolves
      setEditing(false);
    }
    if (state.error) toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-4 border-b border-border py-4 last:border-0">
        <div>
          <p className="text-xs font-mono text-muted-foreground">{section.id}</p>
          <p className="text-xs font-medium text-gold uppercase">{section.eyebrow}</p>
          <p className="font-medium">{section.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{section.description}</p>
        </div>
        <button onClick={() => setEditing(true)} className="shrink-0 text-sm font-medium hover:underline">
          Edit
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 border-b border-border py-4 last:border-0">
      <p className="text-xs font-mono text-muted-foreground">{section.id}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Eyebrow</Label>
          <Input name="eyebrow" required defaultValue={section.eyebrow} />
        </div>
        <div className="space-y-1">
          <Label>Title</Label>
          <Input name="title" required defaultValue={section.title} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>Description</Label>
          <Textarea name="description" required rows={2} defaultValue={section.description} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
