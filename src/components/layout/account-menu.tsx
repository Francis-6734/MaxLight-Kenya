"use client";

import Link from "next/link";
import { User, LayoutDashboard, ShieldCheck, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABELS, isStaffRole, type Role } from "@/lib/auth/roles";
import { signOutAction } from "@/lib/actions/auth-actions";
import type { CurrentUser } from "@/lib/auth/current-user";

export function AccountMenu({ user }: { user: CurrentUser | null }) {
  if (!user) {
    return (
      <Link
        href="/sign-in"
        aria-label="Sign in"
        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
      >
        <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </Link>
    );
  }

  const role = user.role as Role;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
      >
        <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="line-clamp-1">{user.name ?? user.email}</p>
            <p className="text-xs font-normal text-muted-foreground">{ROLE_LABELS[role] ?? role}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/account/dashboard" />}>
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </DropdownMenuItem>
        {isStaffRole(role) && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <ShieldCheck className="h-4 w-4" /> Admin Area
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => signOutAction()}>
          <LogOut className="h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
