"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageOrders } from "@/lib/auth/roles";

const ORDER_STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const updateStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export interface UpdateOrderState {
  error?: string;
  success?: boolean;
}

export async function updateOrderStatusAction(
  orderId: string,
  _prevState: UpdateOrderState,
  formData: FormData
): Promise<UpdateOrderState> {
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;
  if (!role || !canManageOrders(role)) {
    return { error: "You don't have permission to update orders." };
  }

  const parsed = updateStatusSchema.safeParse({ status: formData.get("status") });
  if (!parsed.success) return { error: "Invalid status" };

  await db.order.update({ where: { id: orderId }, data: { status: parsed.data.status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
