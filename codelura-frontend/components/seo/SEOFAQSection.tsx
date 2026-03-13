// ═══════════════════════════════════════════════════════════════
// components/seo/SEOFAQSection.tsx
// ═══════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";

type FAQ = { q: string; a: string };

export function SEOFAQSection({
  faqs,
  title,
}: {
  faqs: FAQ[];
  title: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-widest text-cyan-400 mb-3 font-semibold">
          Common Questions
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-white">
          FAQs about {title}
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-white/10 rounded-xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
            >
              <span className="font-semibold text-white text-sm md:text-base">
                {faq.q}
              </span>
              <span
                className="text-2xl text-cyan-400 shrink-0 transition-transform duration-300"
                style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
              >
                +
              </span>
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

