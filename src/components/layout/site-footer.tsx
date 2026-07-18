import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
  PinterestIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/icons/social-icons";
import { NewsletterForm } from "@/components/layout/newsletter-form";

const COLUMN_LABELS: Record<string, string> = {
  shop: "Shop",
  company: "Company",
  "customer-care": "Customer Care",
  legal: "Legal",
};
const COLUMN_ORDER = ["shop", "company", "customer-care", "legal"];

export interface FooterSettingsData {
  footerDescription: string;
  phone: string;
  email: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  pinterestUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  xUrl: string;
}

export interface FooterLinkData {
  id: string;
  column: string;
  label: string;
  href: string;
}

export function SiteFooter({
  settings,
  footerLinks,
}: {
  settings: FooterSettingsData;
  footerLinks: FooterLinkData[];
}) {
  const socials = [
    { icon: FacebookIcon, href: settings.facebookUrl, label: "Facebook" },
    { icon: InstagramIcon, href: settings.instagramUrl, label: "Instagram" },
    { icon: TikTokIcon, href: settings.tiktokUrl, label: "TikTok" },
    { icon: PinterestIcon, href: settings.pinterestUrl, label: "Pinterest" },
    { icon: YoutubeIcon, href: settings.youtubeUrl, label: "YouTube" },
    { icon: LinkedinIcon, href: settings.linkedinUrl, label: "LinkedIn" },
    { icon: XIcon, href: settings.xUrl, label: "X" },
  ].filter((s) => s.href);

  const byColumn = footerLinks.reduce<Record<string, FooterLinkData[]>>((acc, link) => {
    (acc[link.column] ??= []).push(link);
    return acc;
  }, {});

  return (
    <footer className="mt-24 border-t border-border bg-ink text-white/80">
      <div className="container-max border-b border-white/10 py-14">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="font-heading text-2xl text-white text-balance">
              Get design inspiration & offers in your inbox.
            </p>
            <p className="mt-1 text-sm text-white/60">
              Join the MaxLight community — no spam, just beautiful homes.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="container-max grid grid-cols-2 gap-10 py-14 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2.5 font-heading text-2xl text-white">
            <Image src="/logo-icon.png" alt="MaxLight" width={36} height={36} className="rounded-lg" />
            Max<span className="text-gold">Light</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-white/60">{settings.footerDescription}</p>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="h-4 w-4 shrink-0 text-gold" /> {settings.address}
            </div>
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white/70 hover:text-white">
              <Phone className="h-4 w-4 shrink-0 text-gold" /> {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-white/70 hover:text-white">
              <Mail className="h-4 w-4 shrink-0 text-gold" /> {settings.email}
            </a>
          </div>
          <div className="mt-5 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {COLUMN_ORDER.map((column) => (
          <div key={column}>
            <p className="text-sm font-semibold text-white">{COLUMN_LABELS[column]}</p>
            <ul className="mt-3 space-y-2">
              {(byColumn[column] ?? []).map((l) => (
                <li key={l.id}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-max flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} MaxLight Electronic (MaxLight Kenya). All rights reserved.</p>
        <div className="flex items-center gap-3">
          <span className="rounded border border-white/15 px-2 py-1">M-Pesa</span>
          <span className="rounded border border-white/15 px-2 py-1">Visa</span>
          <span className="rounded border border-white/15 px-2 py-1">Mastercard</span>
        </div>
      </div>
    </footer>
  );
}
