"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageUsers, ROLES } from "@/lib/auth/roles";

const updateRoleSchema = z.object({
  role: z.enum(ROLES),
});

export interface UpdateRoleState {
  error?: string;
  success?: boolean;
}

export async function updateUserRoleAction(userId: string, role: string): Promise<UpdateRoleState> {
  const currentUser = await getCurrentUser();
  const currentUserRole = currentUser?.role;
  if (!currentUserRole || !canManageUsers(currentUserRole)) {
    return { error: "You don't have permission to manage user roles." };
  }
  if (currentUser?.id === userId) {
    return { error: "You can't change your own role." };
  }

  const parsed = updateRoleSchema.safeParse({ role });
  if (!parsed.success) return { error: "Invalid role" };

  await db.user.update({ where: { id: userId }, data: { role: parsed.data.role } });
  revalidatePath("/admin/customers");
  return { success: true };
}
