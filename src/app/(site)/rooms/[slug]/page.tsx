import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { RoomHotspotImage } from "@/components/rooms/room-hotspot-image";
import { AddRoomToCart } from "@/components/rooms/add-room-to-cart";
import { ProductCard } from "@/components/product/product-card";
import { getRoomBySlug } from "@/lib/data";
import { getAllClientProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) return {};
  return { title: room.title, description: room.description };
}

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) notFound();

  const products = await getAllClientProducts();
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const roomProducts = room.hotspots.map((h) => productMap[h.productId]).filter(Boolean);
  const total = roomProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="container-max py-10">
      <p className="text-sm text-muted-foreground">
        <Link href="/rooms" className="hover:underline">
          Inspiration Hub
        </Link>{" "}
        / {room.title}
      </p>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{room.style} &middot; {room.roomType.replace("-", " ")}</p>
          <h1 className="mt-1 font-heading text-3xl sm:text-4xl">{room.title}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{room.description}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <RoomHotspotImage room={room} products={productMap} />

        <div className="rounded-2xl border border-border p-5">
          <p className="font-heading text-lg">Shop This Room</p>
          <p className="mt-1 text-sm text-muted-foreground">{roomProducts.length} products in this design</p>

          <ul className="mt-4 space-y-3">
            {roomProducts.map((p) => (
              <li key={p.id}>
                <Link href={`/product/${p.slug}`} className="flex items-center gap-2 text-sm hover:underline">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span className="line-clamp-1 flex-1">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
            <span className="text-muted-foreground">Estimated total</span>
            <span className="font-semibold">
              {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(total)}
            </span>
          </div>

          <div className="mt-4">
            <AddRoomToCart productIds={roomProducts.map((p) => p.id)} roomTitle={room.title} />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 font-heading text-2xl">Products in This Room</h2>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
          {roomProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
