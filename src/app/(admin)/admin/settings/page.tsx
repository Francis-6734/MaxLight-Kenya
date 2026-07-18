import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Content</p>
          <h1 className="mt-1 font-heading text-3xl">Site Settings</h1>
        </div>
        <Link href="/admin/settings/footer-links" className="text-sm font-medium hover:underline">
          Manage Footer Links →
        </Link>
      </div>
      <div className="mt-6">
        <SiteSettingsForm initialValues={settings} />
      </div>
    </div>
  );
}
