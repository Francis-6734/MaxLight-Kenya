"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border p-8 text-center">
        <p className="font-heading text-xl">Message Sent</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out — our team will respond within one business day.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
          Send Another Message
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
        toast.success("Message sent to MaxLight Kenya");
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" required placeholder="Jane Wanjiru" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="+254 7XX XXX XXX" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required placeholder="jane@example.com" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" required placeholder="How can we help?" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" rows={5} required placeholder="Tell us more..." />
        </div>
      </div>
      <Button type="submit" size="lg" className="h-12 w-full">
        Send Message
      </Button>
    </form>
  );
}
