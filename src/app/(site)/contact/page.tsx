import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with MaxLight Kenya — visit our showroom, call, email or send us a message.",
};

const info = [
  { icon: MapPin, label: "Showroom", value: "Mombasa Road, Nairobi, Kenya" },
  { icon: Phone, label: "Phone", value: "+254 700 000 000" },
  { icon: Mail, label: "Email", value: "hello@maxlightkenya.com" },
  { icon: Clock, label: "Hours", value: "Mon – Sat, 8:00am – 6:00pm" },
];

export default function ContactPage() {
  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Get in Touch</p>
        <h1 className="font-heading text-4xl text-balance">We&rsquo;d Love to Hear From You</h1>
        <p className="mt-3 text-muted-foreground">
          Questions about a product, project or partnership? Reach out and our team will respond promptly.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <ImagePlaceholder gradient="from-emerald-100 via-stone-50 to-white" icon="MapPin" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {info.map((i) => (
              <div key={i.label} className="flex items-start gap-3 rounded-xl border border-border p-4">
                <i.icon className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-muted-foreground">{i.label}</p>
                  <p className="text-sm font-medium">{i.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
