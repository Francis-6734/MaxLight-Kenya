import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Returns & Warranty" };

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Returns & Warranty"
      intro="We want you to love every purchase. Here's how our returns and warranty process works."
      sections={[
        {
          heading: "Returns",
          paragraphs: [
            "Unused products in original packaging may be returned within 7 days of delivery for a full refund or exchange. Custom-made items (bespoke lighting fixtures, fitted cabinetry) are non-returnable unless faulty or damaged on arrival.",
          ],
        },
        {
          heading: "Warranty Coverage",
          paragraphs: [
            "Most products carry a 1–2 year manufacturer warranty covering defects in materials or workmanship. Warranty periods vary by category and are listed on each product page.",
          ],
        },
        {
          heading: "How to Request a Return or Warranty Claim",
          paragraphs: [
            "Contact our support team via WhatsApp, phone or the Contact page with your order number and a description (and photos, where relevant) of the issue. Our team will guide you through the next steps.",
          ],
        },
      ]}
    />
  );
}
