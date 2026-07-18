"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Upload,
  Camera,
  VideoOff,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Trash2,
  Save,
  Share2,
  ShoppingBag,
  ImagePlus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductPalette } from "@/components/room-visualizer/product-palette";
import { PlacedItem, type PlacedItemData } from "@/components/room-visualizer/placed-item";
import { usePersistedState } from "@/lib/store/use-persisted-state";
import { useCart } from "@/lib/store/cart-context";
import { useProductCatalog } from "@/components/providers/product-catalog-provider";
import type { Product } from "@/lib/data";
import { fileToResizedDataUrl, videoFrameToDataUrl } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

interface SavedDesign {
  id: string;
  createdAt: string;
  roomImage: string;
  items: PlacedItemData[];
}

export default function RoomVisualizerPage() {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<PlacedItemData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [savedDesigns, setSavedDesigns] = usePersistedState<SavedDesign[]>("maxlight:room-designs", []);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addItems } = useCart();
  const { getProduct } = useProductCatalog();
  const selectedItem = placedItems.find((i) => i.id === selectedId) ?? null;
  const selectedProduct = selectedItem ? getProduct(selectedItem.productId) : null;

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setRoomImage(dataUrl);
      setPlacedItems([]);
    } catch {
      toast.error("Could not read that image. Please try another file.");
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setCameraOn(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      toast.error("Camera access was denied or is unavailable on this device.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    const dataUrl = videoFrameToDataUrl(videoRef.current);
    setRoomImage(dataUrl);
    setPlacedItems([]);
    stopCamera();
  }

  function addProduct(product: Product) {
    const id = `${product.id}-${Date.now()}`;
    setPlacedItems((prev) => [...prev, { id, productId: product.id, x: 50, y: 50, scale: 1, rotation: 0 }]);
    setSelectedId(id);
  }

  function updateSelected(patch: Partial<PlacedItemData>) {
    if (!selectedId) return;
    setPlacedItems((prev) => prev.map((i) => (i.id === selectedId ? { ...i, ...patch } : i)));
  }

  function removeSelected() {
    if (!selectedId) return;
    setPlacedItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  }

  function saveDesign() {
    if (!roomImage) {
      toast.error("Upload or capture a room photo first");
      return;
    }
    const design: SavedDesign = {
      id: `design-${Date.now()}`,
      createdAt: new Date().toISOString(),
      roomImage,
      items: placedItems,
    };
    setSavedDesigns((prev) => [design, ...prev].slice(0, 8));
    toast.success("Room design saved");
  }

  function loadDesign(design: SavedDesign) {
    setRoomImage(design.roomImage);
    setPlacedItems(design.items);
    setSelectedId(null);
    toast.success("Design loaded");
  }

  function shareDesign() {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    toast.success("Design link copied to clipboard");
  }

  function addAllToCart() {
    if (placedItems.length === 0) {
      toast.error("Place at least one product first");
      return;
    }
    addItems(placedItems.map((i) => i.productId));
    toast.success(`Added ${placedItems.length} placed items to your cart`);
  }

  return (
    <div className="container-max py-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Visualize It First</p>
        <h1 className="font-heading text-4xl text-balance">Room Visualizer</h1>
        <p className="mt-3 text-muted-foreground">
          Upload a photo of your room — or use your camera — and place lighting, décor and smart home products to see
          how they&rsquo;ll look before you buy.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-3.5 w-3.5" /> Upload Room Photo
            </Button>
            {cameraOn ? (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={stopCamera}>
                <VideoOff className="h-3.5 w-3.5" /> Stop Camera
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={startCamera}>
                <Camera className="h-3.5 w-3.5" /> Use Live Camera
              </Button>
            )}
          </div>

          <div
            ref={containerRef}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-secondary/40"
            onPointerDown={() => setSelectedId(null)}
          >
            {cameraOn ? (
              <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
            ) : roomImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- user-provided data URL, not an optimizable static asset
              <img src={roomImage} alt="Your room" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <ImagePlus className="h-8 w-8" strokeWidth={1.25} />
                <p className="text-sm">Upload a photo or use your camera to get started</p>
              </div>
            )}

            {!cameraOn &&
              roomImage &&
              placedItems.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                return (
                  <PlacedItem
                    key={item.id}
                    item={item}
                    product={product}
                    containerRef={containerRef}
                    isSelected={selectedId === item.id}
                    onSelect={() => setSelectedId(item.id)}
                    onMove={(x, y) => setPlacedItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, x, y } : i)))}
                  />
                );
              })}
          </div>

          {cameraOn && (
            <Button size="lg" className="mt-3 w-full gap-2" onClick={capturePhoto}>
              <Camera className="h-4 w-4" /> Capture Photo
            </Button>
          )}

          {selectedItem && selectedProduct && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3">
              <p className="text-sm font-medium">{selectedProduct.name}</p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => updateSelected({ rotation: selectedItem.rotation - 15 })} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted" aria-label="Rotate left">
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button onClick={() => updateSelected({ rotation: selectedItem.rotation + 15 })} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted" aria-label="Rotate right">
                  <RotateCw className="h-4 w-4" />
                </button>
                <button onClick={() => updateSelected({ scale: Math.max(0.4, selectedItem.scale - 0.15) })} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted" aria-label="Shrink">
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button onClick={() => updateSelected({ scale: Math.min(2.5, selectedItem.scale + 0.15) })} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted" aria-label="Enlarge">
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button onClick={removeSelected} className="flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10" aria-label="Remove item">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" className="gap-1.5" onClick={saveDesign}>
              <Save className="h-4 w-4" /> Save Design
            </Button>
            <Button variant="outline" className="gap-1.5" onClick={shareDesign}>
              <Share2 className="h-4 w-4" /> Share Design
            </Button>
            <Button className="gap-1.5" onClick={addAllToCart}>
              <ShoppingBag className="h-4 w-4" /> Add Placed Items to Cart ({placedItems.length})
            </Button>
          </div>

          {savedDesigns.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold">Your Saved Designs</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {savedDesigns.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => loadDesign(d)}
                    className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- stored user data URL thumbnail */}
                    <img src={d.roomImage} alt="Saved room design" className="h-full w-full object-cover" />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                      {d.items.length} items
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={cn(!roomImage && "pointer-events-none opacity-40")}>
          <ProductPalette onAdd={addProduct} />
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Want a professional to do this for you instead?{" "}
        <Link href="/book-consultation" className="font-medium text-foreground underline underline-offset-2">
          Book a free consultation
        </Link>
      </p>
    </div>
  );
}
