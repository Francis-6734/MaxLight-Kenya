import type { Metadata } from "next";
import Link from "next/link";
import { Target, Eye, Award, Users, Sparkles } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MaxLight Kenya is East Africa's complete Home Interior Company — products, installation, consultation and design, all under one roof.",
};

const values = [
  { icon: Award, title: "Premium Quality", desc: "Every product and installation meets a professional, lasting standard." },
  { icon: Users, title: "Client-First", desc: "We design around how you actually live, not just how a room photographs." },
  { icon: Sparkles, title: "Complete Service", desc: "From a single lamp to a full renovation — one team, start to finish." },
];

export default async function AboutPage() {
  const designers = await db.designer.findMany({ where: { published: true }, orderBy: { createdAt: "asc" }, take: 4 });

  return (
    <div>
      <section className="container-max py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">About MaxLight Kenya</p>
          <h1 className="font-heading text-4xl text-balance sm:text-5xl">Everything Your Home Deserves, Under One Roof</h1>
          <p className="mt-4 text-muted-foreground text-balance">
            MaxLight Kenya specializes in everything that concerns home interiors. We are not just an electronics
            shop — we are a complete Home Interior Company offering products, installations, consultation and
            complete interior solutions. Our customers can furnish an entire house from our platform.
          </p>
        </div>
      </section>

      <section className="container-max grid gap-6 pb-16 sm:grid-cols-2">
        <div className="rounded-2xl border border-border p-8">
          <Target className="h-7 w-7 text-gold" strokeWidth={1.5} />
          <p className="mt-4 font-heading text-2xl">Our Mission</p>
          <p className="mt-2 text-muted-foreground">
            To transform houses into beautiful, comfortable, smart and luxurious homes.
          </p>
        </div>
        <div className="rounded-2xl border border-border p-8">
          <Eye className="h-7 w-7 text-gold" strokeWidth={1.5} />
          <p className="mt-4 font-heading text-2xl">Our Vision</p>
          <p className="mt-2 text-muted-foreground">
            To become Africa&rsquo;s leading Home Interior Marketplace and Interior Design Company.
          </p>
        </div>
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="container-max grid gap-6 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl bg-background p-6">
              <v.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
              <p className="mt-3 font-medium">{v.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-max py-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Our Team</p>
          <h2 className="font-heading text-3xl">Meet the People Behind Your Home</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {designers.map((d) => (
            <Link key={d.id} href={`/designers/${d.slug}`} className="group text-center">
              <div className="relative mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-full">
                <ImagePlaceholder gradient={d.gradient} icon={d.icon} image={d.imageUrl} />
              </div>
              <p className="mt-4 font-medium group-hover:underline">{d.name}</p>
              <p className="text-sm text-gold">{d.position}</p>
              <p className="mt-1 text-xs text-muted-foreground">{d.experience} experience</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/designers" className="text-sm font-medium hover:underline">
            View all team members
          </Link>
        </div>
      </section>

      <section className="container-max pb-20">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-ink px-8 py-14 text-center text-white">
          <h2 className="font-heading text-3xl text-balance sm:text-4xl">Ready to transform your space?</h2>
          <p className="max-w-md text-white/70">
            Book a free consultation and let our design team bring your vision to life.
          </p>
          <Link
            href="/book-consultation"
            className={cn(buttonVariants({ size: "lg" }), "h-12 bg-gold px-6 text-base text-gold-foreground hover:bg-gold/90")}
          >
            Book Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
