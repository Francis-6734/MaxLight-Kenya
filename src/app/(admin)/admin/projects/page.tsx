import Link from "next/link";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { canManageContent } from "@/lib/auth/roles";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteProjectAction } from "@/lib/actions/project-actions";
import { cn } from "@/lib/utils";

export default async function AdminProjectsPage() {
  const user = await getCurrentUser();
  const role = user!.role;
  const canManage = canManageContent(role);

  const projects = await db.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Content</p>
          <h1 className="mt-1 font-heading text-3xl">Projects</h1>
        </div>
        {canManage && (
          <Link href="/admin/projects/new" className={cn(buttonVariants(), "gap-1.5")}>
            <Plus className="h-4 w-4" /> New Project
          </Link>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Location</th>
              <th className="p-3 font-medium">Status</th>
              {canManage && <th className="p-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{project.title}</td>
                <td className="p-3 text-muted-foreground">{project.category}</td>
                <td className="p-3 text-muted-foreground">{project.location}</td>
                <td className="p-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", project.published ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-muted-foreground")}>
                    {project.published ? "Published" : "Draft"}
                  </span>
                </td>
                {canManage && (
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/projects/${project.id}/edit`} className="text-sm font-medium hover:underline">
                        Edit
                      </Link>
                      <ConfirmDeleteButton itemName={project.title} onDelete={deleteProjectAction.bind(null, project.id)} successMessage="Project deleted" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No projects yet.</p>}
      </div>
    </div>
  );
}
