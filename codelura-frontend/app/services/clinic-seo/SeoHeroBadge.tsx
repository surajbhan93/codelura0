"use client";

import { TypeAnimation } from "react-type-animation";

/**
 * Isolated client component — only this tiny piece needs "use client"
 * because react-type-animation runs in the browser. Keeping it separate
 * lets the parent page.tsx stay a Server Component, which is required
 * for it to export `metadata`.
 */
export default function SeoHeroBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
      <TypeAnimation
        sequence={[
          "Healthcare · Clinic SEO",
          2000,
          "Healthcare · Local Rankings",
          2000,
          "Healthcare · Maps Visibility",
          2000,
          "Healthcare · Review Growth",
          2000,
        ]}
        wrapper="span"
        speed={60}
        repeat={Infinity}
        aria-hidden="true"
      />
      {/* Static fallback so crawlers / no-JS / screen readers still get real text */}
      <span className="sr-only">Healthcare · Clinic SEO</span>
    </span>
  );
}