"use client";

import { useState } from "react";
import { PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function TrackOrderPage() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="container-max flex flex-col items-center py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
        <PackageSearch className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <h1 className="mt-4 font-heading text-3xl">Track Your Order</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Enter your order number and phone number to check your delivery status.
      </p>

      <form
        className="mt-8 w-full max-w-sm space-y-4 text-left"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
          toast.info("If this order exists, we've sent status details to your phone.");
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="order-number">Order Number</Label>
          <Input id="order-number" required placeholder="e.g. ML-20260714-0032" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="order-phone">Phone Number</Label>
          <Input id="order-phone" required placeholder="+254 7XX XXX XXX" />
        </div>
        <Button type="submit" size="lg" className="h-11 w-full">
          Track Order
        </Button>
      </form>

      {checked && (
        <p className="mt-6 max-w-sm text-sm text-muted-foreground">
          Have an account already? Order history and live tracking will appear here once you sign in.
        </p>
      )}
    </div>
  );
}
