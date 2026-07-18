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
import type { DesignerFormState } from "@/lib/actions/designer-actions";

const GRADIENT_PRESETS = [
  "from-amber-100 via-stone-50 to-white",
  "from-slate-200 via-stone-50 to-white",
  "from-rose-100 via-stone-50 to-white",
  "from-stone-300 via-stone-100 to-white",
];

export interface DesignerFormValues {
  name: string;
  slug: string;
  position: string;
  experience: string;
  specialization: string;
  bio: string;
  languages: string;
  gradient: string;
  icon: string;
  imageUrl: string | null;
  published: boolean;
}

export function DesignerForm({
  initialValues,
  action,
}: {
  initialValues?: DesignerFormValues;
  action: (prevState: DesignerFormState, formData: FormData) => Promise<DesignerFormState>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(initialValues ? "Designer updated" : "Designer created");
      router.push("/admin/designers");
      router.refresh();
    }
  }, [state.success, router, initialValues]);

  return (
    <form action={formAction} className="max-w-3xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={initialValues?.name} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" required defaultValue={initialValues?.slug} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" required defaultValue={initialValues?.position} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="experience">Experience</Label>
          <Input id="experience" name="experience" required defaultValue={initialValues?.experience} placeholder="e.g. 9 years" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Input id="specialization" name="specialization" required defaultValue={initialValues?.specialization} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="languages">Languages (comma-separated)</Label>
          <Input id="languages" name="languages" required defaultValue={initialValues?.languages} placeholder="English,Swahili" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="icon">Icon (lucide-react name)</Label>
          <Input id="icon" name="icon" required defaultValue={initialValues?.icon} placeholder="e.g. PencilRuler" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="gradient">Photo Gradient</Label>
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
        <ImageUploadField
          currentImageUrl={initialValues?.imageUrl}
          gradient={initialValues?.gradient ?? GRADIENT_PRESETS[0]}
          icon={initialValues?.icon ?? "Image"}
        />

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="bio">Biography</Label>
          <Textarea id="bio" name="bio" required rows={4} defaultValue={initialValues?.bio} />
        </div>
      </div>

      <label className="flex items-center gap-1.5 text-sm">
        <Checkbox name="published" defaultChecked={initialValues?.published ?? true} /> Published
      </label>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving..." : initialValues ? "Save Changes" : "Create Designer"}
      </Button>
    </form>
  );
}
