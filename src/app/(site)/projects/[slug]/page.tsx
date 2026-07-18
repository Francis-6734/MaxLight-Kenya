import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, CalendarCheck, Quote } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.project.findUnique({ where: { slug } });
  if (!project) return {};
  return { title: project.title, description: `${project.category} project in ${project.location}.` };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await db.project.findUnique({ where: { slug } });
  if (!project || !project.published) notFound();

  const services = project.servicesDelivered.split(",").filter(Boolean);

  return (
    <div className="container-max py-10">
      <p className="text-sm text-muted-foreground">
        <Link href="/projects" className="hover:underline">
          Projects
        </Link>{" "}
        / {project.title}
      </p>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{project.category}</p>
          <h1 className="mt-1 font-heading text-3xl sm:text-4xl">{project.title}</h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {project.location}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarCheck className="h-4 w-4" /> Completed {project.completionDate}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-full">
          <ImagePlaceholder gradient={project.gradient} icon={project.icon} image={project.imageUrl} iconClassName="h-12 w-12" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <ImagePlaceholder gradient={project.gradient} icon={project.icon} image={project.imageUrl} />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <ImagePlaceholder gradient={project.gradient} icon={project.icon} image={project.imageUrl} />
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="font-heading text-2xl">Services Delivered</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {services.map((s) => (
              <span key={s} className="rounded-full border border-border px-3 py-1.5 text-sm">
                {s}
              </span>
            ))}
          </div>
        </div>

        {project.clientTestimonial && (
          <div className="rounded-2xl bg-secondary/60 p-6">
            <Quote className="h-6 w-6 text-gold" />
            <p className="mt-3 text-sm text-muted-foreground text-balance">&ldquo;{project.clientTestimonial}&rdquo;</p>
            {project.clientName && <p className="mt-4 text-sm font-medium">{project.clientName}</p>}
          </div>
        )}
      </div>

      <div className="mt-16 flex flex-col items-center gap-5 rounded-3xl bg-ink px-8 py-14 text-center text-white">
        <h2 className="font-heading text-3xl text-balance sm:text-4xl">Have a similar project in mind?</h2>
        <Link
          href="/book-consultation"
          className={cn(buttonVariants({ size: "lg" }), "h-12 bg-gold px-6 text-base text-gold-foreground hover:bg-gold/90")}
        >
          Book a Consultation
        </Link>
      </div>
    </div>
  );
}
