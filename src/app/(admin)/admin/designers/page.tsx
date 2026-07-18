import Link from "next/link";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { canManageContent } from "@/lib/auth/roles";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteDesignerAction } from "@/lib/actions/designer-actions";
import { cn } from "@/lib/utils";

export default async function AdminDesignersPage() {
  const user = await getCurrentUser();
  const role = user!.role;
  const canManage = canManageContent(role);

  const designers = await db.designer.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Content</p>
          <h1 className="mt-1 font-heading text-3xl">Designers</h1>
        </div>
        {canManage && (
          <Link href="/admin/designers/new" className={cn(buttonVariants(), "gap-1.5")}>
            <Plus className="h-4 w-4" /> New Designer
          </Link>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Position</th>
              <th className="p-3 font-medium">Experience</th>
              <th className="p-3 font-medium">Status</th>
              {canManage && <th className="p-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {designers.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3 text-muted-foreground">{d.position}</td>
                <td className="p-3 text-muted-foreground">{d.experience}</td>
                <td className="p-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", d.published ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-muted-foreground")}>
                    {d.published ? "Published" : "Draft"}
                  </span>
                </td>
                {canManage && (
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/designers/${d.id}/edit`} className="text-sm font-medium hover:underline">
                        Edit
                      </Link>
                      <ConfirmDeleteButton itemName={d.name} onDelete={deleteDesignerAction.bind(null, d.id)} successMessage="Designer deleted" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {designers.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No designers yet.</p>}
      </div>
    </div>
  );
}
