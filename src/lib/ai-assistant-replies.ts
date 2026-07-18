interface Rule {
  keywords: string[];
  reply: string;
  link?: { label: string; href: string };
}

const RULES: Rule[] = [
  {
    keywords: ["light", "lighting", "chandelier", "lamp"],
    reply:
      "For most living rooms and dining areas, I'd suggest layering a statement chandelier or pendant with warm dimmable wall lights — it makes a space feel finished, not just lit.",
    link: { label: "Browse Lighting", href: "/shop?category=lighting" },
  },
  {
    keywords: ["budget", "cost", "price", "estimate", "how much"],
    reply:
      "Budgets vary a lot by room and finish level. Try our Room Cost Estimator for an instant breakdown of lighting, décor, installation and VAT based on your room type and package tier.",
    link: { label: "Open Room Cost Estimator", href: "/room-estimator" },
  },
  {
    keywords: ["colour", "color", "palette", "paint"],
    reply:
      "For a calm, versatile base, warm neutrals (soft beige, greige) paired with one deeper accent colour work beautifully in most Kenyan homes — especially with natural light.",
  },
  {
    keywords: ["kitchen"],
    reply:
      "For kitchens, I'd focus your budget on fitted cabinetry and a strong countertop material first — those two choices define how premium the whole room feels.",
    link: { label: "Browse Kitchen Products", href: "/shop?category=kitchen" },
  },
  {
    keywords: ["bedroom"],
    reply:
      "A great bedroom starts with layered warm lighting on a dimmer and soft, textured wall décor — comfort first, style second.",
    link: { label: "Browse Bedroom Ideas", href: "/shop?room=bedroom" },
  },
  {
    keywords: ["living room", "lounge", "sofa"],
    reply:
      "A chandelier or pendant overhead, layered with warm accent lighting and a considered piece of wall art, is our go-to formula for a living room that feels finished.",
    link: { label: "Shop Living Room", href: "/shop?room=living-room" },
  },
  {
    keywords: ["curtain", "blind", "window"],
    reply:
      "We don't currently carry curtains or window treatments, but a good rule of thumb is floor-length drapery to make ceilings feel taller, layered with a heavier blackout piece if you need it. Happy to help with the lighting and décor around the window instead.",
    link: { label: "Browse Wall Décor", href: "/shop?category=wall-decor" },
  },
  {
    keywords: ["smart", "automation", "security", "cctv", "lock"],
    reply:
      "For a first smart home step, most clients start with a smart lock and a CCTV kit for security, then add smart switches and a voice assistant for convenience.",
    link: { label: "Browse Smart Home", href: "/shop?category=smart-home" },
  },
  {
    keywords: ["consult", "designer", "book", "visit"],
    reply:
      "I'd recommend booking a free consultation — one of our designers can assess your space in person or remotely and give tailored recommendations.",
    link: { label: "Book a Consultation", href: "/book-consultation" },
  },
  {
    keywords: ["room", "design", "complete"],
    reply:
      "Check out our Inspiration Hub — every room is fully tagged, so you can see exactly which products were used and add the whole look to your cart in one click.",
    link: { label: "Explore Inspiration Hub", href: "/rooms" },
  },
];

const FALLBACKS = [
  "I can help with product recommendations, budgets, colour palettes and room designs. What are you working on?",
  "Tell me a bit more — which room, and what's the style you're going for?",
  "Happy to help! You can also book a free consultation if you'd like a designer to take a closer look.",
];

export function getAssistantReply(input: string): { text: string; link?: { label: string; href: string } } {
  const lower = input.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return { text: rule.reply, link: rule.link };
    }
  }
  return { text: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)] };
}

export const SUGGESTION_CHIPS = [
  "Recommend lighting for my living room",
  "Estimate my renovation budget",
  "Suggest a bedroom colour palette",
  "What's a good smart home starting point?",
];
