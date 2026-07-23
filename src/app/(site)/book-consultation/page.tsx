"use client";

import { useActionState } from "react";
import { CalendarCheck, MapPin, Ruler, Sparkles, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitConsultationRequestAction, type ConsultationFormState } from "@/lib/actions/consultation-actions";

const CONSULTATION_TYPES = [
  "Interior Consultation",
  "Site Visit",
  "Lighting Consultation",
  "Kitchen Design",
  "Office Design",
];

const PROJECT_TYPES = [
  "Home",
  "Apartment",
  "Hotel",
  "Restaurant",
  "Office",
  "Commercial Building",
  "School",
  "Hospital",
  "Construction Project",
];

const steps = [
  { icon: CalendarCheck, title: "Book Online", desc: "Choose your consultation type and preferred date." },
  { icon: MapPin, title: "We Visit or Call", desc: "A designer visits your site or connects with you remotely." },
  { icon: Ruler, title: "Get a Plan", desc: "Receive tailored design recommendations and a cost estimate." },
  { icon: Sparkles, title: "Bring It to Life", desc: "We handle products, installation and project management." },
];

const initialState: ConsultationFormState = {};

export default function BookConsultationPage() {
  const [state, formAction, pending] = useActionState(submitConsultationRequestAction, initialState);

  if (state.success) {
    return (
      <div className="container-max flex flex-col items-center justify-center gap-4 py-32 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
          <CalendarCheck className="h-8 w-8 text-gold-foreground" />
        </span>
        <h1 className="font-heading text-3xl">Consultation Request Received</h1>
        <p className="max-w-md text-muted-foreground">
          Thank you! Our design team will reach out within 24 hours to confirm your appointment.
        </p>
      </div>
    );
  }

  return (
    <div className="container-max py-14">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Talk to a Designer</p>
          <h1 className="mt-2 font-heading text-4xl text-balance">Book Your Free Consultation</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Whether it&rsquo;s a single room or a full property, our design team will help you plan, budget and
            bring your vision to life.
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

        <form action={formAction} className="rounded-2xl border border-border p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required placeholder="Jane Wanjiru" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" required placeholder="+254 7XX XXX XXX" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" required placeholder="e.g. Karen, Nairobi" />
            </div>

            <div className="space-y-1.5">
              <Label>Consultation Type</Label>
              <Select
                name="consultationType"
                defaultValue={CONSULTATION_TYPES[0]}
                items={Object.fromEntries(CONSULTATION_TYPES.map((t) => [t, t]))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTATION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Project Type</Label>
              <Select
                name="projectType"
                defaultValue={PROJECT_TYPES[0]}
                items={Object.fromEntries(PROJECT_TYPES.map((t) => [t, t]))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <Input id="preferredDate" name="preferredDate" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="preferredTime">Preferred Time</Label>
              <Input id="preferredTime" name="preferredTime" type="time" required />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="budget">Estimated Budget (KES)</Label>
              <Input id="budget" name="budget" placeholder="e.g. 500,000" />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Tell us about your project</Label>
              <Textarea id="description" name="description" rows={4} placeholder="Describe your space, style preferences and goals..." />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="images">Upload Images or Floor Plan (optional)</Label>
              <label
                htmlFor="images"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border py-6 text-sm text-muted-foreground hover:border-foreground/30"
              >
                <Upload className="h-4 w-4" /> Click to upload files
              </label>
              <input
                id="images"
                name="images"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
              />
            </div>
          </div>

          {state.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}

          <Button type="submit" size="lg" className="mt-6 h-12 w-full" disabled={pending}>
            {pending ? "Submitting..." : "Submit Consultation Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}
