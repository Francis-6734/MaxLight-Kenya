import type { Metadata } from "next";
import { Percent, Truck, UserCog, LayoutDashboard, FileText, History } from "lucide-react";
import { TradeSignupForm } from "@/components/trade/trade-signup-form";

export const metadata: Metadata = {
  title: "Trade Accounts",
  description:
    "Dedicated business accounts for architects, interior designers, contractors, developers and hotels — with special pricing and a dedicated account manager.",
};

const benefits = [
  { icon: Percent, title: "Special Pricing", desc: "Trade-only rates across our full catalog." },
  { icon: Percent, title: "Bulk Discounts", desc: "Volume pricing on large project orders." },
  { icon: UserCog, title: "Dedicated Account Manager", desc: "A single point of contact for every project." },
  { icon: Truck, title: "Priority Delivery", desc: "Jump the queue on time-sensitive installs." },
  { icon: LayoutDashboard, title: "Business Dashboard", desc: "Manage quotations and orders in one place." },
  { icon: FileText, title: "Quotation Management", desc: "Request, track and approve quotations online." },
  { icon: History, title: "Purchase History & Invoices", desc: "Full visibility for accounting and reporting." },
];

const audiences = ["Architects", "Interior Designers", "Contractors", "Property Developers", "Hotels", "Corporate Clients"];

export default function TradeAccountsPage() {
  return (
    <div className="container-max py-14">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">For Professionals</p>
          <h1 className="mt-2 font-heading text-4xl text-balance">Trade Accounts</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Dedicated business accounts with special pricing, bulk discounts and a dedicated account manager —
            built for architects, designers, contractors, developers, hotels and corporate clients.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {audiences.map((a) => (
              <span key={a} className="rounded-full border border-border px-3 py-1.5 text-sm">
                {a}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <b.icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-medium">{b.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <TradeSignupForm />
      </div>
    </div>
  );
}
