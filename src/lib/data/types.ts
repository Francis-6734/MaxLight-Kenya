export type Currency = "KES";

/** Category slug — categories are admin-managed, so this is an open string, not a fixed union. */
export type ProductCategory = string;

export type RoomType =
  | "living-room"
  | "bedroom"
  | "kitchen"
  | "dining-room"
  | "office"
  | "bathroom"
  | "outdoor"
  | "kids-room";

export type DesignStyle =
  | "modern"
  | "minimalist"
  | "luxury"
  | "scandinavian"
  | "industrial"
  | "classic"
  | "contemporary"
  | "african"
  | "bohemian"
  | "rustic";

export interface Placeholder {
  /** Tailwind gradient classes for the artwork */
  gradient: string;
  /** lucide-react icon name, resolved by <ImagePlaceholder /> */
  icon: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  currency: Currency;
  rating: number;
  reviewCount: number;
  rooms: RoomType[];
  styles: DesignStyle[];
  description: string;
  highlights: string[];
  inStock: boolean;
  brand: string;
  isNew?: boolean;
  isFeatured?: boolean;
  placeholder: Placeholder;
  /** All uploaded photos, in display order. Always populated for DB-backed products; optional here since mock catalog entries don't have real photos. */
  images?: string[];
  /** Convenience accessor — same as images[0], for callers that only show one photo. */
  imageUrl?: string | null;
}

export interface Subcategory {
  name: string;
  slug: string;
}

export interface Category {
  id: ProductCategory;
  name: string;
  slug: string;
  description: string;
  subcategories: Subcategory[];
  placeholder: Placeholder;
  imageUrl?: string | null;
}

export interface RoomHotspot {
  productId: string;
  x: number; // percentage from left
  y: number; // percentage from top
}

export interface InspirationRoom {
  id: string;
  slug: string;
  title: string;
  roomType: RoomType;
  style: DesignStyle;
  description: string;
  placeholder: Placeholder;
  hotspots: RoomHotspot[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  completionDate: string;
  servicesDelivered: string[];
  clientTestimonial?: string;
  clientName?: string;
  placeholder: Placeholder;
}

export interface Designer {
  id: string;
  slug: string;
  name: string;
  position: string;
  experience: string;
  specialization: string;
  bio: string;
  languages: string[];
  placeholder: Placeholder;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  placeholder: Placeholder;
  body: string[];
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}
