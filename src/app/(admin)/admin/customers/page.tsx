import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { canManageUsers, ROLE_LABELS, type Role } from "@/lib/auth/roles";
import { UserRoleSelect } from "@/components/admin/user-role-select";

export default async function AdminCustomersPage() {
  const currentUser = await getCurrentUser();
  const role = currentUser!.role;
  const canManage = canManageUsers(role);

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
    take: 200,
  });

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">People</p>
      <h1 className="mt-1 font-heading text-3xl">Customers &amp; Staff</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Orders</th>
              <th className="p-3 font-medium">Joined</th>
              <th className="p-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{u.name ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3">{u._count.orders}</td>
                <td className="p-3 text-muted-foreground">
                  {u.createdAt.toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="p-3">
                  {canManage && u.id !== currentUser!.id ? (
                    <UserRoleSelect userId={u.id} currentRole={u.role} />
                  ) : (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                      {ROLE_LABELS[u.role as Role] ?? u.role}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
