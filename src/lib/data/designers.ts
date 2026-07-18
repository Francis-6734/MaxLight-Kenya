import type { Designer } from "./types";

export const designers: Designer[] = [
  {
    id: "designer-amina",
    slug: "amina-hassan",
    name: "Amina Hassan",
    position: "Head of Interior Design",
    experience: "14 years",
    specialization: "Luxury residential & hospitality interiors",
    bio: "Amina leads the MaxLight design studio, blending East African craft with contemporary luxury for homes and hotels across the region.",
    languages: ["English", "Swahili"],
    placeholder: { gradient: "from-amber-100 via-stone-50 to-white", icon: "PencilRuler" },
  },
  {
    id: "designer-brian",
    slug: "brian-otieno",
    name: "Brian Otieno",
    position: "Lighting Design Lead",
    experience: "9 years",
    specialization: "Lighting design & smart home integration",
    bio: "Brian designs layered lighting schemes that transform how a space feels — from statement chandeliers to invisible smart systems.",
    languages: ["English", "Swahili"],
    placeholder: { gradient: "from-slate-200 via-stone-50 to-white", icon: "Lightbulb" },
  },
  {
    id: "designer-cynthia",
    slug: "cynthia-wanjiru",
    name: "Cynthia Wanjiru",
    position: "Senior Interior Designer",
    experience: "7 years",
    specialization: "Kitchens, bathrooms & space planning",
    bio: "Cynthia specialises in turning tight, awkward spaces into functional, beautiful kitchens and bathrooms.",
    languages: ["English", "Swahili", "French"],
    placeholder: { gradient: "from-rose-100 via-stone-50 to-white", icon: "Ruler" },
  },
  {
    id: "designer-daniel",
    slug: "daniel-kiptoo",
    name: "Daniel Kiptoo",
    position: "Project Manager",
    experience: "11 years",
    specialization: "Renovation & large-scale project delivery",
    bio: "Daniel oversees MaxLight's installation and renovation projects end-to-end, keeping every project on time and on budget.",
    languages: ["English", "Swahili"],
    placeholder: { gradient: "from-stone-300 via-stone-100 to-white", icon: "Briefcase" },
  },
];

export function getDesignerBySlug(slug: string) {
  return designers.find((d) => d.slug === slug);
}
