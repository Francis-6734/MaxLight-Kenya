import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Delivery Information" };

export default function DeliveryPage() {
  return (
    <LegalPage
      title="Delivery Information"
      intro="We deliver across Kenya, with professional installation available for lighting, electronics, security and smart home products."
      sections={[
        {
          heading: "Delivery Timelines",
          paragraphs: [
            "Nairobi & environs: 3–5 business days.",
            "Major towns (Mombasa, Kisumu, Nakuru, Eldoret): 5–7 business days.",
            "Other regions: 7–10 business days.",
            "Custom-made items (bespoke lighting fixtures, fitted cabinetry) may take 2–4 weeks depending on specification.",
          ],
        },
        {
          heading: "Delivery Fees",
          paragraphs: [
            "Delivery fees are calculated at checkout based on order size, weight and location. Trade account holders enjoy discounted or waived delivery on qualifying orders.",
          ],
        },
        {
          heading: "Installation Scheduling",
          paragraphs: [
            "Where installation is included or requested, our team will contact you within 24 hours of delivery to schedule a convenient time.",
          ],
        },
      ]}
    />
  );
}
