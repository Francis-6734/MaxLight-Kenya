import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "@/lib/actions/product-actions";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Catalog</p>
      <h1 className="mt-1 font-heading text-3xl">New Product</h1>
      <div className="mt-6">
        <ProductForm categories={categories} action={createProductAction} />
      </div>
    </div>
  );
}
