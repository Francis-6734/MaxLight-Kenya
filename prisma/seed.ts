import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { categories } from "../src/lib/data/categories";
import { products } from "../src/lib/data/products";
import { blogPosts } from "../src/lib/data/blog";
import { projects } from "../src/lib/data/projects";
import { designers } from "../src/lib/data/designers";
import { createAdminClient } from "../src/lib/supabase/admin";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// MaxLight doesn't currently deal in these — kept in the catalog (unpublished)
// rather than deleted so the category and its products can be switched back
// on from the admin if that changes.
const UNAVAILABLE_CATEGORY_SLUGS = ["furniture", "flooring", "window-solutions"];

async function main() {
  console.log("Seeding categories...");
  for (const cat of categories) {
    const published = !UNAVAILABLE_CATEGORY_SLUGS.includes(cat.slug);
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        gradient: cat.placeholder.gradient,
        icon: cat.placeholder.icon,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        gradient: cat.placeholder.gradient,
        icon: cat.placeholder.icon,
        published,
      },
    });
  }

  console.log("Seeding products...");
  for (const p of products) {
    const category = await db.category.findUnique({ where: { slug: p.category } });
    if (!category) {
      console.warn(`Skipping product ${p.slug}: category ${p.category} not found`);
      continue;
    }
    await db.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        categoryId: category.id,
        subcategory: p.subcategory,
        brand: p.brand,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        currency: p.currency,
        rating: p.rating,
        reviewCount: p.reviewCount,
        rooms: p.rooms.join(","),
        styles: p.styles.join(","),
        highlights: p.highlights.join("\n"),
        inStock: p.inStock,
        isNew: !!p.isNew,
        isFeatured: !!p.isFeatured,
        placeholderGrad: p.placeholder.gradient,
        placeholderIcon: p.placeholder.icon,
      },
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        categoryId: category.id,
        subcategory: p.subcategory,
        brand: p.brand,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        currency: p.currency,
        rating: p.rating,
        reviewCount: p.reviewCount,
        rooms: p.rooms.join(","),
        styles: p.styles.join(","),
        highlights: p.highlights.join("\n"),
        inStock: p.inStock,
        isNew: !!p.isNew,
        isFeatured: !!p.isFeatured,
        placeholderGrad: p.placeholder.gradient,
        placeholderIcon: p.placeholder.icon,
      },
    });
  }

  console.log("Seeding site settings...");
  await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  console.log("Seeding footer links...");
  const footerColumns: Record<string, { label: string; href: string }[]> = {
    shop: [
      { label: "Lighting", href: "/shop?category=lighting" },
      { label: "Electronics", href: "/shop?category=electronics" },
      { label: "Smart Home", href: "/shop?category=smart-home" },
      { label: "Security", href: "/shop?category=security" },
      { label: "All Products", href: "/shop" },
      { label: "Room Visualizer", href: "/room-visualizer" },
      { label: "Room Cost Estimator", href: "/room-estimator" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Designers", href: "/designers" },
      { label: "Projects", href: "/projects" },
      { label: "Services", href: "/services" },
      { label: "Trade Accounts", href: "/trade-accounts" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    "customer-care": [
      { label: "Book Consultation", href: "/book-consultation" },
      { label: "Request Quotation", href: "/quotation" },
      { label: "Gift Cards", href: "/gift-cards" },
      { label: "Wedding Registry", href: "/wedding-registry" },
      { label: "Rewards Program", href: "/rewards" },
      { label: "Track Order", href: "/account/orders" },
      { label: "FAQs", href: "/faqs" },
      { label: "Delivery Information", href: "/delivery" },
      { label: "Returns & Warranty", href: "/returns" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Careers", href: "/careers" },
    ],
  };
  const existingFooterLinks = await db.footerLink.count();
  if (existingFooterLinks === 0) {
    for (const [column, links] of Object.entries(footerColumns)) {
      for (let i = 0; i < links.length; i++) {
        await db.footerLink.create({ data: { column, label: links[i].label, href: links[i].href, sortOrder: i } });
      }
    }
  }

  console.log("Seeding blog posts...");
  for (const post of blogPosts) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body.join("\n\n"),
        category: post.category,
        author: post.author,
        readTime: post.readTime,
        gradient: post.placeholder.gradient,
        icon: post.placeholder.icon,
      },
    });
  }

  console.log("Seeding projects...");
  for (const project of projects) {
    await db.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        slug: project.slug,
        title: project.title,
        category: project.category,
        location: project.location,
        completionDate: project.completionDate,
        servicesDelivered: project.servicesDelivered.join(","),
        clientTestimonial: project.clientTestimonial ?? null,
        clientName: project.clientName ?? null,
        gradient: project.placeholder.gradient,
        icon: project.placeholder.icon,
      },
    });
  }

  console.log("Seeding designers...");
  for (const designer of designers) {
    await db.designer.upsert({
      where: { slug: designer.slug },
      update: {},
      create: {
        slug: designer.slug,
        name: designer.name,
        position: designer.position,
        experience: designer.experience,
        specialization: designer.specialization,
        bio: designer.bio,
        languages: designer.languages.join(","),
        gradient: designer.placeholder.gradient,
        icon: designer.placeholder.icon,
      },
    });
  }

  console.log("Seeding hero slides...");
  const heroSlides = [
    {
      headline: "Create the Home You've Always Dreamed Of",
      subtitle:
        "Discover premium lighting, electronics, décor and smart home solutions — plus professional interior design services, all in one place.",
      eyebrow: "Living Rooms",
      gradient: "from-amber-100 via-stone-50 to-white",
      icon: "Sofa",
    },
    {
      headline: "Luxury Lighting That Transforms Every Room",
      subtitle: "From statement chandeliers to smart dimmable systems — lighting design that sets the mood.",
      eyebrow: "Luxury Lighting",
      gradient: "from-amber-200 via-yellow-50 to-white",
      icon: "Gem",
    },
    {
      headline: "Modern Kitchens, Built Around You",
      subtitle: "Custom-measured cabinetry, premium finishes and installation, start to finish.",
      eyebrow: "Modern Kitchens",
      gradient: "from-emerald-100 via-stone-50 to-white",
      icon: "CookingPot",
    },
    {
      headline: "Bedrooms Designed for Rest",
      subtitle: "Layered lighting, soft textiles and calming décor for comfort, night after night.",
      eyebrow: "Bedrooms",
      gradient: "from-rose-100 via-stone-50 to-white",
      icon: "BedDouble",
    },
    {
      headline: "Office Interiors That Work as Hard as You Do",
      subtitle: "Considered lighting and smart tech for a workspace that supports focus.",
      eyebrow: "Office Interiors",
      gradient: "from-neutral-300 via-stone-50 to-white",
      icon: "Table2",
    },
  ];
  const existingSlides = await db.heroSlide.count();
  if (existingSlides === 0) {
    for (let i = 0; i < heroSlides.length; i++) {
      await db.heroSlide.create({ data: { ...heroSlides[i], sortOrder: i } });
    }
  }

  console.log("Seeding homepage section content...");
  const homeSections = [
    {
      id: "category-showcase",
      eyebrow: "Product Coverage",
      title: "Everything Your Home Deserves",
      description: "From statement lighting to complete smart home systems — explore every category MaxLight has to offer.",
    },
    {
      id: "shop-by-room",
      eyebrow: "Shop by Space",
      title: "Furnish Any Room in Your Home",
      description: "Jump straight to the products curated for each space — from the living room to the outdoors.",
    },
    {
      id: "featured-products",
      eyebrow: "Handpicked",
      title: "Featured This Season",
      description: "Signature pieces our design team recommends for a premium, cohesive home.",
    },
    {
      id: "inspiration-teaser",
      eyebrow: "Complete the Room",
      title: "Shop the Look, Not Just the Product",
      description:
        "Every room in our Inspiration Hub is fully tagged — click any item to view it, or add the entire room to your cart in one go.",
    },
    {
      id: "featured-projects",
      eyebrow: "Our Work",
      title: "Featured Projects",
      description: "From luxury villas to boutique hotels — see how MaxLight transforms real spaces across Kenya.",
    },
    {
      id: "blog-teaser",
      eyebrow: "From the Journal",
      title: "Interior Tips & Inspiration",
      description: "Guides from our design team to help you plan, style and maintain your home.",
    },
  ];
  for (const section of homeSections) {
    await db.homeSection.upsert({ where: { id: section.id }, update: {}, create: section });
  }

  console.log("Seeding demo users...");
  const demoUsers: { name: string; email: string; password: string; role: string }[] = [
    { name: "Grace Njoroge", email: "admin@maxlightkenya.com", password: "admin1234", role: "SUPER_ADMIN" },
    { name: "Amina Hassan", email: "designer@maxlightkenya.com", password: "designer1234", role: "INTERIOR_DESIGNER" },
    { name: "Jane Wanjiru", email: "customer@maxlightkenya.com", password: "customer1234", role: "CUSTOMER" },
  ];

  const supabaseAdmin = createAdminClient();

  for (const u of demoUsers) {
    // Demo accounts must exist in Supabase Auth (not just our profile table) so
    // they can actually sign in. email_confirm: true skips the confirmation
    // email since these are seeded fixtures, not real signups.
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name },
    });

    let authUserId = created?.user?.id;
    if (!authUserId) {
      if (!createError?.message.includes("already been registered")) {
        console.warn(`  Skipping ${u.email}: ${createError?.message}`);
        continue;
      }
      const existing = await db.$queryRaw<{ id: string }[]>`SELECT id FROM auth.users WHERE email = ${u.email} LIMIT 1`;
      authUserId = existing[0]?.id;
      if (!authUserId) {
        console.warn(`  Skipping ${u.email}: couldn't resolve existing Supabase auth user id`);
        continue;
      }
    }

    await db.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role },
      create: { id: authUserId, name: u.name, email: u.email, role: u.role },
    });
  }

  console.log("Seed complete.");
  console.log("\nDemo login credentials:");
  for (const u of demoUsers) {
    console.log(`  ${u.role.padEnd(16)} ${u.email} / ${u.password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
