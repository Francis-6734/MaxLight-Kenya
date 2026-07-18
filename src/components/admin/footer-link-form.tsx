"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FooterLinkFormState } from "@/lib/actions/settings-actions";

const COLUMNS = [
  { value: "shop", label: "Shop" },
  { value: "company", label: "Company" },
  { value: "customer-care", label: "Customer Care" },
  { value: "legal", label: "Legal" },
];

export interface FooterLinkValues {
  column: string;
  label: string;
  href: string;
}

export function FooterLinkForm({
  initialValues,
  action,
  onSaved,
}: {
  initialValues?: FooterLinkValues;
  action: (prevState: FooterLinkFormState, formData: FormData) => Promise<FooterLinkFormState>;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(initialValues ? "Link updated" : "Link created");
      router.refresh();
      onSaved?.();
    }
    if (state.error) toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <Label>Column</Label>
        <Select
          name="column"
          defaultValue={initialValues?.column ?? "shop"}
          items={Object.fromEntries(COLUMNS.map((c) => [c.value, c.label]))}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COLUMNS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="label">Label</Label>
        <Input id="label" name="label" required defaultValue={initialValues?.label} className="w-44" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="href">URL</Label>
        <Input id="href" name="href" required defaultValue={initialValues?.href} className="w-56" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : initialValues ? "Save" : "Add Link"}
      </Button>
    </form>
  );
}
