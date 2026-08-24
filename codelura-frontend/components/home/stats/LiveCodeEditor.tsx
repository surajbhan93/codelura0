// components/stats/LiveCodeEditor.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CODE_LINES, CodeLine } from "./codeData";

export default function LiveCodeEditor() {
  const [visibleLines, setVisibleLines] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    
   let interval: ReturnType<typeof setInterval> | null = null;

const timeout = setTimeout(() => {
  interval = setInterval(() => {
    setVisibleLines((prev) => {
      if (prev >= CODE_LINES.length) {
        if (interval) clearInterval(interval);
        return prev;
      }
      return prev + 1;
    });
  }, 100);
}, 500);

return () => {
  clearTimeout(timeout);
  if (interval) clearInterval(interval);
};
  }, [inView]);

  return (
    <div ref={ref} className="relative h-full min-h-[260px] md:min-h-[380px] rounded-2xl border border-white/10 bg-[#0a0a14] overflow-hidden shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/8 bg-white/3 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-amber-500/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-xs text-white/30 font-mono">codelura.sdk.ts</span>
        <span className="ml-auto text-[10px] text-emerald-400/60 font-mono">● TypeScript</span>
      </div>

      {/* Line numbers + code */}
      <div className="p-5 font-mono text-sm leading-7 overflow-auto max-h-[380px] scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
        {CODE_LINES.slice(0, visibleLines || 1).map((line: CodeLine, i: number) => (
          <div key={i} className="flex group">
            <span className="mr-5 w-5 shrink-0 select-none text-right text-xs text-white/20 leading-7">
              {i + 1}
            </span>
            <span style={{ paddingLeft: `${line.indent * 12}px` }} className="flex flex-wrap items-center gap-x-[2px]">
              {line.tokens.length === 0 ? (
                <span className="text-transparent">_</span>
              ) : (
                line.tokens.map((tok, j) => (
                  <span key={j} style={{ color: tok.color }}>{tok.text}</span>
                ))
              )}
              {i === visibleLines - 1 && visibleLines < CODE_LINES.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  className="inline-block w-[2px] h-4 bg-emerald-400 ml-0.5 align-middle"
                />
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-between border-t border-white/5 bg-[#06060f] px-4 py-1.5 text-[10px] font-mono text-white/25">
        <span>Ln {Math.min(visibleLines, CODE_LINES.length)}, Col 1</span>
        <span className="text-emerald-400/50">✓ No errors</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}