"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HeroSlideData {
  id: string;
  eyebrow: string;
  headline: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  gradient: string;
  icon: string;
  imageUrl: string | null;
}

export function Hero({ slides }: { slides: HeroSlideData[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[index];

  return (
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-center overflow-hidden bg-ink text-white">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <ImagePlaceholder gradient={slide.gradient} icon={slide.icon} image={slide.imageUrl} iconClassName="opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="container-max relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={slide.id} initial="hidden" animate="visible" exit="hidden">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-sm font-medium tracking-[0.2em] text-gold uppercase"
            >
              {slide.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-3xl font-heading text-5xl leading-[1.05] text-balance sm:text-6xl lg:text-7xl"
            >
              {slide.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg text-white/80 text-balance"
            >
              {slide.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                href={slide.primaryCtaHref}
                className={cn(buttonVariants({ size: "lg" }), "h-12 bg-gold px-6 text-base text-gold-foreground hover:bg-gold/90")}
              >
                {slide.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={slide.secondaryCtaHref}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 border-white/30 bg-white/5 px-6 text-base text-white hover:bg-white/15"
                )}
              >
                {slide.secondaryCtaLabel}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.eyebrow}`}
              className={cn("h-1.5 rounded-full bg-white/40 transition-all", i === index ? "w-8 bg-gold" : "w-1.5")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
