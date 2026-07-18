"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Printer, ArrowRight, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";
import {
  ROOM_TYPE_OPTIONS,
  TIER_OPTIONS,
  CATEGORY_LABELS,
  calculateEstimate,
  type EstimatorRoomType,
  type EstimatorTier,
} from "@/lib/data/estimator";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function RoomEstimatorPage() {
  const [roomType, setRoomType] = useState<EstimatorRoomType>("living-room");
  const [tier, setTier] = useState<EstimatorTier>("standard");

  const result = useMemo(() => calculateEstimate(roomType, tier), [roomType, tier]);
  const roomLabel = ROOM_TYPE_OPTIONS.find((r) => r.value === roomType)?.label ?? "";
  const tierOption = TIER_OPTIONS.find((t) => t.value === tier)!;

  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Plan Your Budget</p>
        <h1 className="font-heading text-4xl text-balance">Room Cost Estimator</h1>
        <p className="mt-3 text-muted-foreground">
          Get an instant, realistic budget for lighting, wall décor, electronics, installation and more — before you
          book a consultation.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-8 no-print">
          <div>
            <p className="mb-3 text-sm font-semibold">Room Type</p>
            <Select
              value={roomType}
              onValueChange={(v) => v && setRoomType(v as EstimatorRoomType)}
              items={Object.fromEntries(ROOM_TYPE_OPTIONS.map((r) => [r.value, r.label]))}
            >
              <SelectTrigger className="h-12 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Package Tier</p>
            <div className="space-y-3">
              {TIER_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTier(t.value)}
                  className={cn(
                    "flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors",
                    tier === t.value ? "border-foreground bg-secondary/60" : "border-border hover:border-foreground/30"
                  )}
                >
                  <div>
                    <p className="font-medium">{t.label}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>
                  </div>
                  {tier === t.value && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
            This estimate covers products, installation, labour, transport and VAT for a single {roomLabel.toLowerCase()}.
            Final pricing is confirmed after a site visit.
          </div>
        </div>

        <div id="print-area" className="h-fit rounded-2xl border border-border p-6 sm:p-8">
          <div className="mb-1 hidden items-center justify-between print:flex">
            <p className="font-heading text-xl">MaxLight Kenya</p>
            <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <p className="text-xs font-semibold tracking-[0.15em] text-gold uppercase">Estimated Quotation</p>
          <h2 className="mt-1 font-heading text-2xl">
            {roomLabel} — {tierOption.label}
          </h2>

          <div className="mt-6 space-y-2.5 divide-y divide-border">
            {(Object.keys(result.breakdown) as (keyof typeof result.breakdown)[]).map((key) => (
              <div key={key} className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">{CATEGORY_LABELS[key]}</span>
                <span>{formatKES(result.breakdown[key])}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 space-y-2.5 border-t border-border pt-4 text-sm">
            <div className="flex justify-between font-medium">
              <span>Products Subtotal</span>
              <span>{formatKES(result.productSubtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Installation (8%)</span>
              <span>{formatKES(result.installation)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Labour (10%)</span>
              <span>{formatKES(result.labour)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Transport (3%)</span>
              <span>{formatKES(result.transport)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>VAT (16%)</span>
              <span>{formatKES(result.taxes)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-heading text-xl">Estimated Total</span>
            <span className="font-heading text-2xl text-gold-foreground">{formatKES(result.total)}</span>
          </div>

          <div className="mt-6 flex flex-col gap-3 no-print sm:flex-row">
            <button
              onClick={() => window.print()}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 flex-1 gap-2")}
            >
              <Printer className="h-4 w-4" /> Download as PDF
            </button>
            <Link href="/book-consultation" className={cn(buttonVariants({ size: "lg" }), "h-12 flex-1 gap-2")}>
              Book Consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
