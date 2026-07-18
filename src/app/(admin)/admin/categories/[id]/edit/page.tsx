import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CategoryForm } from "@/components/admin/category-form";
import { updateCategoryAction } from "@/lib/actions/category-actions";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await db.category.findUnique({ where: { id } });
  if (!category) notFound();

  const boundAction = updateCategoryAction.bind(null, category.id);

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Catalog</p>
      <h1 className="mt-1 font-heading text-3xl">Edit Category</h1>
      <div className="mt-6">
        <CategoryForm action={boundAction} initialValues={category} />
      </div>
    </div>
  );
}
