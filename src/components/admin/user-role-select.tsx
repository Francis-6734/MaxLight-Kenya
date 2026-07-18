"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLES, ROLE_LABELS } from "@/lib/auth/roles";
import { updateUserRoleAction } from "@/lib/actions/user-actions";

export function UserRoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const boundAction = updateUserRoleAction.bind(null, userId);
  const [state, formAction] = useActionState(boundAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success("Role updated");
      router.refresh();
    }
    if (state.error) toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form id={`role-form-${userId}`} action={formAction}>
      <Select
        name="role"
        defaultValue={currentRole}
        items={Object.fromEntries(ROLES.map((r) => [r, ROLE_LABELS[r]]))}
        onValueChange={() => {
          const form = document.getElementById(`role-form-${userId}`) as HTMLFormElement | null;
          form?.requestSubmit();
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
    </form>
  );
}
