"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, X, Send, Bot } from "lucide-react";
import { getAssistantReply, SUGGESTION_CHIPS } from "@/lib/ai-assistant-replies";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  text: string;
  link?: { label: string; href: string };
}

const GREETING: Message = {
  role: "assistant",
  text: "Hi! I'm the MaxLight AI Interior Assistant. Ask me about products, budgets, colour palettes or room designs.",
};

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = getAssistantReply(trimmed);
      setMessages((prev) => [...prev, { role: "assistant", ...reply }]);
      setTyping(false);
    }, 700);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Interior Assistant"
        className="fixed right-5 bottom-24 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-ink text-gold shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95"
        style={{ height: "3.25rem", width: "3.25rem" }}
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed right-5 bottom-[9.5rem] z-40 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border bg-ink px-4 py-3 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20">
              <Bot className="h-4 w-4 text-gold" />
            </span>
            <div>
              <p className="text-sm font-medium">MaxLight AI Assistant</p>
              <p className="text-xs text-white/50">Interior design help, instantly</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
                    m.role === "user" ? "bg-foreground text-background" : "bg-secondary text-foreground"
                  )}
                >
                  <p>{m.text}</p>
                  {m.link && (
                    <Link
                      href={m.link.href}
                      onClick={() => setOpen(false)}
                      className="mt-1.5 inline-block text-xs font-medium underline underline-offset-2"
                    >
                      {m.link.label} &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-secondary px-3.5 py-2 text-sm text-muted-foreground">Typing...</div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => send(chip)}
                    className="rounded-full border border-border px-2.5 py-1 text-xs hover:border-foreground/30 hover:bg-muted"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about lighting, budget, colours..."
              className="flex-1 rounded-full border border-border px-3.5 py-2 text-sm outline-none focus:border-foreground/30"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
