"use client";

import { useState } from "react";
import { Award, Gift, Cake, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIERS = [
  { name: "Silver", threshold: 0, perks: ["Earn 1 point per KES 100 spent", "Member-only offers"] },
  { name: "Gold", threshold: 50000, perks: ["All Silver perks", "Free delivery on orders above KES 50,000", "Early access to sales"] },
  { name: "Platinum", threshold: 150000, perks: ["All Gold perks", "Priority installation scheduling", "Annual home styling session"] },
  { name: "Diamond", threshold: 300000, perks: ["All Platinum perks", "Dedicated account manager", "Invitations to VIP showroom events"] },
];

const FEATURES = [
  { icon: Sparkles, title: "Earn Points Per Purchase", desc: "1 point for every KES 100 spent, on every order." },
  { icon: Cake, title: "Birthday Rewards", desc: "A special bonus voucher every year, on us." },
  { icon: Users, title: "Referral Bonuses", desc: "Earn points when friends you refer make their first purchase." },
  { icon: Gift, title: "Exclusive Offers", desc: "Member-only discounts and early access to new arrivals." },
];

const SAMPLE_POINTS = 68000;
const REWARDS = [
  { id: "r1", label: "KES 1,000 Off Voucher", cost: 10000 },
  { id: "r2", label: "Free Standard Delivery", cost: 5000 },
  { id: "r3", label: "KES 5,000 Off Voucher", cost: 40000 },
  { id: "r4", label: "Free Design Consultation", cost: 25000 },
];

export default function RewardsPage() {
  const [points, setPoints] = useState(SAMPLE_POINTS);
  const [redeemed, setRedeemed] = useState<string[]>([]);

  const currentTierIndex = [...TIERS].reverse().findIndex((t) => points >= t.threshold);
  const currentTier = TIERS[TIERS.length - 1 - currentTierIndex];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progressToNext = nextTier
    ? Math.min(100, Math.round(((points - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100))
    : 100;

  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Loyalty Program</p>
        <h1 className="font-heading text-4xl text-balance">MaxLight Rewards</h1>
        <p className="mt-3 text-muted-foreground">Earn points on every purchase and unlock better perks as you go.</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border p-6">
            <f.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
            <p className="mt-3 font-medium">{f.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-center font-heading text-2xl">Membership Tiers</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "rounded-2xl border p-6",
                tier.name === currentTier.name ? "border-gold bg-gold/5" : "border-border"
              )}
            >
              <Award className={cn("h-6 w-6", tier.name === currentTier.name ? "text-gold" : "text-muted-foreground")} strokeWidth={1.5} />
              <p className="mt-3 font-heading text-lg">{tier.name}</p>
              <p className="text-xs text-muted-foreground">{tier.threshold.toLocaleString()}+ points</p>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {tier.perks.map((p) => (
                  <li key={p}>&bull; {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-2xl border border-border p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-gold uppercase">Sample Rewards Dashboard</p>
            <p className="mt-1 font-heading text-2xl">{points.toLocaleString()} points</p>
            <p className="text-sm text-muted-foreground">
              {currentTier.name} Member{nextTier && ` — ${(nextTier.threshold - points).toLocaleString()} points to ${nextTier.name}`}
            </p>
          </div>
          <div className="w-full max-w-xs">
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progressToNext}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {REWARDS.map((r) => {
            const isRedeemed = redeemed.includes(r.id);
            const canAfford = points >= r.cost;
            return (
              <div key={r.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.cost.toLocaleString()} points</p>
                </div>
                <Button
                  size="sm"
                  variant={isRedeemed ? "outline" : "default"}
                  disabled={isRedeemed || !canAfford}
                  onClick={() => {
                    setPoints((p) => p - r.cost);
                    setRedeemed((prev) => [...prev, r.id]);
                    toast.success(`Redeemed: ${r.label}`);
                  }}
                >
                  {isRedeemed ? "Redeemed" : "Redeem"}
                </Button>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          This is a sample dashboard. Sign in to your MaxLight account to view your real points balance.
        </p>
      </div>
    </div>
  );
}
