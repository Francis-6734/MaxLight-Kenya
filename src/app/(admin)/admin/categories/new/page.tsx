import { CategoryForm } from "@/components/admin/category-form";
import { createCategoryAction } from "@/lib/actions/category-actions";

export default function NewCategoryPage() {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Catalog</p>
      <h1 className="mt-1 font-heading text-3xl">New Category</h1>
      <div className="mt-6">
        <CategoryForm action={createCategoryAction} />
      </div>
    </div>
  );
}
