import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      intro="MaxLight Kenya respects your privacy. This policy explains what information we collect, how we use it, and the choices you have."
      sections={[
        {
          heading: "Information We Collect",
          paragraphs: [
            "We collect information you provide directly, such as your name, phone number, email, delivery address and payment details, when you create an account, place an order, or request a consultation or quotation.",
            "We also collect usage data automatically, including pages visited, products viewed and general device information, to help us improve the platform.",
          ],
        },
        {
          heading: "How We Use Your Information",
          paragraphs: [
            "We use your information to process orders and payments, coordinate deliveries and installations, respond to enquiries, and — where you've opted in — send updates about offers and new products.",
          ],
        },
        {
          heading: "Sharing of Information",
          paragraphs: [
            "We share information only with trusted service providers (payment processors, delivery partners, installation teams) as necessary to fulfil your order. We do not sell your personal information to third parties.",
          ],
        },
        {
          heading: "Your Rights",
          paragraphs: [
            "You may request access to, correction of, or deletion of your personal data at any time by contacting hello@maxlightkenya.com.",
          ],
        },
      ]}
    />
  );
}
