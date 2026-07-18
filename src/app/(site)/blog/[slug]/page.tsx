import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Clock, User } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { db } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const related = await db.blogPost.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const paragraphs = post.body.split("\n\n").filter(Boolean);

  return (
    <div className="container-max py-10">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm text-muted-foreground">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>{" "}
          / {post.category}
        </p>
        <h1 className="mt-3 font-heading text-3xl text-balance sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" /> {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {post.createdAt.toLocaleDateString("en-KE", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {post.readTime}
          </span>
        </div>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <ImagePlaceholder gradient={post.gradient} icon={post.icon} image={post.imageUrl} iconClassName="h-10 w-10" />
        </div>

        <div className="prose prose-neutral mt-8 max-w-none space-y-5 text-[1.05rem] leading-relaxed text-foreground/90">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <div className="mx-auto mt-16 max-w-5xl border-t border-border pt-12">
          <h2 className="mb-6 font-heading text-2xl">More From the Journal</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <ImagePlaceholder
                    gradient={p.gradient}
                    icon={p.icon}
                    image={p.imageUrl}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-sm font-medium leading-snug group-hover:underline">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
