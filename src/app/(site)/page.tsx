import { Hero } from "@/components/home/hero";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { ShopByRoom } from "@/components/home/shop-by-room";
import { FeaturedProducts } from "@/components/home/featured-products";
import { InspirationTeaser } from "@/components/home/inspiration-teaser";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { ConsultationBanner } from "@/components/home/consultation-banner";
import { BlogTeaser } from "@/components/home/blog-teaser";
import { SocialProof } from "@/components/home/social-proof";
import { getFeaturedClientProducts } from "@/lib/catalog";
import { db } from "@/lib/db";

const FALLBACK_HEADING = { eyebrow: "", title: "", description: "" };

export default async function Home() {
  const [featuredProducts, slides, sections, dbCategories, projects, posts, testimonialProjects] = await Promise.all([
    getFeaturedClientProducts(),
    db.heroSlide.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    db.homeSection.findMany(),
    db.category.findMany({ where: { published: true }, orderBy: { name: "asc" } }),
    db.project.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    db.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    db.project.findMany({ where: { published: true, clientTestimonial: { not: null } }, take: 3 }),
  ]);

  const sectionById = Object.fromEntries(sections.map((s) => [s.id, s]));
  const heading = (id: string) => sectionById[id] ?? FALLBACK_HEADING;

  return (
    <>
      <Hero slides={slides} />
      <CategoryShowcase categories={dbCategories} heading={heading("category-showcase")} />
      <ShopByRoom heading={heading("shop-by-room")} />
      <FeaturedProducts products={featuredProducts} heading={heading("featured-products")} />
      <InspirationTeaser heading={heading("inspiration-teaser")} />
      <FeaturedProjects projects={projects} heading={heading("featured-projects")} />
      <ConsultationBanner />
      <BlogTeaser posts={posts} heading={heading("blog-teaser")} />
      <SocialProof testimonials={testimonialProjects} />
    </>
  );
}
