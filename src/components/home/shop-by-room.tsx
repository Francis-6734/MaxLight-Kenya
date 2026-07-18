import Link from "next/link";
import * as Icons from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";
import { roomLinks } from "@/lib/nav-data";

export function ShopByRoom({ heading }: { heading: { eyebrow: string; title: string; description: string } }) {
  return (
    <section className="bg-secondary/60 py-20">
      <div className="container-max">
        <SectionHeading eyebrow={heading.eyebrow} title={heading.title} description={heading.description} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {roomLinks.map((room, i) => {
            const Icon = (Icons[room.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Home;
            return (
              <Reveal key={room.slug} delay={i * 0.04}>
                <Link
                  href={`/shop?room=${room.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-transparent bg-background p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-border hover:shadow-md"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-gold/30">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span className="text-sm font-medium">{room.name}</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
