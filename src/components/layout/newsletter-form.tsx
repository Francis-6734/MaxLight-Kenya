"use client";

import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  return (
    <form
      className="flex w-full max-w-md gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("You're subscribed! Welcome to the MaxLight community.");
        (e.target as HTMLFormElement).reset();
      }}
    >
      <Input
        type="email"
        required
        placeholder="Enter your email"
        className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-gold/40"
      />
      <button
        type="submit"
        className={cn(buttonVariants({ size: "lg" }), "shrink-0 bg-gold text-gold-foreground hover:bg-gold/90")}
      >
        Subscribe <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
