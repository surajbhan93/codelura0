"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/* This file only loads on first click of "Watch Demo" — see the
   next/dynamic(..., { ssr:false }) import in HeroSection.tsx.
   Keeping framer-motion + the YouTube iframe here means neither
   ships in the critical initial JS bundle. */
export default function DemoModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="modal-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md"
      >
        <motion.div
          key="modal-box"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[92%] max-w-3xl rounded-2xl border border-white/10 bg-[#0d0c1a] p-4 shadow-2xl"
        >
          <button
            onClick={onClose}
            aria-label="Close video modal"
            className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition"
          >
            <X className="h-4 w-4" />
          </button>
          <iframe
            className="h-[320px] w-full rounded-xl md:h-[420px]"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Codelura Platform Demo"
            loading="lazy"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}