import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "../globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { AiAssistant } from "@/components/layout/ai-assistant";
import { ProductCatalogProvider } from "@/components/providers/product-catalog-provider";
import { CartProvider } from "@/lib/store/cart-context";
import { WishlistProvider } from "@/lib/store/wishlist-context";
import { CompareProvider } from "@/lib/store/compare-context";
import { getSiteSettings } from "@/lib/site-settings";
import { getClientCategoriesWithSubcategories } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";

// Every page under this layout reads live content from the database (site
// settings, footer links, blog/projects/designers, homepage sections). Without
// this, Next's static optimizer prerenders these routes at build time and
// admin edits wouldn't appear until the next deploy.
export const dynamic = "force-dynamic";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings.seoTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.seoDescription,
    keywords: settings.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, footerLinks, categories, user] = await Promise.all([
    getSiteSettings(),
    db.footerLink.findMany({ orderBy: [{ column: "asc" }, { sortOrder: "asc" }] }),
    getClientCategoriesWithSubcategories(),
    getCurrentUser(),
  ]);

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ProductCatalogProvider>
          <TooltipProvider delay={150}>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  <SiteHeader
                    categories={categories}
                    user={user}
                    announcement={{
                      text: settings.announcementText,
                      linkLabel: settings.announcementLinkLabel,
                      linkHref: settings.announcementLinkHref,
                    }}
                  />
                  <main className="flex-1">{children}</main>
                  <SiteFooter settings={settings} footerLinks={footerLinks} />
                  <WhatsAppFloat />
                  <AiAssistant />
                  <Toaster position="bottom-right" />
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </TooltipProvider>
        </ProductCatalogProvider>
      </body>
    </html>
  );
}
