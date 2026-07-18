"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "./section-heading";
import type { Product } from "@/lib/data";

export function FeaturedProducts({
  products,
  heading,
}: {
  products: Product[];
  heading: { eyebrow: string; title: string; description: string };
}) {
  return (
    <section className="container-max py-20">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        description={heading.description}
        cta={{ label: "Shop all products", href: "/shop" }}
      />
      <Carousel opts={{ align: "start", loop: false }}>
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-[72%] sm:basis-[45%] lg:basis-[23%]">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-6 flex justify-end gap-2">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </section>
  );
}
