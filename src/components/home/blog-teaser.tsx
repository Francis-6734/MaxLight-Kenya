import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

interface BlogTeaserPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  gradient: string;
  icon: string;
  imageUrl: string | null;
  createdAt: Date;
}

export function BlogTeaser({
  posts,
  heading,
}: {
  posts: BlogTeaserPost[];
  heading: { eyebrow: string; title: string; description: string };
}) {
  if (posts.length === 0) return null;

  return (
    <section className="container-max py-20">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        description={heading.description}
        cta={{ label: "Visit the blog", href: "/blog" }}
      />
      <div className="grid gap-6 sm:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.id} delay={i * 0.07}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <ImagePlaceholder
                  gradient={post.gradient}
                  icon={post.icon}
                  image={post.imageUrl}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-xs font-medium tracking-wide text-gold uppercase">{post.category}</p>
              <p className="mt-1.5 font-heading text-lg leading-snug text-balance group-hover:underline">
                {post.title}
              </p>
              <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.createdAt.toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {post.readTime}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
