import type { Service } from "./types";

export const services: Service[] = [
  {
    id: "service-interior-design",
    slug: "interior-design",
    name: "Interior Design",
    description: "Full-service interior design for homes, offices, hotels and restaurants.",
    icon: "PencilRuler",
  },
  {
    id: "service-lighting-design",
    slug: "lighting-design",
    name: "Lighting Design",
    description: "Layered lighting schemes designed to transform how each room feels.",
    icon: "Lightbulb",
  },
  {
    id: "service-kitchen-design",
    slug: "kitchen-design",
    name: "Kitchen Design",
    description: "Custom-measured kitchen design, cabinetry and installation.",
    icon: "CookingPot",
  },
  {
    id: "service-office-design",
    slug: "office-design",
    name: "Office Design",
    description: "Workspace design that balances productivity, brand and comfort.",
    icon: "Briefcase",
  },
  {
    id: "service-space-planning",
    slug: "space-planning",
    name: "Space Planning",
    description: "Smart floor plans that make every square metre work harder.",
    icon: "Ruler",
  },
  {
    id: "service-electrical",
    slug: "electrical-installation",
    name: "Electrical Installation",
    description: "Licensed electrical installation for lighting, sockets and smart systems.",
    icon: "Plug",
  },
  {
    id: "service-smart-home",
    slug: "smart-home-installation",
    name: "Smart Home Installation",
    description: "Smart locks, cameras, switches and full home automation setup.",
    icon: "Home",
  },
  {
    id: "service-cctv",
    slug: "cctv-installation",
    name: "CCTV Installation",
    description: "Full-property CCTV design, supply and installation.",
    icon: "Camera",
  },
  {
    id: "service-renovation",
    slug: "home-renovation",
    name: "Home Renovation",
    description: "End-to-end renovation project management, from concept to handover.",
    icon: "Building2",
  },
  {
    id: "service-maintenance",
    slug: "maintenance",
    name: "Maintenance",
    description: "Ongoing maintenance plans for lighting, electronics and smart home systems.",
    icon: "ShieldCheck",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
