"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Share2, Gift, Check } from "lucide-react";
import { toast } from "sonner";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Button } from "@/components/ui/button";
import { useProductCatalog } from "@/components/providers/product-catalog-provider";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";

const REGISTRY_PRODUCT_IDS = [
  "p-fridge-glacier",
  "p-tv-samsung-qled",
  "p-chandelier-aurelia",
  "p-washer-clearwash",
  "p-cctv-sentinel",
  "p-purifier-pure",
  "p-mirror-sunburst",
  "p-home-theatre-boom",
];

export default function WeddingRegistryPreviewPage() {
  const { getProduct, loading } = useProductCatalog();
  const registryProducts = REGISTRY_PRODUCT_IDS.map((id) => getProduct(id)).filter((p): p is NonNullable<typeof p> => !!p);
  const [purchased, setPurchased] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (registryProducts.length > 3) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- seeds the demo "already contributed" state once the catalog has loaded
      setPurchased(new Set([registryProducts[0].id, registryProducts[3].id]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading) {
    return <div className="container-max py-24 text-center text-muted-foreground">Loading registry...</div>;
  }

  const percentFulfilled = registryProducts.length
    ? Math.round((purchased.size / registryProducts.length) * 100)
    : 0;

  const togglePurchased = (id: string, name: string) => {
    setPurchased((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        toast.success(`Thank you for contributing ${name}!`);
      }
      return next;
    });
  };

  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Wedding Registry</p>
        <h1 className="font-heading text-4xl text-balance">Sarah &amp; James</h1>
        <p className="mt-2 text-muted-foreground">Celebrating our wedding on 14 November 2026</p>
        <p className="mt-4 text-muted-foreground">
          Thank you for being part of our journey. If you&rsquo;d like to help us furnish our first home together,
          we&rsquo;ve added a few things we&rsquo;d love below.
        </p>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href).catch(() => {});
            toast.success("Registry link copied to clipboard");
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-foreground/30"
        >
          <Share2 className="h-4 w-4" /> Share This Registry
        </button>
      </div>

      <div className="mx-auto mt-10 max-w-md">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Registry progress</span>
          <span className="font-medium">{percentFulfilled}% fulfilled</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${percentFulfilled}%` }} />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {registryProducts.map((product) => {
          const isPurchased = purchased.has(product.id);
          return (
            <div key={product.id} className="flex flex-col">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                <ImagePlaceholder gradient={product.placeholder.gradient} icon={product.placeholder.icon} image={product.imageUrl} />
                {isPurchased && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium">
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Contributed
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex-1">
                <Link href={`/product/${product.slug}`} className="line-clamp-1 text-sm font-medium hover:underline">
                  {product.name}
                </Link>
                <p className="mt-1 text-sm font-semibold">{formatKES(product.price)}</p>
              </div>
              <Button
                size="sm"
                variant={isPurchased ? "outline" : "default"}
                className="mt-3 gap-1.5"
                onClick={() => togglePurchased(product.id, product.name)}
              >
                <Gift className="h-3.5 w-3.5" />
                {isPurchased ? "Contributed" : "Contribute This Gift"}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-14 text-center">
        <p className={cn("text-sm text-muted-foreground")}>
          Want a registry like this?{" "}
          <Link href="/wedding-registry" className="font-medium text-foreground underline underline-offset-2">
            Create your own
          </Link>
        </p>
      </div>
    </div>
  );
}
