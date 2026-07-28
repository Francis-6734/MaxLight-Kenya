import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/*",
        "/account",
        "/account/*",
        "/api/*",
        "/auth/*",
        "/cart",
        "/checkout",
        "/sign-in",
        "/sign-up",
        "/forgot-password",
        "/reset-password",
        "/wishlist",
        "/compare",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
