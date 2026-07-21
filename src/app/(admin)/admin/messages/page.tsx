import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { canManageOrders } from "@/lib/auth/roles";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { MessageReadToggle } from "@/components/admin/message-read-toggle";
import { deleteContactMessageAction } from "@/lib/actions/contact-actions";
import { cn } from "@/lib/utils";

export default async function AdminMessagesPage() {
  const user = await getCurrentUser();
  const canManage = canManageOrders(user!.role);

  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Customer Care</p>
      <h1 className="mt-1 font-heading text-3xl">Contact Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {messages.length} total &middot; {unreadCount} unread
      </p>

      <div className="mt-6 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-2xl border border-border bg-background p-5",
              !m.read && "border-l-4 border-l-gold"
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{m.subject}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {m.name} &middot; {m.email}
                  {m.phone && <> &middot; {m.phone}</>}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                <span>
                  {m.createdAt.toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                {!m.read && (
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 font-medium text-gold-foreground">New</span>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm whitespace-pre-line text-foreground/90">{m.message}</p>
            {canManage && (
              <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
                <a href={`mailto:${m.email}`} className="text-sm font-medium hover:underline">
                  Reply by Email
                </a>
                <MessageReadToggle id={m.id} read={m.read} />
                <ConfirmDeleteButton
                  itemName="this message"
                  onDelete={deleteContactMessageAction.bind(null, m.id)}
                  successMessage="Message deleted"
                />
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        )}
      </div>
    </div>
  );
}
