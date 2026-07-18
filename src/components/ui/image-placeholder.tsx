import Image from "next/image";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

type IconName = keyof typeof Icons;

interface ImagePlaceholderProps {
  gradient: string;
  icon: string;
  /** Uploaded photo URL — when present, renders this instead of the gradient/icon stand-in. */
  image?: string | null;
  className?: string;
  iconClassName?: string;
}

/**
 * Renders the admin-uploaded photo when one exists. Falls back to a
 * brand-consistent gradient field with a centred glyph for catalog/content
 * items that don't have photography uploaded yet.
 */
export function ImagePlaceholder({ gradient, icon, image, className, iconClassName }: ImagePlaceholderProps) {
  const LucideIcon = (Icons[icon as IconName] as Icons.LucideIcon) ?? Icons.Image;

  if (image) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <Image src={image} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor 0, currentColor 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-white/40 backdrop-blur-sm shadow-sm">
        <LucideIcon className={cn("h-7 w-7 text-black/50", iconClassName)} strokeWidth={1.25} />
      </div>
    </div>
  );
}
