"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiImageUploadField } from "@/components/admin/multi-image-upload-field";
import { roomLinks, styleLinks } from "@/lib/nav-data";
import type { ProductFormState } from "@/lib/actions/product-actions";

export interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  subcategory: string;
  brand: string;
  price: number;
  compareAtPrice: number | null;
  rooms: string[];
  styles: string[];
  highlights: string;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  placeholderGrad: string;
  placeholderIcon: string;
  images: string[];
}

const GRADIENT_PRESETS = [
  "from-amber-100 via-stone-50 to-white",
  "from-stone-300 via-stone-100 to-white",
  "from-slate-800 via-slate-600 to-slate-400",
  "from-emerald-100 via-stone-50 to-white",
  "from-rose-100 via-stone-50 to-white",
  "from-sky-100 via-slate-50 to-white",
  "from-indigo-100 via-stone-50 to-white",
  "from-orange-100 via-amber-50 to-white",
];

export function ProductForm({
  categories,
  initialValues,
  action,
}: {
  categories: { id: string; name: string }[];
  initialValues?: ProductFormValues;
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(initialValues ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    }
  }, [state.success, router, initialValues]);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" required defaultValue={initialValues?.name} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" required defaultValue={initialValues?.slug} placeholder="e.g. aurelia-crystal-chandelier" />
        </div>

        <MultiImageUploadField
          currentImageUrls={initialValues?.images ?? []}
          gradient={initialValues?.placeholderGrad ?? GRADIENT_PRESETS[0]}
          icon={initialValues?.placeholderIcon ?? "Image"}
        />

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required rows={3} defaultValue={initialValues?.description} />
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select name="categoryId" defaultValue={initialValues?.categoryId} items={Object.fromEntries(categories.map((c) => [c.id, c.name]))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Input id="subcategory" name="subcategory" required defaultValue={initialValues?.subcategory} placeholder="e.g. chandeliers" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" name="brand" required defaultValue={initialValues?.brand} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Price (KES)</Label>
          <Input id="price" name="price" type="number" required min={1} defaultValue={initialValues?.price} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="compareAtPrice">Compare-at Price (optional)</Label>
          <Input id="compareAtPrice" name="compareAtPrice" type="number" min={1} defaultValue={initialValues?.compareAtPrice ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="placeholderIcon">Icon (lucide-react name)</Label>
          <Input id="placeholderIcon" name="placeholderIcon" required defaultValue={initialValues?.placeholderIcon} placeholder="e.g. Lightbulb" />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="placeholderGrad">Placeholder Gradient</Label>
          <select
            id="placeholderGrad"
            name="placeholderGrad"
            required
            defaultValue={initialValues?.placeholderGrad}
            className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
          >
            {GRADIENT_PRESETS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="highlights">Highlights (one per line)</Label>
          <Textarea id="highlights" name="highlights" rows={4} defaultValue={initialValues?.highlights} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Suitable Rooms</p>
        <div className="flex flex-wrap gap-3">
          {roomLinks.map((r) => (
            <label key={r.slug} className="flex items-center gap-1.5 text-sm">
              <Checkbox name="rooms" value={r.slug} defaultChecked={initialValues?.rooms.includes(r.slug)} />
              {r.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Styles</p>
        <div className="flex flex-wrap gap-3">
          {styleLinks.map((s) => (
            <label key={s.slug} className="flex items-center gap-1.5 text-sm">
              <Checkbox name="styles" value={s.slug} defaultChecked={initialValues?.styles.includes(s.slug)} />
              {s.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-1.5 text-sm">
          <Checkbox name="inStock" defaultChecked={initialValues?.inStock ?? true} /> In Stock
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <Checkbox name="isNew" defaultChecked={initialValues?.isNew} /> Mark as New
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <Checkbox name="isFeatured" defaultChecked={initialValues?.isFeatured} /> Featured
        </label>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving..." : initialValues ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}
