"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { roomLinks, simpleNavLinks } from "@/lib/nav-data";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/data/types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted xl:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-heading text-xl">
            <Image src="/logo-icon.png" alt="MaxLight" width={28} height={28} className="rounded-md" />
            Max<span className="text-gold">Light</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-2 pb-6">
          <Accordion defaultValue={["shop"]} className="w-full">
            <AccordionItem value="shop">
              <AccordionTrigger className="px-2 text-base">Shop by Category</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-0.5 px-2">
                  {categories.map((c) => (
                    <SheetClose
                      key={c.id}
                      render={<Link href={`/shop?category=${c.slug}`} />}
                      className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      {c.name}
                    </SheetClose>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rooms">
              <AccordionTrigger className="px-2 text-base">Shop by Room</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-0.5 px-2">
                  {roomLinks.map((r) => (
                    <SheetClose
                      key={r.slug}
                      render={<Link href={`/shop?room=${r.slug}`} />}
                      className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      {r.name}
                    </SheetClose>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-2 flex flex-col gap-0.5 border-t border-border pt-2">
            {simpleNavLinks.map((l) => (
              <SheetClose
                key={l.href}
                render={<Link href={l.href} />}
                className="rounded-md px-4 py-2.5 text-base hover:bg-muted"
              >
                {l.name}
              </SheetClose>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 px-2">
            <SheetClose
              render={<Link href="/book-consultation" />}
              className={cn(buttonVariants({ variant: "default" }), "w-full bg-foreground")}
            >
              Book Consultation
            </SheetClose>
            <SheetClose
              render={<Link href="/quotation" />}
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Request Quotation
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
