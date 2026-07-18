import Link from "next/link";
import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { inspirationRooms } from "@/lib/data";

export const metadata: Metadata = {
  title: "Inspiration Hub",
  description:
    "Browse complete room designs from MaxLight Kenya. Every item is tagged — shop the whole look in one click.",
};

export default function RoomsPage() {
  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Inspiration Hub</p>
        <h1 className="font-heading text-4xl text-balance">Shop the Look, Not Just the Product</h1>
        <p className="mt-3 text-muted-foreground">
          Every room below is fully tagged. Click any item to view it, or add the entire room to your cart in one
          go.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {inspirationRooms.map((room) => (
          <Link key={room.id} href={`/rooms/${room.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <ImagePlaceholder
                gradient={room.placeholder.gradient}
                icon={room.placeholder.icon}
                className="transition-transform duration-500 group-hover:scale-105"
                iconClassName="hidden"
              />
              <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                {room.hotspots.length} items
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-xs tracking-wide text-white/70 uppercase">{room.style}</p>
                <p className="font-heading text-lg text-white">{room.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
