import Link from "next/link";
import { Plus } from "lucide-react";
import * as Icons from "lucide-react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { canManageCatalog } from "@/lib/auth/roles";
import { buttonVariants } from "@/components/ui/button";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { cn } from "@/lib/utils";

export default async function AdminCategoriesPage() {
  const user = await getCurrentUser();
  const role = user!.role;
  const canManage = canManageCatalog(role);

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Catalog</p>
          <h1 className="mt-1 font-heading text-3xl">Categories</h1>
        </div>
        {canManage && (
          <Link href="/admin/categories/new" className={cn(buttonVariants(), "gap-1.5")}>
            <Plus className="h-4 w-4" /> New Category
          </Link>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Slug</th>
              <th className="p-3 font-medium">Products</th>
              <th className="p-3 font-medium">Status</th>
              {canManage && <th className="p-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const Icon = (Icons[c.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Package;
              return (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      {c.name}
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{c.slug}</td>
                  <td className="p-3">{c._count.products}</td>
                  <td className="p-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        c.published ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {c.published ? "Published" : "Unpublished"}
                    </span>
                  </td>
                  {canManage && (
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/categories/${c.id}/edit`} className="text-sm font-medium hover:underline">
                          Edit
                        </Link>
                        <DeleteCategoryButton categoryId={c.id} categoryName={c.name} />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
