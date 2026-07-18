"use client";

import { useRef } from "react";
import * as Icons from "lucide-react";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";

export interface PlacedItemData {
  id: string;
  productId: string;
  x: number; // percent
  y: number; // percent
  scale: number;
  rotation: number;
}

export function PlacedItem({
  item,
  product,
  containerRef,
  isSelected,
  onSelect,
  onMove,
}: {
  item: PlacedItemData;
  product: Product;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
}) {
  const dragging = useRef(false);
  const Icon = (Icons[product.placeholder.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Package;

  function handlePointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    onSelect();
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(96, Math.max(4, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(96, Math.max(4, ((e.clientY - rect.top) / rect.height) * 100));
    onMove(x, y);
  }

  function handlePointerUp(e: React.PointerEvent) {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ left: `${item.x}%`, top: `${item.y}%` }}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 touch-none select-none"
    >
      <div
        style={{ transform: `rotate(${item.rotation}deg) scale(${item.scale})` }}
        className={cn(
          "flex h-16 w-16 cursor-grab items-center justify-center rounded-xl border-2 bg-white/95 shadow-lg backdrop-blur active:cursor-grabbing",
          isSelected ? "border-gold ring-2 ring-gold/40" : "border-white"
        )}
      >
        <Icon className="h-6 w-6 text-foreground/70" strokeWidth={1.5} />
      </div>
    </div>
  );
}
