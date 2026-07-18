import Link from "next/link";
import { Package, ShoppingCart, Users, Wallet } from "lucide-react";
import { db } from "@/lib/db";
import { formatKES } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, customerCount, orders, revenue] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    db.order.aggregate({ _sum: { total: true }, where: { status: "PAID" } }),
  ]);

  const stats = [
    { label: "Products", value: productCount.toLocaleString(), icon: Package, href: "/admin/products" },
    { label: "Orders", value: orderCount.toLocaleString(), icon: ShoppingCart, href: "/admin/orders" },
    { label: "Customers", value: customerCount.toLocaleString(), icon: Users, href: "/admin/customers" },
    { label: "Revenue (Paid)", value: formatKES(revenue._sum.total ?? 0), icon: Wallet, href: "/admin/orders" },
  ];

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Overview</p>
      <h1 className="mt-1 font-heading text-3xl">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-gold" strokeWidth={1.5} />
            </div>
            <p className="mt-2 font-heading text-2xl">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-background p-5">
        <div className="flex items-center justify-between">
          <p className="font-heading text-lg">Recent Orders</p>
          <Link href="/admin/orders" className="text-sm font-medium hover:underline">
            View all
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Order</th>
                  <th className="pb-2 pr-4 font-medium">Customer</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 pr-4 font-medium">Total</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                        {order.id.slice(0, 10)}...
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4">{order.user.name ?? order.user.email}</td>
                    <td className="py-2.5 pr-4">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{order.status}</span>
                    </td>
                    <td className="py-2.5 pr-4">{formatKES(order.total)}</td>
                    <td className="py-2.5 text-muted-foreground">
                      {order.createdAt.toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
