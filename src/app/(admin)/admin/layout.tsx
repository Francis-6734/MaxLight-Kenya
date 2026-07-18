import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ROLE_LABELS, isStaffRole } from "@/lib/auth/roles";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/admin");

  const role = user.role;

  if (!isStaffRole(role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <ShieldAlert className="h-10 w-10 text-destructive" strokeWidth={1.5} />
        <h1 className="font-heading text-2xl">Access Denied</h1>
        <p className="max-w-md text-muted-foreground">
          Your account ({ROLE_LABELS[role]}) doesn&rsquo;t have permission to view the admin area. Contact a
          Super Admin if you believe this is a mistake.
        </p>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar name={user.name ?? user.email} roleLabel={ROLE_LABELS[role]} />
      <main className="min-h-screen flex-1 overflow-x-hidden p-6 sm:p-8">{children}</main>
    </div>
  );
}
