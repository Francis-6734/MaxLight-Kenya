import Link from "next/link";
import { db } from "@/lib/db";
import { FooterLinkRow } from "@/components/admin/footer-link-row";
import { AddFooterLink } from "@/components/admin/add-footer-link";

const COLUMN_LABELS: Record<string, string> = {
  shop: "Shop",
  company: "Company",
  "customer-care": "Customer Care",
  legal: "Legal",
};

export default async function AdminFooterLinksPage() {
  const links = await db.footerLink.findMany({ orderBy: [{ column: "asc" }, { sortOrder: "asc" }] });
  const byColumn = links.reduce<Record<string, typeof links>>((acc, link) => {
    (acc[link.column] ??= []).push(link);
    return acc;
  }, {});

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        <Link href="/admin/settings" className="hover:underline">
          Site Settings
        </Link>{" "}
        / Footer Links
      </p>
      <h1 className="mt-1 font-heading text-3xl">Footer Links</h1>

      <div className="mt-6">
        <AddFooterLink />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {Object.entries(COLUMN_LABELS).map(([column, label]) => (
          <div key={column} className="rounded-2xl border border-border bg-background p-5">
            <p className="font-heading text-lg">{label}</p>
            <div className="mt-2">
              {(byColumn[column] ?? []).map((link) => (
                <FooterLinkRow key={link.id} link={link} />
              ))}
              {!byColumn[column]?.length && <p className="py-3 text-sm text-muted-foreground">No links yet.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
