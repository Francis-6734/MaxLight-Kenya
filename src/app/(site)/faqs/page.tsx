import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about shopping, delivery, installation and payments at MaxLight Kenya.",
};

const faqs = [
  {
    q: "What areas do you deliver to?",
    a: "We deliver countrywide across Kenya. Nairobi and its environs typically receive orders within 3–5 business days, while upcountry deliveries may take 5–10 business days depending on location and product availability.",
  },
  {
    q: "Do you install the products you sell?",
    a: "Yes. Lighting, smart locks, CCTV and smart home devices can all be professionally installed by our in-house team. Installation can be added at checkout or booked separately via our Services page.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept M-Pesa, Visa, Mastercard and direct bank transfer. Trade account holders can also arrange invoiced payment terms.",
  },
  {
    q: "Can I return a product if I change my mind?",
    a: "Unused products in original packaging can be returned within 7 days of delivery. Custom-made items (bespoke lighting fixtures, fitted cabinetry) are made to order and are non-returnable unless faulty.",
  },
  {
    q: "Do you offer warranties?",
    a: "Most products carry a manufacturer warranty of 1–2 years, and select premium ranges carry extended coverage. Warranty details are listed on each product page.",
  },
  {
    q: "Can I book a free design consultation?",
    a: "Yes — we offer a free initial consultation for projects above KES 200,000. You can book a slot any time via our Book Consultation page.",
  },
  {
    q: "Do you work with architects, contractors and hotels?",
    a: "Yes, we offer dedicated Trade Accounts for architects, interior designers, contractors, developers and hospitality clients, with special pricing and a dedicated account manager.",
  },
];

export default function FaqsPage() {
  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Support</p>
        <h1 className="font-heading text-4xl text-balance">Frequently Asked Questions</h1>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <Accordion className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
