import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { createHeroSlideAction } from "@/lib/actions/homepage-actions";

export default function NewHeroSlidePage() {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Homepage</p>
      <h1 className="mt-1 font-heading text-3xl">New Hero Slide</h1>
      <div className="mt-6">
        <HeroSlideForm action={createHeroSlideAction} />
      </div>
    </div>
  );
}
