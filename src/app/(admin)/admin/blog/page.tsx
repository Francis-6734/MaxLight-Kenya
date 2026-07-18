import Link from "next/link";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { canManageContent } from "@/lib/auth/roles";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteBlogPostAction } from "@/lib/actions/blog-actions";
import { cn } from "@/lib/utils";

export default async function AdminBlogPage() {
  const user = await getCurrentUser();
  const role = user!.role;
  const canManage = canManageContent(role);

  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Content</p>
          <h1 className="mt-1 font-heading text-3xl">Blog</h1>
        </div>
        {canManage && (
          <Link href="/admin/blog/new" className={cn(buttonVariants(), "gap-1.5")}>
            <Plus className="h-4 w-4" /> New Post
          </Link>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Author</th>
              <th className="p-3 font-medium">Status</th>
              {canManage && <th className="p-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{post.title}</td>
                <td className="p-3 text-muted-foreground">{post.category}</td>
                <td className="p-3 text-muted-foreground">{post.author}</td>
                <td className="p-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", post.published ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-muted-foreground")}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                {canManage && (
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/blog/${post.id}/edit`} className="text-sm font-medium hover:underline">
                        Edit
                      </Link>
                      <ConfirmDeleteButton itemName={post.title} onDelete={deleteBlogPostAction.bind(null, post.id)} successMessage="Post deleted" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No posts yet.</p>}
      </div>
    </div>
  );
}
