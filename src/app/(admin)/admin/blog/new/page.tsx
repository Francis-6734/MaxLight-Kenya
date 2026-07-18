import { BlogForm } from "@/components/admin/blog-form";
import { createBlogPostAction } from "@/lib/actions/blog-actions";

export default function NewBlogPostPage() {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Content</p>
      <h1 className="mt-1 font-heading text-3xl">New Blog Post</h1>
      <div className="mt-6">
        <BlogForm action={createBlogPostAction} />
      </div>
    </div>
  );
}
