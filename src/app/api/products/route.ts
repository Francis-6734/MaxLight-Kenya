import { NextResponse } from "next/server";
import { getAllClientProducts, getClientCategoriesWithSubcategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const [products, categories] = await Promise.all([
    getAllClientProducts(),
    getClientCategoriesWithSubcategories(),
  ]);
  return NextResponse.json({ products, categories });
}
