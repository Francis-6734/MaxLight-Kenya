import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { updateHeroSlideAction } from "@/lib/actions/homepage-actions";

export default async function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slide = await db.heroSlide.findUnique({ where: { id } });
  if (!slide) notFound();

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Homepage</p>
      <h1 className="mt-1 font-heading text-3xl">Edit Hero Slide</h1>
      <div className="mt-6">
        <HeroSlideForm action={updateHeroSlideAction.bind(null, slide.id)} initialValues={slide} />
      </div>
    </div>
  );
}
