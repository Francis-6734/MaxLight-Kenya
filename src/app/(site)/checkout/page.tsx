"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Smartphone, Landmark, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { useCart } from "@/lib/store/cart-context";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";
import { createOrderAction } from "@/lib/actions/order-actions";

const PAYMENT_METHODS = [
  { id: "mpesa", label: "M-Pesa", icon: Smartphone, hint: "Pay via STK push to your phone" },
  { id: "card", label: "Visa / Mastercard", icon: CreditCard, hint: "Secure card payment" },
  { id: "bank", label: "Bank Transfer", icon: Landmark, hint: "Pay via bank deposit" },
] as const;

export default function CheckoutPage() {
  const { resolvedLines, totalPrice, clear } = useCart();
  const [method, setMethod] = useState<(typeof PAYMENT_METHODS)[number]["id"]>("mpesa");
  const [placing, setPlacing] = useState(false);
  const router = useRouter();
  const deliveryEstimate = resolvedLines.length > 0 ? 1500 : 0;

  if (resolvedLines.length === 0) {
    return (
      <div className="container-max flex flex-col items-center justify-center gap-4 py-32 text-center">
        <h1 className="font-heading text-2xl">Nothing to check out yet</h1>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link href="/shop" className="mt-2 inline-flex h-11 items-center rounded-lg bg-foreground px-6 text-sm font-medium text-background">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-max py-10">
      <h1 className="font-heading text-3xl">Checkout</h1>

      <form
        className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]"
        onSubmit={async (e) => {
          e.preventDefault();
          setPlacing(true);
          const formData = new FormData(e.currentTarget);

          if (method !== "mpesa") {
            // Card/bank transfer remain simulated for now — M-Pesa is the only
            // payment method wired to a real backend so far.
            setTimeout(() => {
              toast.success("Order placed! A confirmation has been sent to your email.");
              clear();
              setPlacing(false);
              router.push("/");
            }, 1200);
            return;
          }

          const result = await createOrderAction({
            lines: resolvedLines.map(({ product, quantity }) => ({ productId: product.id, quantity })),
            phoneNumber: String(formData.get("mpesa-phone") ?? ""),
          });
          setPlacing(false);

          if (result.error) {
            toast.error(result.error);
            return;
          }

          if (result.mpesaConfigured) {
            toast.success("STK push sent — check your phone to complete payment.");
          } else {
            toast.success("Order placed! M-Pesa payments aren't live yet, so our team will contact you to confirm payment.");
          }
          clear();
          router.push("/");
        }}
      >
        <div className="space-y-8">
          <section>
            <p className="font-heading text-lg">Delivery Details</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required placeholder="Jane Wanjiru" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" required placeholder="+254 7XX XXX XXX" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required placeholder="jane@example.com" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input id="address" required placeholder="Street, estate, house/apartment number" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">City / Town</Label>
                <Input id="city" required placeholder="Nairobi" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Delivery Notes (optional)</Label>
                <Input id="notes" placeholder="Gate code, landmark, etc." />
              </div>
            </div>
          </section>

          <section>
            <p className="font-heading text-lg">Payment Method</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
                    method === m.id ? "border-foreground bg-secondary/60" : "border-border hover:border-foreground/30"
                  )}
                >
                  <m.icon className="h-5 w-5" strokeWidth={1.5} />
                  <span className="text-sm font-medium">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.hint}</span>
                </button>
              ))}
            </div>
            {method === "mpesa" && (
              <div className="mt-4 space-y-1.5">
                <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
                <Input id="mpesa-phone" name="mpesa-phone" required placeholder="07XX XXX XXX" />
              </div>
            )}
          </section>
        </div>

        <div className="h-fit rounded-2xl border border-border p-6">
          <p className="font-heading text-lg">Order Summary</p>
          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
            {resolvedLines.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
                  <ImagePlaceholder gradient={product.placeholder.gradient} icon={product.placeholder.icon} image={product.imageUrl} />
                </div>
                <div className="flex flex-1 items-center justify-between text-sm">
                  <div>
                    <p className="line-clamp-1 font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {quantity}</p>
                  </div>
                  <span className="shrink-0 font-medium">{formatKES(product.price * quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatKES(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>{formatKES(deliveryEstimate)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold">
              <span>Total</span>
              <span>{formatKES(totalPrice + deliveryEstimate)}</span>
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-5 h-12 w-full" disabled={placing}>
            {placing ? "Placing Order..." : `Place Order — ${formatKES(totalPrice + deliveryEstimate)}`}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout, powered by MaxLight Kenya
          </p>
        </div>
      </form>
    </div>
  );
}
