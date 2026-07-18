export const roomLinks = [
  { name: "Living Room", slug: "living-room", icon: "Sofa" },
  { name: "Bedroom", slug: "bedroom", icon: "BedDouble" },
  { name: "Kitchen", slug: "kitchen", icon: "CookingPot" },
  { name: "Dining Room", slug: "dining-room", icon: "UtensilsCrossed" },
  { name: "Office", slug: "office", icon: "Table2" },
  { name: "Bathroom", slug: "bathroom", icon: "Bath" },
  { name: "Outdoor", slug: "outdoor", icon: "TreePine" },
  { name: "Kids Room", slug: "kids-room", icon: "Blocks" },
] as const;

export const styleLinks = [
  { name: "Modern", slug: "modern" },
  { name: "Minimalist", slug: "minimalist" },
  { name: "Luxury", slug: "luxury" },
  { name: "Scandinavian", slug: "scandinavian" },
  { name: "Industrial", slug: "industrial" },
  { name: "Classic", slug: "classic" },
  { name: "Contemporary", slug: "contemporary" },
  { name: "African", slug: "african" },
  { name: "Bohemian", slug: "bohemian" },
  { name: "Rustic", slug: "rustic" },
] as const;

export const simpleNavLinks = [
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
] as const;
