"use client";

import { WhatsAppIcon } from "@/components/icons/social-icons";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/254712999191"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95"
      style={{ height: "3.25rem", width: "3.25rem" }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
