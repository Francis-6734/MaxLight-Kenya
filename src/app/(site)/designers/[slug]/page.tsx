import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Languages, Award, Briefcase, Phone } from "lucide-react";
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
  const designer = await db.designer.findUnique({ where: { slug } });
  if (!designer) return {};
  return { title: designer.name, description: `${designer.position} at MaxLight Kenya.` };
}

export default async function DesignerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const designer = await db.designer.findUnique({ where: { slug } });
  if (!designer || !designer.published) notFound();

  const languages = designer.languages.split(",").filter(Boolean);

  return (
    <div className="container-max py-14">
      <p className="text-sm text-muted-foreground">
        <Link href="/designers" className="hover:underline">
          Our Team
        </Link>{" "}
        / {designer.name}
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
            <ImagePlaceholder gradient={designer.gradient} icon={designer.icon} image={designer.imageUrl} iconClassName="h-10 w-10" />
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 shrink-0 text-gold" /> {designer.experience} experience
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 shrink-0 text-gold" /> {designer.specialization}
            </div>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 shrink-0 text-gold" /> {languages.join(", ")}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.15em] text-gold uppercase">{designer.position}</p>
          <h1 className="mt-1 font-heading text-3xl sm:text-4xl">{designer.name}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{designer.bio}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book-consultation" className={cn(buttonVariants({ size: "lg" }), "h-12 gap-2")}>
              Book a Consultation
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 gap-2")}>
              <Phone className="h-4 w-4" /> Direct Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
