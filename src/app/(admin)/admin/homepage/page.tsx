import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { HomeSectionEditor } from "@/components/admin/home-section-editor";
import { deleteHeroSlideAction } from "@/lib/actions/homepage-actions";
import { cn } from "@/lib/utils";

export default async function AdminHomepagePage() {
  const [slides, sections] = await Promise.all([
    db.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    db.homeSection.findMany(),
  ]);

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Content</p>
      <h1 className="mt-1 font-heading text-3xl">Homepage</h1>

      <div className="mt-8 rounded-2xl border border-border bg-background p-5">
        <div className="flex items-center justify-between">
          <p className="font-heading text-lg">Hero Slides</p>
          <Link href="/admin/homepage/hero/new" className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
            <Plus className="h-3.5 w-3.5" /> New Slide
          </Link>
        </div>
        <div className="mt-4 space-y-1">
          {slides.map((slide) => (
            <div key={slide.id} className="flex items-center justify-between border-b border-border py-3 text-sm last:border-0">
              <div>
                <p className="text-xs font-medium text-gold uppercase">{slide.eyebrow}</p>
                <p className="font-medium">{slide.headline}</p>
                {!slide.published && <span className="text-xs text-muted-foreground">Draft</span>}
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/admin/homepage/hero/${slide.id}/edit`} className="font-medium hover:underline">
                  Edit
                </Link>
                <ConfirmDeleteButton itemName={slide.headline} onDelete={deleteHeroSlideAction.bind(null, slide.id)} successMessage="Slide deleted" />
              </div>
            </div>
          ))}
          {slides.length === 0 && <p className="py-3 text-sm text-muted-foreground">No hero slides yet.</p>}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background p-5">
        <p className="font-heading text-lg">Homepage Sections</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit the eyebrow, title and description shown above each section of the homepage.
        </p>
        <div className="mt-4">
          {sections.map((section) => (
            <HomeSectionEditor key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
