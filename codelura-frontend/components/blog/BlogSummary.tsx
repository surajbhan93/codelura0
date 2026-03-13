"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import he from "he";
import sanitizeHtml from "sanitize-html";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  content: string;
  initialSummary?: string;
  isAdmin?: boolean;
  onSummaryGenerated?: (summary: string) => void;
}

export default function BlogSummary({
  content,
  initialSummary,
  isAdmin = false,
  onSummaryGenerated,
}: Props) {
  const [summary, setSummary] = useState<string | null>(
    initialSummary || null
  );
  const [loading, setLoading] = useState(false);

  /* ---------------- CLEAN SUMMARY ---------------- */
  const cleanSummary = (raw: string) => {
    if (!raw) return "";

    const decoded = he.decode(raw);

    return sanitizeHtml(decoded, {
      allowedTags: ["p", "strong", "b", "i", "em", "ul", "ol", "li", "br"],
      allowedAttributes: {},
    });
  };

  /* ---------------- GENERATE SUMMARY ---------------- */
  const generateSummary = async () => {
    if (!content) return;

    try {
      setLoading(true);
      setSummary(null);

      const startTime = Date.now();

      const { data } = await api.post("/ai/blog-summary", {
        content,
      });

      const cleaned = cleanSummary(data.summary);

      // 🔥 Minimum 3.5 sec loading feel
      const elapsed = Date.now() - startTime;
      const remaining = 3500 - elapsed;

      if (remaining > 0) {
        await new Promise((res) => setTimeout(res, remaining));
      }

      setSummary(cleaned);

      if (onSummaryGenerated) {
        onSummaryGenerated(cleaned);
      }
    } catch (error) {
      console.error("Summary generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSummary) {
      setSummary(cleanSummary(initialSummary));
    }
  }, [initialSummary]);

  if (!summary && !isAdmin && !loading) return null;

  return (
    <div className="mt-10 border border-indigo-200 rounded-xl bg-indigo-50 shadow-sm p-6">
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          🤖 AI Summary
        </h2>

        {isAdmin && (
          <button
            onClick={generateSummary}
            disabled={loading}
            className="bg-indigo-600 text-white px-3 py-1.5 text-sm rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Summary"}
          </button>
        )}
      </div>

      {/* CONTENT */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"
              />
              <span>AI is analyzing and summarizing your content...</span>
            </div>

            {/* Skeleton */}
            <div className="space-y-2 mt-2">
              <div className="h-3 bg-indigo-200 rounded w-5/6 animate-pulse" />
              <div className="h-3 bg-indigo-200 rounded w-4/6 animate-pulse" />
              <div className="h-3 bg-indigo-200 rounded w-3/6 animate-pulse" />
            </div>
          </motion.div>
        )}

        {!loading && summary && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}