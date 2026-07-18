"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BUSINESS_TYPES = ["Architect", "Interior Designer", "Contractor", "Property Developer", "Hotel", "Corporate Client"];

export function TradeSignupForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border p-8 text-center">
        <p className="font-heading text-xl">Application Received</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Our trade team will review your application and set up your account within 2 business days.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-2xl border border-border p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        toast.success("Trade account application submitted");
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="company">Company / Business Name</Label>
          <Input id="company" required placeholder="Studio Interiors Ltd" />
        </div>
        <div className="space-y-1.5">
          <Label>Business Type</Label>
          <Select
            defaultValue={BUSINESS_TYPES[0]}
            items={Object.fromEntries(BUSINESS_TYPES.map((t) => [t, t]))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact">Contact Person</Label>
          <Input id="contact" required placeholder="Jane Wanjiru" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" required placeholder="+254 7XX XXX XXX" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="email">Work Email</Label>
          <Input id="email" type="email" required placeholder="jane@studiointeriors.co.ke" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="message">Tell us about your business</Label>
          <Textarea id="message" rows={4} placeholder="Typical project size, monthly volume, current suppliers..." />
        </div>
      </div>
      <Button type="submit" size="lg" className="h-12 w-full">
        Apply for a Trade Account
      </Button>
    </form>
  );
}
