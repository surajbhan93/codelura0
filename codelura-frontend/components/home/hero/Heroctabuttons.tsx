"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
// import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, ChevronRight, Play } from "lucide-react";

/* framer-motion + the YouTube iframe only load the first time
   the user actually clicks "Watch Demo" — ssr:false keeps it
   out of the server-rendered HTML and out of the initial bundle
   entirely. This is the single biggest bundle-size win. */
const DemoModal = dynamic(() => import("../DemoModal"), {
  ssr: false,
  loading: () => null,
});

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (frame.current) cancelAnimationFrame(frame.current);
    const clientX = e.clientX;
    const clientY = e.clientY;
    frame.current = requestAnimationFrame(() => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      setPos({
        x: (clientX - r.left - r.width / 2) * 0.28,
        y: (clientY - r.top - r.height / 2) * 0.28,
      });
    });
  }, []);

  const handleLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  );
}

export default function HeroCTAButtons() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="anim-fade-up mt-9 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
      style={{ animationDelay: "0.45s" }}
    >
      <Magnetic>
        <a href="https://career.codelura.com/career" aria-label="Get started with Codelura">
          <Button className="group h-13 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-base font-semibold text-white shadow-xl shadow-violet-700/40 hover:shadow-violet-700/60 transition-all duration-300 hover:scale-[1.03]">
            <Rocket className="mr-2 h-4 w-4 transition-transform group-hover:-rotate-12" />
            Get Started career
            <ChevronRight className="ml-1 h-4 w-4 opacity-70" />
          </Button>
        </a>
      </Magnetic>

      <Magnetic>
       <Button
  asChild
  variant="outline"
  className="h-13 rounded-full border-white/15 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur hover:border-white/30 hover:bg-white/10 transition-all duration-300"
>
  <a
    href="https://build.codelura.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Explore Codelura Services"
  >
    <Play className="mr-2 h-4 w-4 fill-white/80" />
    Explore Our Services
  </a>
</Button>
      </Magnetic>

      {open && <DemoModal onClose={() => setOpen(false)} />}
    </div>
  );
}