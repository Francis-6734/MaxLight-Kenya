"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function ImageUploadField({
  currentImageUrl,
  gradient,
  icon,
  label = "Photo",
}: {
  currentImageUrl?: string | null;
  gradient: string;
  icon: string;
  label?: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl ?? null);
  const [removed, setRemoved] = useState(false);

  return (
    <div className="space-y-2 sm:col-span-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {preview && !removed ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview / already-uploaded file served from public/uploads, not an optimizable static asset
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlaceholder gradient={gradient} icon={icon} iconClassName="h-6 w-6" />
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          <input
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
                setRemoved(false);
              }
            }}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-background"
          />
          {currentImageUrl && (
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Checkbox
                name="removeImage"
                checked={removed}
                onCheckedChange={(checked) => {
                  setRemoved(!!checked);
                  setPreview(checked ? null : currentImageUrl);
                }}
              />
              Remove current photo
            </label>
          )}
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WEBP or GIF, up to 5MB. Falls back to the gradient placeholder below when no photo is
            uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}
