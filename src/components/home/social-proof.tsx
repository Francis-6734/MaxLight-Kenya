import { Quote, Star } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  PinterestIcon,
  YoutubeIcon,
} from "@/components/icons/social-icons";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

const stats = [
  { value: "500+", label: "Projects Delivered" },
  { value: "4.8/5", label: "Average Customer Rating" },
  { value: "10,000+", label: "Products Available" },
  { value: "24/7", label: "Customer Support" },
];

const socialStrip = [
  { icon: InstagramIcon, label: "@maxlightkenya" },
  { icon: TikTokIcon, label: "@maxlightkenya" },
  { icon: FacebookIcon, label: "MaxLight Kenya" },
  { icon: PinterestIcon, label: "MaxLight Kenya" },
  { icon: YoutubeIcon, label: "MaxLight Kenya" },
];

interface Testimonial {
  id: string;
  title: string;
  clientTestimonial: string | null;
  clientName: string | null;
}

export function SocialProof({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="container-max py-20">
      <div className="grid grid-cols-2 gap-6 border-b border-border pb-14 sm:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05} className="text-center">
            <p className="font-heading text-3xl text-gold sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
          </Reveal>
        ))}
      </div>

      {testimonials.length > 0 && (
        <div className="pt-14">
          <SectionHeading eyebrow="Client Stories" title="What Our Clients Say" align="center" />
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.07}>
                <div className="flex h-full flex-col rounded-2xl border border-border p-6">
                  <Quote className="h-6 w-6 text-gold" />
                  <p className="mt-4 flex-1 text-sm text-muted-foreground text-balance">
                    &ldquo;{project.clientTestimonial}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-medium">{project.clientName}</p>
                  <p className="text-xs text-muted-foreground">{project.title}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <Reveal className="mt-14 flex flex-col items-center gap-5 rounded-2xl bg-secondary/60 px-6 py-8 text-center">
        <p className="font-heading text-xl">Join the MaxLight Community</p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          {socialStrip.map((s) => (
            <span key={s.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <s.icon className="h-4 w-4" /> {s.label}
            </span>
          ))}
        </div>
        <p className="text-xs tracking-wide text-muted-foreground uppercase">#MyMaxLightHome</p>
      </Reveal>
    </section>
  );
}
