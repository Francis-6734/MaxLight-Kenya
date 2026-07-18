"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { initiateStkPush, isMpesaConfigured, PaymentNotConfiguredError } from "@/lib/payments/mpesa";

const DELIVERY_FEE = 1500;

const cartLineSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  lines: z.array(cartLineSchema).min(1),
  phoneNumber: z.string().min(9),
});

export interface CreateOrderState {
  error?: string;
  success?: boolean;
  orderId?: string;
  mpesaConfigured?: boolean;
}

/**
 * Creates a real Order + OrderItem rows priced from the database (never trusting
 * client-supplied prices), then attempts an M-Pesa STK push. If M-Pesa isn't
 * configured yet, the order is still created (status PENDING) so nothing is lost —
 * the customer just sees a "payments aren't live yet" message instead of a prompt.
 */
export async function createOrderAction(input: unknown): Promise<CreateOrderState> {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid order" };
  }
  const { lines, phoneNumber } = parsed.data;

  const currentUser = await getCurrentUser();

  const products = await db.product.findMany({
    where: { id: { in: lines.map((l) => l.productId) } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItemsData: { productId: string; quantity: number; price: number }[] = [];
  for (const line of lines) {
    const product = productMap.get(line.productId);
    if (!product) return { error: "One of the items in your cart is no longer available." };
    subtotal += product.price * line.quantity;
    orderItemsData.push({ productId: product.id, quantity: line.quantity, price: product.price });
  }

  const total = subtotal + DELIVERY_FEE;

  // Guest checkout: fall back to a shared guest account record so orders still
  // have a valid userId without requiring sign-in (PRD calls for guest checkout).
  let userId = currentUser?.id;
  if (!userId) {
    const guest = await db.user.upsert({
      where: { email: "guest@maxlightkenya.com" },
      update: {},
      create: { id: crypto.randomUUID(), email: "guest@maxlightkenya.com", name: "Guest Checkout", role: "CUSTOMER" },
    });
    userId = guest.id;
  }

  const order = await db.order.create({
    data: {
      userId,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      paymentMethod: "MPESA",
      items: { create: orderItemsData },
    },
  });

  if (!isMpesaConfigured()) {
    return { success: true, orderId: order.id, mpesaConfigured: false };
  }

  try {
    const stk = await initiateStkPush({
      phoneNumber: normalizePhone(phoneNumber),
      amount: total,
      accountReference: order.id,
      transactionDesc: `MaxLight Kenya order ${order.id}`,
    });
    await db.order.update({
      where: { id: order.id },
      data: { paymentReference: stk.checkoutRequestId },
    });
    return { success: true, orderId: order.id, mpesaConfigured: true };
  } catch (err) {
    if (err instanceof PaymentNotConfiguredError) {
      return { success: true, orderId: order.id, mpesaConfigured: false };
    }
    console.error("M-Pesa STK push failed:", err);
    return { error: "We couldn't reach M-Pesa right now. Please try again in a moment." };
  }
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`;
  return digits;
}
