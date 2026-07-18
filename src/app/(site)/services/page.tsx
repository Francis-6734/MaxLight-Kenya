import type { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { services } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description: "Interior design, lighting design, installation, renovation and smart home services from MaxLight Kenya.",
};

export default function ServicesPage() {
  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">What We Do</p>
        <h1 className="font-heading text-4xl text-balance">Professional Home Interior Services</h1>
        <p className="mt-3 text-muted-foreground">
          Beyond products, our in-house team designs, installs and maintains every part of your home.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = (Icons[service.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Sparkles;
          return (
            <div key={service.id} className="rounded-2xl border border-border p-6 transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <p className="mt-4 font-heading text-lg">{service.name}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{service.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-16 flex flex-col items-center gap-5 rounded-3xl bg-ink px-8 py-14 text-center text-white">
        <h2 className="font-heading text-3xl text-balance sm:text-4xl">Need a custom service package?</h2>
        <p className="max-w-md text-white/70">
          Request a professional quotation and we&rsquo;ll put together a plan tailored to your project.
        </p>
        <Link
          href="/quotation"
          className={cn(buttonVariants({ size: "lg" }), "h-12 bg-gold px-6 text-base text-gold-foreground hover:bg-gold/90")}
        >
          Request Quotation <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
