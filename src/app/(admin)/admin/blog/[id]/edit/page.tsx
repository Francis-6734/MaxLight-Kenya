import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BlogForm } from "@/components/admin/blog-form";
import { updateBlogPostAction } from "@/lib/actions/blog-actions";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Content</p>
      <h1 className="mt-1 font-heading text-3xl">Edit Blog Post</h1>
      <div className="mt-6">
        <BlogForm action={updateBlogPostAction.bind(null, post.id)} initialValues={post} />
      </div>
    </div>
  );
}
