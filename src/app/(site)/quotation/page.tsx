"use client";

import { useState } from "react";
import { FileText, Clock, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const SCOPE_OPTIONS = [
  { id: "products", label: "Products (lighting, décor, electronics, smart home)" },
  { id: "services", label: "Design Services" },
  { id: "installation", label: "Installation" },
  { id: "interior-design", label: "Full Interior Design" },
];

export default function QuotationPage() {
  const [scope, setScope] = useState<string[]>(["products"]);
  const [submitted, setSubmitted] = useState(false);

  const toggleScope = (id: string) =>
    setScope((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  if (submitted) {
    return (
      <div className="container-max flex flex-col items-center justify-center gap-4 py-32 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
          <FileText className="h-8 w-8 text-gold-foreground" />
        </span>
        <h1 className="font-heading text-3xl">Quotation Request Received</h1>
        <p className="max-w-md text-muted-foreground">
          Our team is preparing your professional quotation. You&rsquo;ll receive a detailed PDF breakdown, with
          estimated timeline, by email within 48 hours.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Request Another Quotation
        </Button>
      </div>
    );
  }

  return (
    <div className="container-max py-14">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Get a Quote</p>
          <h1 className="mt-2 font-heading text-4xl text-balance">Request a Professional Quotation</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Tell us what you need — products, services, installation or a full interior design package — and
            we&rsquo;ll prepare a detailed, no-obligation quotation.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                <ListChecks className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="font-medium">Detailed Project Breakdown</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Every quotation itemises products, labour and installation costs.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Clock className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="font-medium">Estimated Timeline</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  We include a realistic delivery and installation schedule.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                <FileText className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="font-medium">Professional PDF Document</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Delivered straight to your inbox, ready to share or approve.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          className="rounded-2xl border border-border p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
            toast.success("Quotation request submitted");
          }}
        >
          <div className="space-y-3">
            <Label>What do you need a quotation for?</Label>
            {SCOPE_OPTIONS.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <Checkbox
                  id={opt.id}
                  checked={scope.includes(opt.id)}
                  onCheckedChange={() => toggleScope(opt.id)}
                />
                <Label htmlFor={opt.id} className="cursor-pointer text-sm font-normal">
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required placeholder="Jane Wanjiru" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" required placeholder="+254 7XX XXX XXX" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="jane@example.com" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="budget">Estimated Budget (KES)</Label>
              <Input id="budget" placeholder="e.g. 1,000,000" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea id="description" rows={4} required placeholder="Describe the products or services you need..." />
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-6 h-12 w-full">
            Request Quotation
          </Button>
        </form>
      </div>
    </div>
  );
}
