export type EstimatorRoomType =
  | "living-room"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "office"
  | "restaurant"
  | "hotel"
  | "apartment"
  | "villa";

export type EstimatorTier = "budget" | "standard" | "premium";

export interface CostBreakdown {
  lighting: number;
  ceiling: number;
  wallDecor: number;
  electronics: number;
}

export const ROOM_TYPE_OPTIONS: { value: EstimatorRoomType; label: string }[] = [
  { value: "living-room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bathroom", label: "Bathroom" },
  { value: "office", label: "Office" },
  { value: "restaurant", label: "Restaurant" },
  { value: "hotel", label: "Hotel Room" },
  { value: "apartment", label: "Full Apartment" },
  { value: "villa", label: "Villa" },
];

export const TIER_OPTIONS: { value: EstimatorTier; label: string; description: string; multiplier: number }[] = [
  { value: "budget", label: "Budget Package", description: "Smart, functional choices that stretch your budget", multiplier: 0.55 },
  { value: "standard", label: "Standard Package", description: "Our most popular quality-to-price balance", multiplier: 1 },
  { value: "premium", label: "Premium Package", description: "Statement pieces and luxury finishes throughout", multiplier: 1.7 },
];

// Baseline "standard" tier cost per category, in KES
const BASE_COSTS: Record<EstimatorRoomType, CostBreakdown> = {
  "living-room": { lighting: 45000, ceiling: 30000, wallDecor: 20000, electronics: 90000 },
  bedroom: { lighting: 25000, ceiling: 20000, wallDecor: 15000, electronics: 40000 },
  kitchen: { lighting: 20000, ceiling: 18000, wallDecor: 8000, electronics: 120000 },
  bathroom: { lighting: 15000, ceiling: 12000, wallDecor: 6000, electronics: 25000 },
  office: { lighting: 30000, ceiling: 22000, wallDecor: 12000, electronics: 70000 },
  restaurant: { lighting: 120000, ceiling: 80000, wallDecor: 60000, electronics: 100000 },
  hotel: { lighting: 60000, ceiling: 40000, wallDecor: 25000, electronics: 110000 },
  apartment: { lighting: 110000, ceiling: 70000, wallDecor: 50000, electronics: 250000 },
  villa: { lighting: 260000, ceiling: 180000, wallDecor: 120000, electronics: 520000 },
};

export const CATEGORY_LABELS: Record<keyof CostBreakdown, string> = {
  lighting: "Lighting",
  ceiling: "Ceiling",
  wallDecor: "Wall Décor",
  electronics: "Electronics",
};

export interface EstimatorResult {
  breakdown: CostBreakdown;
  productSubtotal: number;
  installation: number;
  labour: number;
  transport: number;
  taxes: number;
  total: number;
}

const INSTALLATION_RATE = 0.08;
const LABOUR_RATE = 0.1;
const TRANSPORT_RATE = 0.03;
const VAT_RATE = 0.16;

export function calculateEstimate(roomType: EstimatorRoomType, tier: EstimatorTier): EstimatorResult {
  const base = BASE_COSTS[roomType];
  const multiplier = TIER_OPTIONS.find((t) => t.value === tier)!.multiplier;

  const breakdown: CostBreakdown = {
    lighting: Math.round(base.lighting * multiplier),
    ceiling: Math.round(base.ceiling * multiplier),
    wallDecor: Math.round(base.wallDecor * multiplier),
    electronics: Math.round(base.electronics * multiplier),
  };

  const productSubtotal = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  const installation = Math.round(productSubtotal * INSTALLATION_RATE);
  const labour = Math.round(productSubtotal * LABOUR_RATE);
  const transport = Math.round(productSubtotal * TRANSPORT_RATE);
  const taxes = Math.round((productSubtotal + installation + labour) * VAT_RATE);
  const total = productSubtotal + installation + labour + transport + taxes;

  return { breakdown, productSubtotal, installation, labour, transport, taxes, total };
}
