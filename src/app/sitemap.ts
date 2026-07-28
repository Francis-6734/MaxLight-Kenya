import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { inspirationRooms } from "@/lib/data/rooms";
import { SITE_URL } from "@/lib/site-url";

const STATIC_ROUTES = [
  "",
  "/about",
  "/blog",
  "/book-consultation",
  "/careers",
  "/contact",
  "/delivery",
  "/designers",
  "/faqs",
  "/gift-cards",
  "/privacy",
  "/projects",
  "/quotation",
  "/returns",
  "/rewards",
  "/room-estimator",
  "/room-visualizer",
  "/rooms",
  "/services",
  "/shop",
  "/terms",
  "/trade-accounts",
  "/wedding-registry",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogPosts, projects, designers] = await Promise.all([
    db.product.findMany({ select: { slug: true, updatedAt: true } }),
    db.blogPost.findMany({ where: { published: true }, select: { slug: true, createdAt: true } }),
    db.project.findMany({ where: { published: true }, select: { slug: true } }),
    db.designer.findMany({ where: { published: true }, select: { slug: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const designerEntries: MetadataRoute.Sitemap = designers.map((d) => ({
    url: `${SITE_URL}/designers/${d.slug}`,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const roomEntries: MetadataRoute.Sitemap = inspirationRooms.map((r) => ({
    url: `${SITE_URL}/rooms/${r.slug}`,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries, ...projectEntries, ...designerEntries, ...roomEntries];
}
