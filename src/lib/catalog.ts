import { db } from "@/lib/db";
import { slugToLabel } from "@/lib/format";
import type { Category as DbCategory, Product as DbProduct } from "@/generated/prisma/client";
import type { Category, Product, RoomType, DesignStyle, Subcategory } from "@/lib/data/types";

type DbProductWithCategory = DbProduct & { category: DbCategory };

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function toClientProduct(product: DbProductWithCategory): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category.slug,
    subcategory: product.subcategory,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? undefined,
    currency: "KES",
    rating: product.rating,
    reviewCount: product.reviewCount,
    rooms: splitCsv(product.rooms) as RoomType[],
    styles: splitCsv(product.styles) as DesignStyle[],
    description: product.description,
    highlights: splitLines(product.highlights),
    inStock: product.inStock,
    brand: product.brand,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    placeholder: { gradient: product.placeholderGrad, icon: product.placeholderIcon },
    images: product.images,
    imageUrl: product.images[0] ?? null,
  };
}

export function toClientCategory(category: DbCategory, subcategories: Subcategory[] = []): Category {
  return {
    id: category.slug,
    name: category.name,
    slug: category.slug,
    description: category.description,
    subcategories,
    placeholder: { gradient: category.gradient, icon: category.icon },
    imageUrl: category.imageUrl,
  };
}

const productInclude = { category: true } as const;

export async function getAllClientProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { category: { published: true } },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toClientProduct);
}

export async function getClientProductBySlug(slug: string): Promise<Product | null> {
  const row = await db.product.findFirst({ where: { slug, category: { published: true } }, include: productInclude });
  return row ? toClientProduct(row) : null;
}

export async function getFeaturedClientProducts(limit = 8): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { isFeatured: true, category: { published: true } },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toClientProduct);
}

export async function getRelatedClientProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { category: { slug: product.category, published: true }, id: { not: product.id } },
    include: productInclude,
    take: limit,
  });
  return rows.map(toClientProduct);
}

export async function getClientCategories(): Promise<Category[]> {
  const rows = await db.category.findMany({ where: { published: true }, orderBy: { name: "asc" } });
  return rows.map((c) => toClientCategory(c));
}

/**
 * Categories with subcategories derived from distinct product.subcategory
 * values per category — the Category model itself has no subcategories
 * field, and adding admin UI for a third-level taxonomy is out of scope.
 */
export async function getClientCategoriesWithSubcategories(): Promise<Category[]> {
  const [dbCategories, products] = await Promise.all([
    db.category.findMany({ where: { published: true }, orderBy: { name: "asc" } }),
    db.product.findMany({ select: { categoryId: true, subcategory: true } }),
  ]);

  const subsByCategory = new Map<string, Map<string, Subcategory>>();
  for (const p of products) {
    if (!p.subcategory) continue;
    const slug = p.subcategory.toLowerCase().replace(/\s+/g, "-");
    const map = subsByCategory.get(p.categoryId) ?? new Map<string, Subcategory>();
    if (!map.has(slug)) map.set(slug, { name: slugToLabel(slug), slug });
    subsByCategory.set(p.categoryId, map);
  }

  return dbCategories.map((c) => toClientCategory(c, Array.from(subsByCategory.get(c.id)?.values() ?? [])));
}
