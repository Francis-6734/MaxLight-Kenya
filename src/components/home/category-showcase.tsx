import Link from "next/link";
import * as Icons from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

interface ShowcaseCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  gradient: string;
  icon: string;
  imageUrl: string | null;
}

export function CategoryShowcase({
  categories,
  heading,
}: {
  categories: ShowcaseCategory[];
  heading: { eyebrow: string; title: string; description: string };
}) {
  return (
    <section className="container-max py-20">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        description={heading.description}
        cta={{ label: "View all categories", href: "/shop" }}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat, i) => {
          const Icon = (Icons[cat.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Package;
          return (
            <Reveal key={cat.id} delay={i * 0.04}>
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImagePlaceholder
                    gradient={cat.gradient}
                    icon={cat.icon}
                    image={cat.imageUrl}
                    className="transition-transform duration-500 group-hover:scale-105"
                    iconClassName="hidden"
                  />
                  <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-medium">{cat.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{cat.description}</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
