"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLES, ROLE_LABELS } from "@/lib/auth/roles";
import { updateUserRoleAction } from "@/lib/actions/user-actions";

export function UserRoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={currentRole}
      disabled={pending}
      items={Object.fromEntries(ROLES.map((r) => [r, ROLE_LABELS[r]]))}
      onValueChange={(nextRole) => {
        if (!nextRole || nextRole === currentRole) return;
        startTransition(async () => {
          const result = await updateUserRoleAction(userId, nextRole);
          if (result.error) toast.error(result.error);
          else {
            toast.success("Role updated");
            router.refresh();
          }
        });
      }}
    >
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {ROLE_LABELS[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
