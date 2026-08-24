// components/stats/TrustStrip.tsx
"use client";

import { motion } from "framer-motion";

const TRUSTED = ["Google", "Amazon", "Microsoft", "Meta", "Netflix", "Stripe"];

export default function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-2 text-center"
      aria-label="Trusted by developers at leading companies"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
        Trusted by developers at
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {TRUSTED.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="text-base font-bold tracking-tight text-white/20 transition-colors duration-300 hover:text-white/50 cursor-default select-none"
          >
            {name}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}