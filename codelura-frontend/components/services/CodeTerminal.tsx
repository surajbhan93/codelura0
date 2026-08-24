// components/CodeTerminal.tsx (Client Component)
"use client";

import { useEffect, useState } from "react";

// ─── Code Lines to Display ───
const codeLines = [
  { text: "// building your next product", color: "text-slate-500" },
  { text: "const codelura = {", color: "text-sky-300" },
  { text: "  stack: ['Next.js', 'React', 'Node'],", color: "text-slate-200" },
  { text: "  design: 'pixel-perfect',", color: "text-slate-200" },
  { text: "  seo: 'baked-in',", color: "text-slate-200" },
  { text: "  support: '24/7',", color: "text-slate-200" },
  { text: "};", color: "text-sky-300" },
  { text: "", color: "" },
  { text: "deploy(codelura.yourIdea); ✓", color: "text-emerald-400" },
];

export default function CodeTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // ─── Typing Animation Logic ───
  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function typeNext() {
      // Reset animation after all lines complete
      if (lineIndex >= codeLines.length) {
        timeoutId = setTimeout(() => {
          lineIndex = 0;
          charIndex = 0;
          setVisibleLines(0);
          setCharCount(0);
          typeNext();
        }, 2600);
        return;
      }

      const currentLine = codeLines[lineIndex].text;

      // Type character by character
      if (charIndex <= currentLine.length) {
        setVisibleLines(lineIndex);
        setCharCount(charIndex);
        charIndex += 1;
        timeoutId = setTimeout(typeNext, currentLine.length === 0 ? 80 : 22);
      } else {
        // Move to next line
        lineIndex += 1;
        charIndex = 0;
        timeoutId = setTimeout(typeNext, 120);
      }
    }

    timeoutId = setTimeout(typeNext, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B1120] shadow-[0_30px_80px_-20px_rgba(37,99,235,0.45)] sm:max-w-md">
      {/* ─── Window Chrome (Minimize/Maximize/Close) ─── */}
      <div className="flex items-center gap-2 border-b border-white/10 px-2 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-[11px] font-mono text-slate-500">
          codelura.build
        </span>
      </div>

      {/* ─── Code Body ─── */}
      <div className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-6 min-h-[210px] sm:px-5 sm:py-5 sm:text-[13px] sm:min-h-[230px]">
        {codeLines.map((line, idx) => {
          // Hide lines not yet visible
          if (idx > visibleLines) return <div key={idx} className="h-6" />;
          
          // Show partial line if currently typing
          const text = idx === visibleLines 
            ? line.text.slice(0, charCount) 
            : line.text;
          
          return (
            <div key={idx} className={`${line.color} whitespace-pre`}>
              {text}
              {/* Blinking cursor */}
              {idx === visibleLines && (
                <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-[1px] animate-pulse bg-sky-400" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}