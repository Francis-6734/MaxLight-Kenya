"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateConsultationStatusAction } from "@/lib/actions/consultation-actions";
import { cn } from "@/lib/utils";

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function ConsultationStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={pending}
      items={STATUS_LABELS}
      onValueChange={(next) => {
        if (!next || next === status) return;
        startTransition(async () => {
          const result = await updateConsultationStatusAction(id, next);
          if (result.error) toast.error(result.error);
          else router.refresh();
        });
      }}
    >
      <SelectTrigger className={cn("w-40", pending && "opacity-60")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
