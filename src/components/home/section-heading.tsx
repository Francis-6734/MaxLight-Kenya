import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  cta,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className={cn(align === "center" && "mx-auto max-w-2xl text-center")}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase gold-underline inline-block">
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading text-3xl text-balance sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 max-w-xl text-muted-foreground">{description}</p>}
      </div>
      {cta && align !== "center" && (
        <Link href={cta.href} className="flex shrink-0 items-center gap-1.5 text-sm font-medium hover:underline">
          {cta.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </Reveal>
  );
}
