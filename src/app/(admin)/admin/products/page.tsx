import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { canManageCatalog } from "@/lib/auth/roles";
import { formatKES } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { cn } from "@/lib/utils";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const user = await getCurrentUser();
  const role = user!.role;
  const canManage = canManageCatalog(role);

  const products = await db.product.findMany({
    where: q
      ? {
          OR: [{ name: { contains: q } }, { slug: { contains: q } }, { brand: { contains: q } }],
        }
      : undefined,
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Catalog</p>
          <h1 className="mt-1 font-heading text-3xl">Products</h1>
        </div>
        {canManage && (
          <Link href="/admin/products/new" className={cn(buttonVariants(), "gap-1.5")}>
            <Plus className="h-4 w-4" /> New Product
          </Link>
        )}
      </div>

      <form className="mt-6 max-w-sm">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search products..."
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-foreground/30"
          />
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Product</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Flags</th>
              {canManage && <th className="p-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <p className="line-clamp-1 font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.brand}</p>
                </td>
                <td className="p-3 text-muted-foreground">{p.category.name}</td>
                <td className="p-3">{formatKES(p.price)}</td>
                <td className="p-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", p.inStock ? "bg-emerald-100 text-emerald-700" : "bg-destructive/10 text-destructive")}>
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="p-3 text-xs text-muted-foreground">
                  {[p.isNew && "New", p.isFeatured && "Featured"].filter(Boolean).join(", ") || "—"}
                </td>
                {canManage && (
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${p.id}/edit`} className="text-sm font-medium hover:underline">
                        Edit
                      </Link>
                      <DeleteProductButton productId={p.id} productName={p.name} />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No products found.</p>}
      </div>
    </div>
  );
}
