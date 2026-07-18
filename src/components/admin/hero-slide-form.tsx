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
import type { HeroSlideFormState } from "@/lib/actions/homepage-actions";

const GRADIENT_PRESETS = [
  "from-amber-100 via-stone-50 to-white",
  "from-amber-200 via-yellow-50 to-white",
  "from-emerald-100 via-stone-50 to-white",
  "from-rose-100 via-stone-50 to-white",
  "from-neutral-300 via-stone-50 to-white",
  "from-slate-800 via-slate-600 to-slate-400",
];

export interface HeroSlideFormValues {
  eyebrow: string;
  headline: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  gradient: string;
  icon: string;
  imageUrl: string | null;
  published: boolean;
}

export function HeroSlideForm({
  initialValues,
  action,
}: {
  initialValues?: HeroSlideFormValues;
  action: (prevState: HeroSlideFormState, formData: FormData) => Promise<HeroSlideFormState>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(initialValues ? "Slide updated" : "Slide created");
      router.push("/admin/homepage");
      router.refresh();
    }
  }, [state.success, router, initialValues]);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="eyebrow">Eyebrow</Label>
          <Input id="eyebrow" name="eyebrow" required defaultValue={initialValues?.eyebrow} placeholder="e.g. Living Rooms" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="icon">Icon (lucide-react name)</Label>
          <Input id="icon" name="icon" required defaultValue={initialValues?.icon} placeholder="e.g. Lightbulb" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" name="headline" required defaultValue={initialValues?.headline} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Textarea id="subtitle" name="subtitle" required rows={2} defaultValue={initialValues?.subtitle} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="primaryCtaLabel">Primary Button Label</Label>
          <Input id="primaryCtaLabel" name="primaryCtaLabel" required defaultValue={initialValues?.primaryCtaLabel ?? "Shop Now"} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="primaryCtaHref">Primary Button Link</Label>
          <Input id="primaryCtaHref" name="primaryCtaHref" required defaultValue={initialValues?.primaryCtaHref ?? "/shop"} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="secondaryCtaLabel">Secondary Button Label</Label>
          <Input id="secondaryCtaLabel" name="secondaryCtaLabel" required defaultValue={initialValues?.secondaryCtaLabel ?? "Book Consultation"} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="secondaryCtaHref">Secondary Button Link</Label>
          <Input id="secondaryCtaHref" name="secondaryCtaHref" required defaultValue={initialValues?.secondaryCtaHref ?? "/book-consultation"} />
        </div>
        <ImageUploadField
          currentImageUrl={initialValues?.imageUrl}
          gradient={initialValues?.gradient ?? GRADIENT_PRESETS[0]}
          icon={initialValues?.icon ?? "Image"}
          label="Background Photo"
        />

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="gradient">Background Gradient</Label>
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
      </div>

      <label className="flex items-center gap-1.5 text-sm">
        <Checkbox name="published" defaultChecked={initialValues?.published ?? true} /> Published
      </label>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving..." : initialValues ? "Save Changes" : "Create Slide"}
      </Button>
    </form>
  );
}
