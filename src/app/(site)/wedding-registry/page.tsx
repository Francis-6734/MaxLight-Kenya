"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Link2, Gift, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { icon: Heart, title: "Create Your Registry", desc: "Add your names, wedding date and a personal message." },
  { icon: ListChecks, title: "Build Your Wishlist", desc: "Add lighting, décor and homeware from our full catalog." },
  { icon: Gift, title: "Guests Contribute", desc: "Friends and family can buy items or contribute cash gifts." },
  { icon: Link2, title: "Share Your Link", desc: "Share your custom registry link on your invitations or website." },
];

export default function WeddingRegistryPage() {
  const [created, setCreated] = useState(false);

  if (created) {
    return (
      <div className="container-max flex flex-col items-center justify-center gap-4 py-32 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
          <Heart className="h-8 w-8 text-gold-foreground" />
        </span>
        <h1 className="font-heading text-3xl">Your Registry Has Been Created</h1>
        <p className="max-w-md text-muted-foreground">
          Your custom registry link has been sent to your email. Take a look at an example registry to see how it
          will appear to your guests.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link href="/wedding-registry/preview" className={cn(buttonVariants({ size: "lg" }))}>
            View Example Registry
          </Link>
          <Button variant="outline" size="lg" onClick={() => setCreated(false)}>
            Create Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-max py-14">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">For Couples</p>
          <h1 className="mt-2 font-heading text-4xl text-balance">Wedding Registry</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Start your life together with a home you love. Create a registry, add the pieces you want, and let
            your guests help you furnish it.
          </p>

          <div className="mt-10 space-y-6">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <step.icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  {i < steps.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                </div>
                <div className="pb-6">
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          className="h-fit rounded-2xl border border-border p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            setCreated(true);
            toast.success("Registry created");
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="partner1">Your Name</Label>
              <Input id="partner1" required placeholder="e.g. Sarah" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="partner2">Partner&rsquo;s Name</Label>
              <Input id="partner2" required placeholder="e.g. James" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="wedding-date">Wedding Date</Label>
              <Input id="wedding-date" type="date" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="message">Message to Guests</Label>
              <Textarea id="message" rows={4} placeholder="Thank you for being part of our journey..." />
            </div>
          </div>
          <Button type="submit" size="lg" className="mt-6 h-12 w-full">
            Create Our Registry
          </Button>
        </form>
      </div>
    </div>
  );
}
