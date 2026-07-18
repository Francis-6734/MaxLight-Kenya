import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { canManageOrders } from "@/lib/auth/roles";
import { formatKES } from "@/lib/format";
import { OrderStatusForm } from "@/components/admin/order-status-form";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const role = user!.role;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: { select: { name: true, slug: true } } } },
    },
  });
  if (!order) notFound();

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        <Link href="/admin/orders" className="hover:underline">
          Orders
        </Link>{" "}
        / {order.id}
      </p>
      <h1 className="mt-1 font-heading text-3xl">Order Details</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="font-heading text-lg">Items</p>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <span>{formatKES(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatKES(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>{formatKES(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatKES(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="font-heading text-lg">Customer</p>
            <p className="mt-2 text-sm font-medium">{order.user.name ?? "Guest"}</p>
            <p className="text-sm text-muted-foreground">{order.user.email}</p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="font-heading text-lg">Payment</p>
            <p className="mt-2 text-sm">Method: {order.paymentMethod ?? "—"}</p>
            <p className="text-sm text-muted-foreground">Reference: {order.paymentReference ?? "—"}</p>
            <p className="mt-3 text-sm">
              Status: <span className="font-medium">{order.status}</span>
            </p>
            {canManageOrders(role) && (
              <div className="mt-3">
                <OrderStatusForm orderId={order.id} currentStatus={order.status} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
