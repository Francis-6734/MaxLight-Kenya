import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShieldCheck, LogOut } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { signOutAction } from "@/lib/actions/auth-actions";
import { ROLE_LABELS, isStaffRole } from "@/lib/auth/roles";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AccountDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const role = user.role;

  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <LayoutDashboard className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <h1 className="font-heading text-2xl">Welcome, {user.name ?? user.email}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border p-6">
          <p className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="h-4 w-4 text-gold" /> Account Role
          </p>
          <p className="mt-1 text-2xl font-heading">{ROLE_LABELS[role] ?? role}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {isStaffRole(role)
              ? "This account has staff-level access to the MaxLight admin area."
              : "This is a standard customer account."}
          </p>
          {isStaffRole(role) && (
            <Link href="/admin" className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
              Go to Admin Area
            </Link>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link href="/cart" className="rounded-xl border border-border p-4 text-sm hover:border-foreground/30">
            View Cart
          </Link>
          <Link href="/wishlist" className="rounded-xl border border-border p-4 text-sm hover:border-foreground/30">
            View Wishlist
          </Link>
          <Link href="/account/orders" className="rounded-xl border border-border p-4 text-sm hover:border-foreground/30">
            Order History
          </Link>
        </div>

        <form action={signOutAction} className="mt-8">
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
