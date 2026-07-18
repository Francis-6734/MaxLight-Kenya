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
import type { ProjectFormState } from "@/lib/actions/project-actions";

const GRADIENT_PRESETS = [
  "from-amber-100 via-stone-50 to-white",
  "from-slate-800 via-slate-600 to-slate-400",
  "from-stone-300 via-stone-100 to-white",
  "from-orange-100 via-amber-50 to-white",
  "from-neutral-800 via-neutral-600 to-neutral-400",
  "from-indigo-100 via-stone-50 to-white",
  "from-sky-100 via-stone-50 to-white",
  "from-emerald-100 via-stone-50 to-white",
];

export interface ProjectFormValues {
  title: string;
  slug: string;
  category: string;
  location: string;
  completionDate: string;
  servicesDelivered: string;
  clientTestimonial: string | null;
  clientName: string | null;
  gradient: string;
  icon: string;
  imageUrl: string | null;
  published: boolean;
}

export function ProjectForm({
  initialValues,
  action,
}: {
  initialValues?: ProjectFormValues;
  action: (prevState: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(initialValues ? "Project updated" : "Project created");
      router.push("/admin/projects");
      router.refresh();
    }
  }, [state.success, router, initialValues]);

  return (
    <form action={formAction} className="max-w-3xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required defaultValue={initialValues?.title} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" required defaultValue={initialValues?.slug} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" required defaultValue={initialValues?.category} placeholder="e.g. Luxury Homes" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" required defaultValue={initialValues?.location} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="completionDate">Completion Date</Label>
          <Input id="completionDate" name="completionDate" required defaultValue={initialValues?.completionDate} placeholder="e.g. March 2026" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="icon">Icon (lucide-react name)</Label>
          <Input id="icon" name="icon" required defaultValue={initialValues?.icon} placeholder="e.g. Building2" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="gradient">Cover Gradient</Label>
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
          label="Cover Photo"
        />

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="servicesDelivered">Services Delivered (comma-separated)</Label>
          <Input id="servicesDelivered" name="servicesDelivered" required defaultValue={initialValues?.servicesDelivered} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="clientName">Client Name (optional)</Label>
          <Input id="clientName" name="clientName" defaultValue={initialValues?.clientName ?? ""} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="clientTestimonial">Client Testimonial (optional)</Label>
          <Textarea id="clientTestimonial" name="clientTestimonial" rows={3} defaultValue={initialValues?.clientTestimonial ?? ""} />
        </div>
      </div>

      <label className="flex items-center gap-1.5 text-sm">
        <Checkbox name="published" defaultChecked={initialValues?.published ?? true} /> Published
      </label>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving..." : initialValues ? "Save Changes" : "Create Project"}
      </Button>
    </form>
  );
}
