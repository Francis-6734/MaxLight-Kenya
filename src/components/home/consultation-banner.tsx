import Link from "next/link";
import { ArrowRight, PencilRuler, Ruler, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const points = [
  { icon: PencilRuler, label: "Free initial design consultation" },
  { icon: Ruler, label: "On-site measurement & assessment" },
  { icon: Sparkles, label: "Personalised product recommendations" },
];

export function ConsultationBanner() {
  return (
    <section className="container-max py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-white sm:px-16">
          <div
            aria-hidden
            className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-royal/20 blur-3xl"
          />
          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold uppercase">
                Talk to a Designer
              </p>
              <h2 className="font-heading text-3xl text-balance sm:text-4xl">
                Not sure where to start? Book a free consultation.
              </h2>
              <div className="mt-6 flex flex-col gap-3">
                {points.map((p) => (
                  <div key={p.label} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <p.icon className="h-4 w-4 text-gold" strokeWidth={1.5} />
                    </span>
                    {p.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/book-consultation"
                className={cn(buttonVariants({ size: "lg" }), "h-12 bg-gold px-6 text-base text-gold-foreground hover:bg-gold/90")}
              >
                Book Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/quotation"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 border-white/30 bg-white/5 px-6 text-base text-white hover:bg-white/15"
                )}
              >
                Request Quotation
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
