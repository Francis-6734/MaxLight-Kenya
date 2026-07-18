"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateSiteSettingsAction, type SettingsFormState } from "@/lib/actions/settings-actions";

export interface SiteSettingsValues {
  siteName: string;
  tagline: string;
  announcementText: string;
  announcementLinkLabel: string;
  announcementLinkHref: string;
  phone: string;
  email: string;
  address: string;
  footerDescription: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  pinterestUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  xUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export function SiteSettingsForm({ initialValues }: { initialValues: SiteSettingsValues }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(updateSiteSettingsAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success("Site settings updated");
      router.refresh();
    }
    if (state.error) toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      <section>
        <p className="font-heading text-lg">General</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" name="siteName" required defaultValue={initialValues.siteName} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" name="tagline" required defaultValue={initialValues.tagline} />
          </div>
        </div>
      </section>

      <section>
        <p className="font-heading text-lg">Announcement Bar</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="announcementText">Text</Label>
            <Input id="announcementText" name="announcementText" required defaultValue={initialValues.announcementText} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="announcementLinkLabel">Link Label</Label>
            <Input id="announcementLinkLabel" name="announcementLinkLabel" defaultValue={initialValues.announcementLinkLabel} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="announcementLinkHref">Link URL</Label>
            <Input id="announcementLinkHref" name="announcementLinkHref" defaultValue={initialValues.announcementLinkHref} />
          </div>
        </div>
      </section>

      <section>
        <p className="font-heading text-lg">Contact Details</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" required defaultValue={initialValues.phone} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required defaultValue={initialValues.email} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" required defaultValue={initialValues.address} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="footerDescription">Footer Description</Label>
            <Textarea id="footerDescription" name="footerDescription" required rows={3} defaultValue={initialValues.footerDescription} />
          </div>
        </div>
      </section>

      <section>
        <p className="font-heading text-lg">Social Media</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {(
            [
              ["facebookUrl", "Facebook"],
              ["instagramUrl", "Instagram"],
              ["tiktokUrl", "TikTok"],
              ["pinterestUrl", "Pinterest"],
              ["youtubeUrl", "YouTube"],
              ["linkedinUrl", "LinkedIn"],
              ["xUrl", "X (Twitter)"],
            ] as const
          ).map(([field, label]) => (
            <div key={field} className="space-y-1.5">
              <Label htmlFor={field}>{label}</Label>
              <Input id={field} name={field} placeholder="https://" defaultValue={initialValues[field]} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="font-heading text-lg">SEO Defaults</p>
        <div className="mt-4 grid gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="seoTitle">Default Meta Title</Label>
            <Input id="seoTitle" name="seoTitle" required defaultValue={initialValues.seoTitle} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seoDescription">Default Meta Description</Label>
            <Textarea id="seoDescription" name="seoDescription" required rows={2} defaultValue={initialValues.seoDescription} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seoKeywords">Keywords (comma-separated)</Label>
            <Input id="seoKeywords" name="seoKeywords" defaultValue={initialValues.seoKeywords} />
          </div>
        </div>
      </section>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
