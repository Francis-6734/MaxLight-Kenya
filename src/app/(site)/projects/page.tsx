import Link from "next/link";
import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore MaxLight Kenya's portfolio of luxury homes, hotels, restaurants, offices and more.",
};

export default async function ProjectsPage() {
  const projects = await db.project.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Our Work</p>
        <h1 className="font-heading text-4xl text-balance">Featured Projects</h1>
        <p className="mt-3 text-muted-foreground">
          From luxury villas to boutique hotels — see how MaxLight transforms real spaces across Kenya.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
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
        ))}
      </div>
    </div>
  );
}
