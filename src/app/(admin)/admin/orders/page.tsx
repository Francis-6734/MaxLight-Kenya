import Link from "next/link";
import { db } from "@/lib/db";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUSES = ["ALL", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  SHIPPED: "bg-sky-100 text-sky-700",
  DELIVERED: "bg-indigo-100 text-indigo-700",
  CANCELLED: "bg-destructive/10 text-destructive",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status && STATUSES.includes(status as (typeof STATUSES)[number]) ? status : "ALL";

  const orders = await db.order.findMany({
    where: activeStatus === "ALL" ? undefined : { status: activeStatus },
    include: { user: { select: { name: true, email: true } }, _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
    take: 150,
  });

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Sales</p>
      <h1 className="mt-1 font-heading text-3xl">Orders</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/orders" : `/admin/orders?status=${s}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              activeStatus === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30"
            )}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Order</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Items</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                    {order.id.slice(0, 12)}...
                  </Link>
                </td>
                <td className="p-3 text-muted-foreground">{order.user.name ?? order.user.email}</td>
                <td className="p-3">{order._count.items}</td>
                <td className="p-3">{formatKES(order.total)}</td>
                <td className="p-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STATUS_STYLES[order.status])}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">
                  {order.createdAt.toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No orders found.</p>}
      </div>
    </div>
  );
}
