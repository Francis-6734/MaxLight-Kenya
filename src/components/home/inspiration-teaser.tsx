import Link from "next/link";
import { Plus } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { inspirationRooms } from "@/lib/data";

export function InspirationTeaser({ heading }: { heading: { eyebrow: string; title: string; description: string } }) {
  const rooms = inspirationRooms.slice(0, 3);

  return (
    <section className="container-max py-20">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        description={heading.description}
        cta={{ label: "Explore Inspiration Hub", href: "/rooms" }}
      />
      <div className="grid gap-5 sm:grid-cols-3">
        {rooms.map((room, i) => (
          <Reveal key={room.id} delay={i * 0.08}>
            <Link href={`/rooms/${room.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <ImagePlaceholder
                  gradient={room.placeholder.gradient}
                  icon={room.placeholder.icon}
                  className="transition-transform duration-500 group-hover:scale-105"
                  iconClassName="hidden"
                />
                {room.hotspots.slice(0, 4).map((h, idx) => (
                  <span
                    key={idx}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md ring-4 ring-white/30"
                  >
                    <Plus className="h-3 w-3 text-foreground" strokeWidth={2} />
                  </span>
                ))}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-xs tracking-wide text-white/70 uppercase">{room.style}</p>
                  <p className="font-heading text-lg text-white">{room.title}</p>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
