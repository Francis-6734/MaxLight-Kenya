import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Clock } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Blog",
  description: "Interior tips, lighting guides and design inspiration from the MaxLight Kenya team.",
};

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">The Journal</p>
        <h1 className="font-heading text-4xl text-balance">Interior Tips & Inspiration</h1>
        <p className="mt-3 text-muted-foreground">
          Guides from our design team to help you plan, style and maintain your home.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <ImagePlaceholder
                gradient={post.gradient}
                icon={post.icon}
                image={post.imageUrl}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 text-xs font-medium tracking-wide text-gold uppercase">{post.category}</p>
            <p className="mt-1.5 font-heading text-lg leading-snug text-balance group-hover:underline">{post.title}</p>
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
        ))}
      </div>
    </div>
  );
}
