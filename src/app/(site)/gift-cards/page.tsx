"use client";

import { useState } from "react";
import { Gift, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";

const PRESET_AMOUNTS = [2500, 5000, 10000, 20000, 50000];
const OCCASIONS = ["Wedding", "Housewarming", "Birthday", "Anniversary", "Christmas", "Corporate Gift"];

export default function GiftCardsPage() {
  const [amount, setAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) || 0 : amount;

  if (sent) {
    return (
      <div className="container-max flex flex-col items-center justify-center gap-4 py-32 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
          <Check className="h-8 w-8 text-gold-foreground" />
        </span>
        <h1 className="font-heading text-3xl">Gift Card Scheduled</h1>
        <p className="max-w-md text-muted-foreground">
          A {formatKES(finalAmount)} MaxLight gift card for {occasion.toLowerCase()} will be delivered to{" "}
          {recipientName || "your recipient"} as scheduled.
        </p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Send Another Gift Card
        </Button>
      </div>
    );
  }

  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Give the Gift of Home</p>
        <h1 className="font-heading text-4xl text-balance">MaxLight Gift Cards</h1>
        <p className="mt-3 text-muted-foreground">
          The perfect gift for a wedding, housewarming or any occasion — let them choose exactly what their home
          needs.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl bg-ink p-8 text-white">
          <div className="flex items-center justify-between">
            <p className="font-heading text-xl">
              Max<span className="text-gold">Light</span>
            </p>
            <Gift className="h-6 w-6 text-gold" />
          </div>
          <p className="mt-10 text-xs tracking-[0.2em] text-white/50 uppercase">{occasion}</p>
          <p className="mt-2 font-heading text-4xl text-gold">{formatKES(finalAmount || 0)}</p>
          {message && <p className="mt-6 text-sm text-white/70 italic">&ldquo;{message}&rdquo;</p>}
          <p className="mt-10 text-xs text-white/40">Gift Card Preview — MaxLight Kenya</p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!finalAmount || finalAmount <= 0) {
              toast.error("Please choose or enter a gift card amount");
              return;
            }
            setSent(true);
          }}
        >
          <div>
            <p className="mb-3 text-sm font-semibold">Choose Amount (KES)</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => {
                    setAmount(a);
                    setCustomAmount("");
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium",
                    amount === a && !customAmount ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30"
                  )}
                >
                  {formatKES(a)}
                </button>
              ))}
            </div>
            <Input
              className="mt-2"
              placeholder="Or enter a custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Occasion</Label>
            <Select
              value={occasion}
              onValueChange={(v) => v && setOccasion(v)}
              items={Object.fromEntries(OCCASIONS.map((o) => [o, o]))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OCCASIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="recipient-name">Recipient Name</Label>
              <Input id="recipient-name" required value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Recipient's name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="recipient-email">Recipient Email</Label>
              <Input id="recipient-email" type="email" required placeholder="recipient@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="delivery-date">Schedule Delivery</Label>
              <Input id="delivery-date" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sender-name">Your Name</Label>
              <Input id="sender-name" required placeholder="Your name" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="message">Personal Message</Label>
              <Textarea
                id="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a short message..."
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="h-12 w-full gap-2">
            <Sparkles className="h-4 w-4" /> Send Gift Card
          </Button>
        </form>
      </div>
    </div>
  );
}
