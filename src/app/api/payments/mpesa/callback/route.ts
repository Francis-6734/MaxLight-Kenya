import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { MpesaCallbackPayload } from "@/lib/payments/mpesa";

/**
 * Safaricom posts here (MPESA_CALLBACK_URL) once an STK push resolves —
 * asynchronously, often seconds after the customer approves or cancels the
 * prompt on their phone. This must always respond 200 with ResultCode 0,
 * regardless of the payment outcome, or Daraja will retry indefinitely.
 */
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as MpesaCallbackPayload;
    const { CheckoutRequestID, ResultCode, ResultDesc } = payload.Body.stkCallback;

    const order = await db.order.findFirst({ where: { paymentReference: CheckoutRequestID } });
    if (order) {
      await db.order.update({
        where: { id: order.id },
        data: { status: ResultCode === 0 ? "PAID" : "CANCELLED" },
      });
    } else {
      console.warn("M-Pesa callback for unknown CheckoutRequestID:", CheckoutRequestID, ResultDesc);
    }
  } catch (err) {
    console.error("Failed to process M-Pesa callback:", err);
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
