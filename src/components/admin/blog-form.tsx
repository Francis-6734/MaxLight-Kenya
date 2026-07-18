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
import type { BlogFormState } from "@/lib/actions/blog-actions";

const GRADIENT_PRESETS = [
  "from-amber-100 via-stone-50 to-white",
  "from-emerald-100 via-stone-50 to-white",
  "from-indigo-100 via-stone-50 to-white",
  "from-rose-100 via-stone-50 to-white",
  "from-neutral-200 via-stone-50 to-white",
  "from-stone-300 via-stone-100 to-white",
];

export interface BlogFormValues {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  readTime: string;
  gradient: string;
  icon: string;
  imageUrl: string | null;
  published: boolean;
}

export function BlogForm({
  initialValues,
  action,
}: {
  initialValues?: BlogFormValues;
  action: (prevState: BlogFormState, formData: FormData) => Promise<BlogFormState>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(initialValues ? "Post updated" : "Post created");
      router.push("/admin/blog");
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
          <Input id="category" name="category" required defaultValue={initialValues?.category} placeholder="e.g. Lighting Guides" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" required defaultValue={initialValues?.author} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="readTime">Read Time</Label>
          <Input id="readTime" name="readTime" required defaultValue={initialValues?.readTime ?? "5 min read"} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="icon">Icon (lucide-react name)</Label>
          <Input id="icon" name="icon" required defaultValue={initialValues?.icon} placeholder="e.g. Lightbulb" />
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
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" name="excerpt" required rows={2} defaultValue={initialValues?.excerpt} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="body">Body (separate paragraphs with a blank line)</Label>
          <Textarea id="body" name="body" required rows={10} defaultValue={initialValues?.body} />
        </div>
      </div>

      <label className="flex items-center gap-1.5 text-sm">
        <Checkbox name="published" defaultChecked={initialValues?.published ?? true} /> Published
      </label>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving..." : initialValues ? "Save Changes" : "Create Post"}
      </Button>
    </form>
  );
}
