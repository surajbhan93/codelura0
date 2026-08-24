"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Tip = { p: "hi" | "me" | "lo"; t: string };
type Category = { key: string; score: number; max: number; tips: Tip[] };
type KeywordMatch = { pct: number; hit: string[]; miss: string[] };
type AtsResult = {
  total: number;
  cats: Category[];
  kw: KeywordMatch | null;
  wc: number;
};

const MAX_TOTAL = 100;

function scoreColor(pct: number) {
  if (pct >= 80) return "text-emerald-400";
  if (pct >= 50) return "text-amber-400";
  return "text-rose-400";
}

function barColor(pct: number) {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

function priorityBadge(p: Tip["p"]) {
  switch (p) {
    case "hi":
      return "bg-rose-500/15 text-rose-300 border-rose-500/30";
    case "me":
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 border-slate-500/30";
  }
}

// Manual rounded-rect path — avoids relying on CanvasRenderingContext2D.roundRect,
// which isn't in every TS "lib.dom" version and isn't supported in older browsers.
function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export default function AtsCheckerTool() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AtsResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [resumeStats, setResumeStats] = useState<{ pages: number; words: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"text" | "upload">("text");

  const canSubmit = (resume.trim().length >= 20 || resumeStats) && !loading;

  // Extract text from PDF — runs fully client-side via pdfjs-dist (the browser
  // build of PDF.js). Install: npm install pdfjs-dist
  const extractTextFromPDF = useCallback(async (file: File): Promise<string> => {
    try {
      // react-pdf is NOT a dependency in this project — import pdfjs directly
      // from pdfjs-dist (already installed), which also guarantees the API
      // version here matches the worker file copied by the postinstall script.
      const pdfjs = await import("pdfjs-dist");

      // IMPORTANT: point directly at the static worker file in /public.
      // Do NOT use `new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url)` —
      // that pattern makes webpack try to bundle/parse the already-minified
      // worker file itself, which breaks the build ("failed to parse input
      // file / Syntax Error"). The worker must be copied to public/ (see the
      // postinstall script in package.json) and referenced as a plain path.
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();

      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
      });

      const pdf = await loadingTask.promise;

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) =>
          "str" in item ? item.str : ""
        );
        fullText += strings.join(" ") + "\n";
      }

      return fullText;
    } catch (err) {
      console.error(err);
      throw new Error("Could not parse PDF.");
    }
  }, []);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const validTypes = ["application/pdf", "text/plain"];
      if (!validTypes.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".txt")) {
        setError("Please upload a PDF or TXT file.");
        return;
      }

      setFileName(file.name);
      setError(null);
      setLoading(true);

      try {
        let text = "";
        if (file.type === "text/plain" || file.name.endsWith(".txt")) {
          text = await file.text();
        } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
          text = await extractTextFromPDF(file);
        }

        if (!text || text.trim().length < 50) {
          throw new Error("Could not extract sufficient text from the file. Please paste the content manually.");
        }

        setResume(text);
        // Count words and pages
        const words = text.split(/\s+/).filter(Boolean).length;
        const pages = Math.ceil(words / 250); // Rough estimate
        setResumeStats({ pages: Math.max(1, pages), words });
        setActiveTab("text");
      } catch (err: any) {
        setError(err.message || "Error processing file. Please try pasting the text manually.");
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [extractTextFromPDF]
  );

  async function handleAnalyze() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.post("/ats/analyze", {
        resume,
        jobDescription: jobDescription || undefined,
      });
      setResult(res.data.data as AtsResult);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Something went wrong while analyzing your resume. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // Download badge PNG (client-side generation)
  const downloadBadge = useCallback(() => {
    if (!result) return;
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 400);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = gradient;
    roundedRectPath(ctx, 0, 0, 800, 400, 20);
    ctx.fill();

    // Border
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    roundedRectPath(ctx, 0, 0, 800, 400, 20);
    ctx.stroke();

    // Badge text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Score
    ctx.fillStyle = result.total >= 80 ? "#34d399" : result.total >= 50 ? "#fbbf24" : "#f87171";
    ctx.font = "bold 96px system-ui, sans-serif";
    ctx.fillText(`${result.total}/100`, 400, 140);

    // Label
    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px system-ui, sans-serif";
    ctx.fillText("ATS-Ready Resume", 400, 220);

    // Verified badge
    ctx.fillStyle = "#22c55e";
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillText("✅ Verified by ats-checker", 400, 280);

    // URL
    ctx.fillStyle = "#64748b";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("ats-checker.com", 400, 330);

    const link = document.createElement("a");
    link.download = "ats-badge.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [result]);

  // Share on social media
  const shareOnSocial = useCallback(
    (platform: "linkedin" | "twitter" | "bluesky") => {
      if (!result) return;
      const text = `🎯 My resume scored ${result.total}/100 on the ATS Checker! Ready for the job hunt. Check yours at ats-checker.com`;
      const url = encodeURIComponent("https://ats-checker.com");
      const encodedText = encodeURIComponent(text);

      const links = {
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`,
        bluesky: `https://bsky.app/intent/compose?text=${encodedText}%20${url}`,
      };

      window.open(links[platform], "_blank", "width=600,height=600");
    },
    [result]
  );

  return (
    <>
      {/* Input panel */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        {/* Tab selector */}
        <div className="mb-4 flex gap-1 rounded-lg bg-slate-800/50 p-1">
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "text"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Paste text
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "upload"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Upload PDF
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Resume input */}
          <div>
            <label className="mb-2 flex items-center justify-between text-sm font-medium text-slate-300">
              Resume
              {resumeStats && (
                <span className="text-xs font-normal text-slate-500">
                  ✅ Loaded {resumeStats.pages} page(s), {resumeStats.words} words
                </span>
              )}
            </label>

            {activeTab === "text" ? (
              <textarea
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value);
                  setResumeStats(null);
                }}
                placeholder="Paste your resume text here…"
                rows={16}
                className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            ) : (
              <div
                className="flex h-[260px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-950/50 transition hover:border-blue-500 hover:bg-slate-900/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,application/pdf,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload resume"
                  title="Upload resume"
                />
                {fileName ? (
                  <div className="text-center">
                    <div className="text-4xl mb-3">📄</div>
                    <p className="text-sm font-medium text-slate-200">{fileName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Click to upload a different file
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-3">📤</div>
                    <p className="text-sm font-medium text-slate-300">
                      Drop a PDF here or click to choose
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Text-based PDF only (not a scanned image). Parsed locally.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Job description */}
          <div>
            <label className="mb-2 flex items-center justify-between text-sm font-medium text-slate-300">
              Job description
              <span className="text-xs font-normal text-slate-500">
                optional — unlocks keyword match
              </span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to see which keywords you're missing…"
              rows={16}
              className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action row */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!canSubmit}
              className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
            >
              {loading ? "Analyzing…" : "Check my resume"}
            </button>
            {!loading && resume.trim().length > 0 && resume.trim().length < 20 && (
              <p className="text-xs text-slate-500">
                Add more text (20+ chars) to run the check
              </p>
            )}
          </div>
          <Link
            href="/career/resume-builder"
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
          >
            Don&apos;t have a resume yet? Build one free →
          </Link>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-12 space-y-8">
          {/* Score summary */}
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-800/40 p-8 text-center">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Overall ATS Score
            </span>
            <div className="flex items-baseline gap-3">
              <span className={`text-7xl font-bold ${scoreColor(result.total)}`}>
                {result.total}
              </span>
              <span className="text-2xl text-slate-500">/ {MAX_TOTAL}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  result.total >= 80
                    ? "bg-emerald-500/20 text-emerald-400"
                    : result.total >= 50
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {result.total >= 80
                  ? "🌟 Excellent — highly ATS-friendly"
                  : result.total >= 50
                  ? "📈 Good — tune keywords per job and you're set"
                  : "⚠️ Needs work — see priority fixes below"}
              </span>
              <span className="text-sm text-slate-500">{result.wc} words</span>
            </div>
          </div>

          {/* Category breakdown */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Category breakdown</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {result.cats.map((cat) => {
                const pct = Math.round((cat.score / cat.max) * 100);
                return (
                  <div
                    key={cat.key}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">
                        {cat.key}
                      </span>
                      <span className={`text-sm font-semibold ${scoreColor(pct)}`}>
                        {cat.score}/{cat.max}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${barColor(pct)} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {cat.tips.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {cat.tips.map((tip, i) => (
                          <li
                            key={i}
                            className={`rounded-lg border px-3 py-2 text-xs leading-relaxed ${priorityBadge(
                              tip.p
                            )}`}
                          >
                            {tip.t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keyword match */}
          {result.kw && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">
                  Keyword match vs job description
                </h2>
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-bold ${scoreColor(result.kw.pct)}`}>
                    {result.kw.pct}%
                  </span>
                  <span className="text-xs text-slate-500">match</span>
                </div>
              </div>
              <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${barColor(result.kw.pct)} transition-all`}
                  style={{ width: `${result.kw.pct}%` }}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-400">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                    Found ({result.kw.hit.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.kw.hit.map((w) => (
                      <span
                        key={w}
                        className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300"
                      >
                        {w}
                      </span>
                    ))}
                    {result.kw.hit.length === 0 && (
                      <span className="text-xs text-slate-500">None yet</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-rose-400">
                    <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />
                    Missing ({result.kw.miss.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.kw.miss.map((w) => (
                      <span
                        key={w}
                        className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-300"
                      >
                        {w}
                      </span>
                    ))}
                    {result.kw.miss.length === 0 && (
                      <span className="text-xs text-slate-500">
                        Nothing missing — great match
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {result.kw.miss.length > 0 && (
                <p className="mt-4 text-xs text-slate-500">
                  Tip: Weave these keywords naturally into your resume (only if truthful)
                </p>
              )}
            </div>
          )}

          {/* ATS Badge */}
          {result.total >= 70 && (
            <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-800/40 p-6 text-center">
              <h2 className="mb-2 text-lg font-semibold">🎖️ You earned the ATS-Ready Badge</h2>
              <p className="text-sm text-slate-400">
                Download it and drop it into your LinkedIn / X post — recruiters notice a verified badge.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <div className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-center">
                  <span className={`text-2xl font-bold ${scoreColor(result.total)}`}>
                    {result.total}
                    <span className="text-base text-slate-500">/100</span>
                  </span>
                  <p className="text-xs text-slate-400">ATS-Ready Resume</p>
                  <p className="text-[10px] text-slate-500">
                    ✓ Verified by ats-checker.com
                  </p>
                </div>
                <button
                  onClick={downloadBadge}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  Download PNG
                </button>
                <button
                  onClick={() => shareOnSocial("linkedin")}
                  className="rounded-lg bg-[#0a66c2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0a66c2]/80"
                >
                  Share on LinkedIn
                </button>
                <button
                  onClick={() => shareOnSocial("twitter")}
                  className="rounded-lg bg-[#1da1f2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1da1f2]/80"
                >
                  Share on X
                </button>
                <button
                  onClick={() => shareOnSocial("bluesky")}
                  className="rounded-lg bg-[#1185fe] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1185fe]/80"
                >
                  Share on Bluesky
                </button>
              </div>
            </div>
          )}

          {/* Priorities */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="mb-3 text-lg font-semibold">📋 Prioritized fixes</h2>
            <div className="space-y-3">
              {result.cats.flatMap((cat) =>
                cat.tips.map((tip) => (
                  <div
                    key={`${cat.key}-${tip.t}`}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${priorityBadge(
                      tip.p
                    )}`}
                  >
                    <span className="mt-0.5 text-sm font-medium">
                      {tip.p === "hi" ? "🔴" : tip.p === "me" ? "🟡" : "🔵"}
                    </span>
                    <div>
                      <p className="text-sm">{tip.t}</p>
                      <p className="text-xs opacity-75 mt-0.5">
                        Category: {cat.key} ({cat.score}/{cat.max})
                      </p>
                    </div>
                  </div>
                ))
              )}
              {result.cats.flatMap((cat) => cat.tips).length === 0 && (
                <p className="text-sm text-emerald-400">
                  ✅ Your resume looks great! No critical fixes needed.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}