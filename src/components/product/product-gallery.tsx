"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { Placeholder } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ProductGallery({
  placeholder,
  images,
  name,
}: {
  placeholder: Placeholder;
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const activeImage = images[Math.min(active, images.length - 1)] ?? null;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <ImagePlaceholder gradient={placeholder.gradient} icon={placeholder.icon} image={activeImage} iconClassName="h-10 w-10" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, i) => {
            const isActive = active === i;
            return (
              <button
                key={image}
                onClick={() => setActive(i)}
                aria-label={`View ${name} image ${i + 1}`}
                aria-pressed={isActive}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg ring-1 ring-transparent transition-all",
                  isActive && "ring-2 ring-foreground"
                )}
              >
                <div
                  className={cn(
                    "h-full w-full transition-transform duration-300 ease-out",
                    !isActive && "scale-125 hover:scale-110"
                  )}
                >
                  <ImagePlaceholder gradient={placeholder.gradient} icon={placeholder.icon} image={image} iconClassName="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
