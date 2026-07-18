import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { ProductCard } from "@/components/product/product-card";
import { getClientProductBySlug, getRelatedClientProducts, getClientCategories } from "@/lib/catalog";
import { formatKES, slugToLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getClientProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getClientProductBySlug(slug);
  if (!product) notFound();

  const [categories, related] = await Promise.all([getClientCategories(), getRelatedClientProducts(product)]);
  const category = categories.find((c) => c.slug === product.category);
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="container-max py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/shop" />}>Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/shop?category=${product.category}`} />}>
              {category?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery placeholder={product.placeholder} images={product.images ?? []} name={product.name} />

        <div>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <h1 className="mt-1 font-heading text-3xl text-balance">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={i < Math.round(product.rating) ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4 text-muted"}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-3xl font-semibold">{formatKES(product.price)}</span>
            {onSale && (
              <span className="text-lg text-muted-foreground line-through">
                {formatKES(product.compareAtPrice as number)}
              </span>
            )}
            {onSale && (
              <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-medium text-gold-foreground">
                Save {formatKES((product.compareAtPrice as number) - product.price)}
              </span>
            )}
          </div>

          <p className="mt-5 text-muted-foreground">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <ProductActions product={product} />
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 rounded-xl border border-border p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 shrink-0 text-gold" /> Delivery in 3–7 days
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 shrink-0 text-gold" /> 2-year warranty
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4 shrink-0 text-gold" /> 7-day returns
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            <TabsTrigger value="qa">Questions & Answers</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="max-w-3xl py-6 text-sm text-muted-foreground">
            <p>{product.description}</p>
            <p className="mt-4">
              Category: <span className="text-foreground">{category?.name}</span> &middot; Subcategory:{" "}
              <span className="text-foreground">{slugToLabel(product.subcategory)}</span> &middot; Brand:{" "}
              <span className="text-foreground">{product.brand}</span>
            </p>
          </TabsContent>
          <TabsContent value="reviews" className="max-w-3xl space-y-5 py-6">
            {[
              { name: "Wanjiku M.", rating: 5, text: "Exactly as described, installation team was excellent." },
              { name: "David K.", rating: 4, text: "Great quality for the price. Delivery took a bit longer than expected." },
            ].map((r) => (
              <div key={r.name} className="border-b border-border pb-5 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={i < r.rating ? "h-3.5 w-3.5 fill-gold text-gold" : "h-3.5 w-3.5 text-muted"} />
                    ))}
                  </div>
                  <p className="text-sm font-medium">{r.name}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="qa" className="max-w-3xl py-6 text-sm text-muted-foreground">
            No questions yet.{" "}
            <Link href="/contact" className="text-foreground underline underline-offset-2">
              Ask our team
            </Link>{" "}
            about this product.
          </TabsContent>
        </Tabs>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-heading text-2xl">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
