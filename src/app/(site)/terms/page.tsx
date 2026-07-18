import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 2026"
      intro="These terms govern your use of the MaxLight Kenya website and services. By placing an order or booking a service, you agree to these terms."
      sections={[
        {
          heading: "Orders & Payment",
          paragraphs: [
            "All prices are listed in Kenyan Shillings (KES) and are subject to change without notice. Orders are confirmed once payment is received via M-Pesa, card or bank transfer.",
          ],
        },
        {
          heading: "Delivery & Installation",
          paragraphs: [
            "Delivery timelines are estimates and may vary based on location and product availability. Installation services must be booked separately or added at checkout and are subject to site assessment.",
          ],
        },
        {
          heading: "Returns & Warranty",
          paragraphs: [
            "Please refer to our Returns & Warranty page for details on eligibility, timelines and process for returns, exchanges and warranty claims.",
          ],
        },
        {
          heading: "Limitation of Liability",
          paragraphs: [
            "MaxLight Kenya is not liable for indirect or consequential damages arising from the use of products or services purchased through this platform, to the extent permitted by Kenyan law.",
          ],
        },
      ]}
    />
  );
}
