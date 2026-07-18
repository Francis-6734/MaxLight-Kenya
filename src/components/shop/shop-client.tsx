"use client";

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterPanel } from "./filter-panel";
import { ProductCard } from "@/components/product/product-card";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useProductCatalog } from "@/components/providers/product-catalog-provider";
import { roomLinks, styleLinks } from "@/lib/nav-data";

function parseList(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

export function ShopClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { products: allProducts, categories, loading } = useProductCatalog();
  const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

  const selectedCategories = useMemo(() => parseList(searchParams.get("category")), [searchParams]);
  const selectedRooms = useMemo(() => parseList(searchParams.get("room")), [searchParams]);
  const selectedStyles = useMemo(() => parseList(searchParams.get("style")), [searchParams]);
  const sort = searchParams.get("sort") ?? "featured";
  const query = searchParams.get("q") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string[] | string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const filtered = useMemo(() => {
    let result = allProducts.filter((p) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedRooms.length > 0 && !p.rooms.some((r) => selectedRooms.includes(r))) return false;
      if (selectedStyles.length > 0 && !p.styles.some((s) => selectedStyles.includes(s))) return false;
      if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

    return result;
  }, [allProducts, selectedCategories, selectedRooms, selectedStyles, query, sort]);

  const heading =
    selectedCategories.length === 1 ? getCategoryBySlug(selectedCategories[0])?.name ?? "Shop" : "All Products";

  const activeFilterChips = [
    ...selectedCategories.map((c) => ({ type: "category" as const, slug: c, label: getCategoryBySlug(c)?.name ?? c })),
    ...selectedRooms.map((r) => ({ type: "room" as const, slug: r, label: roomLinks.find((x) => x.slug === r)?.name ?? r })),
    ...selectedStyles.map((s) => ({ type: "style" as const, slug: s, label: styleLinks.find((x) => x.slug === s)?.name ?? s })),
  ];

  const filterPanelProps = {
    categories,
    selectedCategories,
    selectedRooms,
    selectedStyles,
    onToggleCategory: (slug: string) => updateParams({ category: toggleInList(selectedCategories, slug) }),
    onToggleRoom: (slug: string) => updateParams({ room: toggleInList(selectedRooms, slug) }),
    onToggleStyle: (slug: string) => updateParams({ style: toggleInList(selectedStyles, slug) }),
    onClear: () => updateParams({ category: null, room: null, style: null }),
  };

  if (loading) {
    return <div className="container-max py-24 text-center text-muted-foreground">Loading products...</div>;
  }

  return (
    <div className="container-max py-10">
      <div className="mb-8">
        <p className="text-xs text-muted-foreground">
          {categories.length} categories &middot; {allProducts.length} products
        </p>
        <h1 className="mt-1 font-heading text-3xl sm:text-4xl">{heading}</h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel {...filterPanelProps} />
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </SheetTrigger>
                <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-sm">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-6">
                    <FilterPanel {...filterPanelProps} />
                  </div>
                </SheetContent>
              </Sheet>
              <p className="text-sm text-muted-foreground">{filtered.length} results</p>
            </div>

            <Select
              value={sort}
              onValueChange={(v) => v && updateParams({ sort: v })}
              items={{
                featured: "Featured",
                newest: "Newest",
                "price-asc": "Price: Low to High",
                "price-desc": "Price: High to Low",
                rating: "Top Rated",
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {activeFilterChips.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {activeFilterChips.map((chip) => (
                <Badge key={`${chip.type}-${chip.slug}`} variant="secondary" className="gap-1 pr-1.5">
                  {chip.label}
                  <button
                    onClick={() => {
                      if (chip.type === "category") updateParams({ category: toggleInList(selectedCategories, chip.slug) });
                      if (chip.type === "room") updateParams({ room: toggleInList(selectedRooms, chip.slug) });
                      if (chip.type === "style") updateParams({ style: toggleInList(selectedStyles, chip.slug) });
                    }}
                    className="rounded-full p-0.5 hover:bg-foreground/10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-24 text-center">
              <p className="font-medium">No products match your filters.</p>
              <button onClick={filterPanelProps.onClear} className="text-sm text-muted-foreground hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
