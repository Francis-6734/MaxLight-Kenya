import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { canManageOrders } from "@/lib/auth/roles";
import { ConsultationStatusSelect } from "@/components/admin/consultation-status-select";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteConsultationRequestAction } from "@/lib/actions/consultation-actions";
import { cn } from "@/lib/utils";

const STATUSES = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-sky-100 text-sky-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-destructive/10 text-destructive",
};

export default async function AdminConsultationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status && STATUSES.includes(status as (typeof STATUSES)[number]) ? status : "ALL";

  const user = await getCurrentUser();
  const canManage = canManageOrders(user!.role);

  const requests = await db.consultationRequest.findMany({
    where: activeStatus === "ALL" ? undefined : { status: activeStatus },
    orderBy: { createdAt: "desc" },
    take: 150,
  });

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Design Team</p>
      <h1 className="mt-1 font-heading text-3xl">Consultation Requests</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/consultations" : `/admin/consultations?status=${s}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              activeStatus === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30"
            )}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 font-medium">
                  {r.name}
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STATUS_STYLES[r.status])}>
                    {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {r.email} &middot; {r.phone} &middot; {r.location}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                {r.createdAt.toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>

            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Type:</span> {r.consultationType}
              </p>
              <p>
                <span className="text-muted-foreground">Project:</span> {r.projectType}
              </p>
              <p>
                <span className="text-muted-foreground">Preferred:</span> {r.preferredDate} at {r.preferredTime}
              </p>
              {r.budget && (
                <p>
                  <span className="text-muted-foreground">Budget:</span> KES {r.budget}
                </p>
              )}
            </div>

            {r.description && <p className="mt-3 text-sm whitespace-pre-line text-foreground/90">{r.description}</p>}

            {r.imageUrls.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {r.imageUrls.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
                    <Image src={url} alt="Attached floor plan or reference photo" fill className="object-cover" sizes="64px" />
                  </a>
                ))}
              </div>
            )}

            {canManage && (
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-3">
                <a href={`mailto:${r.email}`} className="text-sm font-medium hover:underline">
                  Reply by Email
                </a>
                <ConsultationStatusSelect id={r.id} status={r.status} />
                <ConfirmDeleteButton
                  itemName="this request"
                  onDelete={deleteConsultationRequestAction.bind(null, r.id)}
                  successMessage="Request deleted"
                />
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No consultation requests found.
          </p>
        )}
      </div>
    </div>
  );
}
