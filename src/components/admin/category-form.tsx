"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { CategoryFormState } from "@/lib/actions/category-actions";

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  gradient: string;
  icon: string;
  imageUrl: string | null;
  published: boolean;
}

const GRADIENT_PRESETS = [
  "from-amber-100 via-stone-50 to-white",
  "from-stone-300 via-stone-100 to-white",
  "from-slate-800 via-slate-600 to-slate-400",
  "from-emerald-100 via-stone-50 to-white",
  "from-sky-100 via-slate-50 to-white",
  "from-indigo-200 via-indigo-50 to-white",
  "from-neutral-800 via-neutral-600 to-neutral-400",
];

export function CategoryForm({
  initialValues,
  action,
}: {
  initialValues?: CategoryFormValues;
  action: (prevState: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(initialValues ? "Category updated" : "Category created");
      router.push("/admin/categories");
      router.refresh();
    }
  }, [state.success, router, initialValues]);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={initialValues?.name} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" required defaultValue={initialValues?.slug} placeholder="e.g. lighting" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required rows={2} defaultValue={initialValues?.description} />
      </div>

      <ImageUploadField
        currentImageUrl={initialValues?.imageUrl}
        gradient={initialValues?.gradient ?? GRADIENT_PRESETS[0]}
        icon={initialValues?.icon ?? "Image"}
      />

      <div className="space-y-1.5">
        <Label htmlFor="icon">Icon (lucide-react name)</Label>
        <Input id="icon" name="icon" required defaultValue={initialValues?.icon} placeholder="e.g. Lightbulb" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="gradient">Placeholder Gradient</Label>
        <select
          id="gradient"
          name="gradient"
          required
          defaultValue={initialValues?.gradient}
          className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
        >
          {GRADIENT_PRESETS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-1.5 text-sm">
        <Checkbox name="published" defaultChecked={initialValues?.published ?? true} /> Published
      </label>
      <p className="-mt-3 text-xs text-muted-foreground">
        Unpublish a category to hide it — and every product in it — from the storefront while keeping it here for
        later. Use this if MaxLight temporarily stops carrying a category.
      </p>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving..." : initialValues ? "Save Changes" : "Create Category"}
      </Button>
    </form>
  );
}
