"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Label } from "@/components/ui/label";

export function MultiImageUploadField({
  currentImageUrls,
  gradient,
  icon,
  label = "Photos",
}: {
  currentImageUrls: string[];
  gradient: string;
  icon: string;
  label?: string;
}) {
  const [kept, setKept] = useState<string[]>(currentImageUrls);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  return (
    <div className="space-y-2 sm:col-span-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-3">
        {kept.map((url) => (
          <div key={url} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- already-uploaded Cloudinary photo previewed in an admin form, not an optimizable page asset */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <input type="hidden" name="keepImages" value={url} />
            <button
              type="button"
              aria-label="Remove this photo"
              onClick={() => setKept((prev) => prev.filter((u) => u !== url))}
              className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {newPreviews.map((src) => (
          <div key={src} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview of a file not yet uploaded */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">New</span>
          </div>
        ))}

        {kept.length === 0 && newPreviews.length === 0 && (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-dashed border-border">
            <ImagePlaceholder gradient={gradient} icon={icon} iconClassName="h-6 w-6" />
          </div>
        )}
      </div>

      <input
        type="file"
        name="images"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          setNewPreviews(files.map((file) => URL.createObjectURL(file)));
        }}
        className="mt-2 block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-background"
      />
      <p className="text-xs text-muted-foreground">
        JPEG, PNG, WEBP or GIF, up to 5MB each. Select several files at once to add multiple photos — the first
        photo (in the order shown above) is used everywhere only one image fits, like the shop grid and cart. Falls
        back to the gradient placeholder when no photos are uploaded.
      </p>
    </div>
  );
}
