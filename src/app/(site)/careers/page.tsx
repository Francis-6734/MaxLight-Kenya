import type { Metadata } from "next";
import { Briefcase, Mail } from "lucide-react";

export const metadata: Metadata = { title: "Careers" };

const openRoles = [
  { title: "Interior Designer", type: "Full-time", location: "Nairobi" },
  { title: "Installation Technician — Smart Home & Security", type: "Full-time", location: "Nairobi" },
  { title: "Sales Representative", type: "Full-time", location: "Mombasa" },
  { title: "Warehouse Assistant", type: "Full-time", location: "Nairobi" },
];

export default function CareersPage() {
  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Careers</p>
        <h1 className="font-heading text-4xl text-balance">Build Kenya&rsquo;s Home Interior Future With Us</h1>
        <p className="mt-3 text-muted-foreground">
          We&rsquo;re always looking for talented designers, technicians and sales professionals who care about
          craft and customer experience.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl space-y-3">
        {openRoles.map((role) => (
          <div key={role.title} className="flex items-center justify-between rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <Briefcase className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <div>
                <p className="font-medium">{role.title}</p>
                <p className="text-xs text-muted-foreground">
                  {role.type} &middot; {role.location}
                </p>
              </div>
            </div>
            <a
              href="mailto:careers@maxlightkenya.com"
              className="text-sm font-medium underline underline-offset-2 hover:text-gold"
            >
              Apply
            </a>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-2 text-sm text-muted-foreground">
        <Mail className="h-4 w-4" /> Don&rsquo;t see your role? Send your CV to careers@maxlightkenya.com
      </div>
    </div>
  );
}
