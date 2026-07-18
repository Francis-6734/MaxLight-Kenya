import Link from "next/link";
import { MapPin } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

interface FeaturedProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  gradient: string;
  icon: string;
  imageUrl: string | null;
}

export function FeaturedProjects({
  projects,
  heading,
}: {
  projects: FeaturedProject[];
  heading: { eyebrow: string; title: string; description: string };
}) {
  if (projects.length === 0) return null;

  return (
    <section className="bg-secondary/60 py-20">
      <div className="container-max">
        <SectionHeading
          eyebrow={heading.eyebrow}
          title={heading.title}
          description={heading.description}
          cta={{ label: "View full portfolio", href: "/projects" }}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.06}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <ImagePlaceholder
                    gradient={project.gradient}
                    icon={project.icon}
                    image={project.imageUrl}
                    className="transition-transform duration-500 group-hover:scale-105"
                    iconClassName="hidden"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
                    <p className="text-xs tracking-wide text-gold uppercase">{project.category}</p>
                    <p className="font-heading text-lg text-white">{project.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
                      <MapPin className="h-3 w-3" /> {project.location}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
