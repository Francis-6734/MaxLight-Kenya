"use client";

import { roomLinks, styleLinks } from "@/lib/nav-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/lib/data/types";

interface FilterPanelProps {
  categories: Category[];
  selectedCategories: string[];
  selectedRooms: string[];
  selectedStyles: string[];
  onToggleCategory: (slug: string) => void;
  onToggleRoom: (slug: string) => void;
  onToggleStyle: (slug: string) => void;
  onClear: () => void;
}

export function FilterPanel({
  categories,
  selectedCategories,
  selectedRooms,
  selectedStyles,
  onToggleCategory,
  onToggleRoom,
  onToggleStyle,
  onClear,
}: FilterPanelProps) {
  const hasFilters = selectedCategories.length > 0 || selectedRooms.length > 0 || selectedStyles.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-heading text-lg">Filters</p>
        {hasFilters && (
          <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground hover:underline">
            Clear all
          </button>
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold">Category</p>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div key={cat.slug} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => onToggleCategory(cat.slug)}
              />
              <Label htmlFor={`cat-${cat.slug}`} className="flex-1 cursor-pointer text-sm font-normal">
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="mb-3 text-sm font-semibold">Room</p>
        <div className="space-y-2.5">
          {roomLinks.map((room) => (
            <div key={room.slug} className="flex items-center gap-2">
              <Checkbox
                id={`room-${room.slug}`}
                checked={selectedRooms.includes(room.slug)}
                onCheckedChange={() => onToggleRoom(room.slug)}
              />
              <Label htmlFor={`room-${room.slug}`} className="flex-1 cursor-pointer text-sm font-normal">
                {room.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="mb-3 text-sm font-semibold">Style</p>
        <div className="flex flex-wrap gap-2">
          {styleLinks.map((style) => {
            const active = selectedStyles.includes(style.slug);
            return (
              <button
                key={style.slug}
                onClick={() => onToggleStyle(style.slug)}
                className={
                  active
                    ? "rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background"
                    : "rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-foreground/30"
                }
              >
                {style.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
