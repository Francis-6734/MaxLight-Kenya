import Link from "next/link";
import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Our Designers",
  description: "Meet the interior designers, lighting specialists and project managers behind MaxLight Kenya.",
};

export default async function DesignersPage() {
  const designers = await db.designer.findMany({ where: { published: true }, orderBy: { createdAt: "asc" } });

  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Our Team</p>
        <h1 className="font-heading text-4xl text-balance">Meet the People Behind Your Home</h1>
        <p className="mt-3 text-muted-foreground">
          Experienced designers and project managers, ready to bring your vision to life.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {designers.map((d) => (
          <Link key={d.id} href={`/designers/${d.slug}`} className="group block text-center">
            <div className="relative mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-full">
              <ImagePlaceholder gradient={d.gradient} icon={d.icon} image={d.imageUrl} />
            </div>
            <p className="mt-4 font-medium group-hover:underline">{d.name}</p>
            <p className="text-sm text-gold">{d.position}</p>
            <p className="mt-1 text-xs text-muted-foreground">{d.experience} experience</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
