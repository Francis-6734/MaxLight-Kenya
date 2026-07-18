import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import { updateProductAction } from "@/lib/actions/product-actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, product.id);

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Catalog</p>
      <h1 className="mt-1 font-heading text-3xl">Edit Product</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          action={boundAction}
          initialValues={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            categoryId: product.categoryId,
            subcategory: product.subcategory,
            brand: product.brand,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            rooms: product.rooms ? product.rooms.split(",").filter(Boolean) : [],
            styles: product.styles ? product.styles.split(",").filter(Boolean) : [],
            highlights: product.highlights,
            inStock: product.inStock,
            isNew: product.isNew,
            isFeatured: product.isFeatured,
            placeholderGrad: product.placeholderGrad,
            placeholderIcon: product.placeholderIcon,
            images: product.images,
          }}
        />
      </div>
    </div>
  );
}
