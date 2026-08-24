"use client";

import { useState } from "react";

export default function FaqAccordion({
  faqs,
}: {
  faqs: { q: string; a: string }[];
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900/40">
      {faqs.map((f, i) => {
        const open = openFaq === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpenFaq(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-slate-200"
            >
              {f.q}
              <span className="text-slate-500">{open ? "−" : "+"}</span>
            </button>
            {open && (
              <p className="px-4 pb-4 text-xs leading-relaxed text-slate-500">
                {f.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}