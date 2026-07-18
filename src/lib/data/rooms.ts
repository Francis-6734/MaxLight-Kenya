import type { InspirationRoom } from "./types";

export const inspirationRooms: InspirationRoom[] = [
  {
    id: "room-serengeti-living",
    slug: "serengeti-luxury-living-room",
    title: "Serengeti Luxury Living Room",
    roomType: "living-room",
    style: "luxury",
    description:
      "Deep modular seating, warm brass lighting and a marble coffee table come together for a living room that feels both grand and liveable.",
    placeholder: { gradient: "from-amber-100 via-stone-50 to-white", icon: "Sofa" },
    hotspots: [
      { productId: "p-sofa-serengeti", x: 32, y: 62 },
      { productId: "p-chandelier-aurelia", x: 50, y: 14 },
      { productId: "p-coffee-table-loop", x: 46, y: 74 },
      { productId: "p-tv-stand-linear", x: 78, y: 48 },
      { productId: "p-canvas-savanna-set", x: 18, y: 30 },
    ],
  },
  {
    id: "room-nordic-bedroom",
    slug: "nordic-bedroom-retreat",
    title: "Nordic Bedroom Retreat",
    roomType: "bedroom",
    style: "scandinavian",
    description:
      "Soft neutrals, natural light and warm layered lighting create a calm Scandinavian-inspired bedroom sanctuary.",
    placeholder: { gradient: "from-stone-200 via-stone-50 to-white", icon: "BedDouble" },
    hotspots: [
      { productId: "p-bed-amara", x: 48, y: 58 },
      { productId: "p-wall-sconce-mono", x: 20, y: 32 },
      { productId: "p-wardrobe-nova", x: 84, y: 46 },
      { productId: "p-curtains-velora", x: 12, y: 20 },
    ],
  },
  {
    id: "room-minimalist-kitchen",
    slug: "modern-minimalist-kitchen",
    title: "Modern Minimalist Kitchen",
    roomType: "kitchen",
    style: "minimalist",
    description:
      "Handleless fitted cabinetry, a woven pendant and integrated water purification make this kitchen as functional as it is beautiful.",
    placeholder: { gradient: "from-emerald-100 via-stone-50 to-white", icon: "CookingPot" },
    hotspots: [
      { productId: "p-kitchen-cabinet-modula", x: 50, y: 60 },
      { productId: "p-purifier-pure", x: 74, y: 70 },
      { productId: "p-cooker-hearth", x: 30, y: 68 },
      { productId: "p-pendant-nairobi", x: 58, y: 20 },
    ],
  },
  {
    id: "room-executive-office",
    slug: "executive-home-office",
    title: "Executive Home Office",
    roomType: "office",
    style: "industrial",
    description:
      "A walnut executive desk, layered lighting and smart voice control turn a spare room into a serious workspace.",
    placeholder: { gradient: "from-neutral-300 via-stone-50 to-white", icon: "Table2" },
    hotspots: [
      { productId: "p-office-desk-atlas", x: 46, y: 62 },
      { productId: "p-ceiling-halo", x: 50, y: 12 },
      { productId: "p-blinds-linea", x: 82, y: 34 },
      { productId: "p-speaker-echodot", x: 20, y: 58 },
    ],
  },
  {
    id: "room-spa-bathroom",
    slug: "spa-bathroom-sanctuary",
    title: "Spa Bathroom Sanctuary",
    roomType: "bathroom",
    style: "luxury",
    description:
      "A floating vanity, backlit mirror and instant hot water combine for a hotel-spa feeling every single morning.",
    placeholder: { gradient: "from-sky-100 via-slate-50 to-white", icon: "Bath" },
    hotspots: [
      { productId: "p-vanity-serene", x: 42, y: 60 },
      { productId: "p-mirror-luma", x: 42, y: 28 },
      { productId: "p-heater-rapidflow", x: 78, y: 66 },
    ],
  },
  {
    id: "room-african-dining",
    slug: "african-contemporary-dining",
    title: "African Contemporary Dining Room",
    roomType: "dining-room",
    style: "african",
    description:
      "Handwoven textures, a solid oak table and an artisan wool rug celebrate East African craft in a contemporary setting.",
    placeholder: { gradient: "from-orange-100 via-amber-50 to-white", icon: "UtensilsCrossed" },
    hotspots: [
      { productId: "p-dining-set-kilimani", x: 48, y: 58 },
      { productId: "p-pendant-nairobi", x: 48, y: 16 },
      { productId: "p-rug-atlas-wool", x: 50, y: 82 },
      { productId: "p-canvas-savanna-set", x: 84, y: 34 },
    ],
  },
];

export function getRoomBySlug(slug: string) {
  return inspirationRooms.find((r) => r.slug === slug);
}
