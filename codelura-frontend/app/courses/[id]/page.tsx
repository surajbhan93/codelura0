"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import PaymentIcons from "@/components/shared/PaymentIcons";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import toast from "react-hot-toast";
import {
  Link2,
  Twitter,
  Linkedin,
  Facebook,
  Send,
  MessageCircle,
} from "lucide-react";
/* ─────────────────────────────────────
   TYPES  (original — unchanged)
───────────────────────────────────── */
type ExternalLink = { title: string; url: string; type: string };
import { useSearchParams } from "next/navigation";
type Course = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  isPaid: boolean;
  accessType: "public_preview" | "login_required" | "paid_only";
  showAdsForFreeUsers: boolean;
  allowDownloadAfterPurchase: boolean;
  category?: string;
  language?: string;
  level?: string;
  duration?: string;
  previewPages?: number;
  attachments?: { fileName: string }[];
  externalLinks?: ExternalLink[];
};

/* ─────────────────────────────────────
   STATIC RATINGS  (original — unchanged)
───────────────────────────────────── */
const STATIC_RATINGS = [4.4, 4.6, 4.3, 4.5, 4.4, 4.2, 4.8, 4.7];


/* ─────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
});

/* ─────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <span className="tracking-tight text-amber-400">
      {"★".repeat(full)}{"☆".repeat(5 - full)}
    </span>
  );
}


function FeatureRow({
  icon,
  title,
  sub,
  iconBg,
}: {
  icon: string;
  title: string;
  sub: string;
  iconBg: string;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition-all duration-200 hover:border-amber-500/20 hover:bg-amber-500/[0.03]">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm ${iconBg}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-[0.82rem] font-semibold text-zinc-200">{title}</p>
        <p className="text-[0.72rem] text-zinc-500">{sub}</p>
      </div>
    </div>
  );
}

function Perk({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[0.82rem] text-zinc-400">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[0.6rem] font-bold text-emerald-400">
        ✓
      </span>
      {label}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] py-2 last:border-0">
      <span className="text-[0.78rem] text-zinc-500">{label}</span>
      <span className="text-[0.82rem] font-medium text-zinc-200">{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────── */
export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
const purchased = searchParams.get("purchased");
// const [pdfSrc, setPdfSrc] = useState("");
  /* ── State (original — unchanged) ── */
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [accessLevel, setAccessLevel] = useState<
    "preview" | "full_read" | "full_access" | "locked"
  >("preview");

  const FREE_PAGES = course?.previewPages || 2;

  /* ── HEAD → total pages (original — unchanged) ── */
  useEffect(() => {
    if (!course?._id) return;
    // fetch(`http://localhost:3000/api/courses/${course._id}/preview`, {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${course._id}/preview`, {
      method: "HEAD",
    })
      .then((res) => {
        const total = res.headers.get("x-total-pages");
        if (total) setTotalPages(Number(total));
      })
      .catch(() => {});
  }, [course]);

  /* ── Rating (original — unchanged) ── */
  const rating = course
    ? STATIC_RATINGS[
        Math.abs(
          course._id
            .split("")
            .reduce((a: number, c: string) => a + c.charCodeAt(0), 0)
        ) % STATIC_RATINGS.length
      ]
    : 4.5;

    const isLoggedIn = () => {
  if (typeof document === "undefined") return false;

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));

  return !!token;
};
    const handleBuy = () => {

  if (!isLoggedIn()) {
    toast.error("Please login first");
    router.push(`/auth/login?redirect=/courses/${course?._id}/checkout`);
    return;
  }

  toast.success("Redirecting to checkout...");
  router.push(`/courses/${course?._id}/checkout`);
};

    // share concept
const shareUrl =
  typeof window !== "undefined"
    ? window.location.href
    : `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${course?._id}`;

const shareText = `Check out this course: ${course?.title}`;

const copyLink = async () => {
  await navigator.clipboard.writeText(shareUrl);
  toast.success("Link copied!");
};

const shareWhatsApp = () => {
  window.open(
    `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    "_blank"
  );
};

const shareTwitter = () => {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`,
    "_blank"
  );
};

const shareLinkedIn = () => {
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`,
    "_blank"
  );
};

const shareFacebook = () => {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`,
    "_blank"
  );
};

const shareTelegram = () => {
  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`,
    "_blank"
  );
};

const pdfSrc = useMemo(() => {
  if (!course?._id) return "";

  let token = "";

  if (typeof document !== "undefined") {
    token =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] || "";
  }

  return `${process.env.NEXT_PUBLIC_API_URL}/courses/${course._id}/preview?token=${token}&t=${accessLevel}`;

}, [course?._id, accessLevel]);
console.log("PDF SRC 👉", pdfSrc);
  /* ── Fetch course (original — unchanged) ── */
 useEffect(() => {
  if (!id) return;

  api
    .get(`/courses/${id}`)
    .then((res) => {
      console.log("COURSE API RESPONSE 👉", res.data);
      setCourse(res.data.course);
      setAccessLevel(res.data.accessLevel);
    })
    .finally(() => setLoading(false));

}, [id, purchased]);

  /* ── Sticky CTA scroll listener (original — unchanged) ── */
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("preview");
      if (!el) return;
      setShowSticky(el.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0c0b09]">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-zinc-800 border-t-amber-400" />
        <p className="text-xs uppercase tracking-widest text-zinc-600">
          Loading course…
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0b09] text-zinc-500">
        Course not found
      </div>
    );
  }
console.log("ACCESS LEVEL 👉", accessLevel);
  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <>
      {/* Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Instrument Serif', serif; }
        .font-body    { font-family: 'Outfit', sans-serif; }
      `}</style>

      <div className="font-body min-h-screen bg-[#0c0b09] text-zinc-300">

        {/* Ambient glow at top */}
        <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-amber-500/[0.05] to-transparent" />

        <div className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6">

          {/* ════════════════════════════════════════════
               MAIN GRID: mobile 1-col → desktop 3-col
          ════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr_280px] lg:items-start xl:grid-cols-[320px_1fr_296px]">

            {/* ═══════════ LEFT SIDEBAR ═══════════ */}
            <motion.aside
              variants={fadeUp(0)}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-4"
            >
              {/* Title card */}
              <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/70 p-5 backdrop-blur-md">
                <h1 className="font-display text-2xl font-bold leading-snug text-zinc-100">
                  {course.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StarRating rating={rating} />
                  <span className="text-sm font-semibold text-zinc-200">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-zinc-500">(1.2k reviews)</span>
                  <span className="font-display ml-auto text-xl font-bold text-amber-400">
                    {course.isPaid ? `₹${course.price}` : "Free"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {course.category && (
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[0.66rem] font-semibold uppercase tracking-wider text-amber-400">
                      {course.category}
                    </span>
                  )}
                  {course.language && (
                    <span className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-0.5 text-[0.66rem] font-semibold uppercase tracking-wider text-zinc-400">
                      {course.language}
                    </span>
                  )}
                  {course.level && (
                    <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-[0.66rem] font-semibold uppercase tracking-wider text-rose-400">
                      {course.level}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {course.description && (
                <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/70 p-5 backdrop-blur-md">
                  <p className="mb-2 text-[0.66rem] font-semibold uppercase tracking-widest text-amber-600">
                    About this course
                  </p>
                  <p className="text-[0.875rem] leading-relaxed text-zinc-400">
                    {course.description}
                  </p>
                </div>
              )}

              {/* Meta 2×2 grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "📚", label: "Level",    val: course.level },
                  { icon: "🗣",  label: "Language", val: course.language },
                  { icon: "⏱",  label: "Duration", val: course.duration },
                  { icon: "📄", label: "Pages",    val: totalPages ? `${totalPages} pg` : null },
                ]
                  .filter((m) => m.val)
                  .map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-white/[0.05] bg-zinc-900/40 p-3"
                    >
                      <p className="text-[0.64rem] uppercase tracking-widest text-zinc-600">
                        {m.icon} {m.label}
                      </p>
                      <p className="mt-0.5 text-[0.84rem] font-semibold text-zinc-200">
                        {m.val}
                      </p>
                    </div>
                  ))}
              </div>

              {/* What's included */}
              <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/70 p-5 backdrop-blur-md">
                <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-widest text-amber-600">
                  What is included
                </p>
                <div className="flex flex-col gap-2">
                  <FeatureRow icon="📄" iconBg="bg-emerald-500/10 text-emerald-400" title={`${totalPages ?? "–"} Pages of Notes`}  sub="Well-structured & exam-focused" />
                  <FeatureRow icon="🎓" iconBg="bg-blue-500/10 text-blue-400"       title="Exam & Interview Ready"                 sub="Key concepts & questions" />
                  <FeatureRow icon="🖨️" iconBg="bg-violet-500/10 text-violet-400"   title="Printable PDF"                          sub="Download & print anytime" />
                  <FeatureRow icon="🔄" iconBg="bg-orange-500/10 text-orange-400"   title="Free Future Updates"                    sub="Always up-to-date" />
                </div>
              </div>

              {/* Attachments */}
              {course.attachments && course.attachments.length > 0 && (
                <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/70 p-5 backdrop-blur-md">
                  <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-widest text-amber-600">
                    Attachments
                  </p>
                  <div className="flex flex-col gap-2">
                    {course.attachments.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-[0.82rem] text-zinc-300"
                      >
                        <span className="text-zinc-500">📎</span> {f.fileName}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External links */}
              {course.externalLinks && course.externalLinks.length > 0 && (
                <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/70 p-5 backdrop-blur-md">
                  <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-widest text-amber-600">
                    Extra Resources
                  </p>
                  <div className="flex flex-col gap-2">
                    {course.externalLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-blue-500/15 bg-blue-500/[0.06] px-3 py-2 text-[0.82rem] font-medium text-blue-400 transition-all hover:border-blue-500/30 hover:bg-blue-500/10"
                      >
                        🔗 {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/70 p-5 backdrop-blur-md">
  <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-widest text-amber-600">
    Share
  </p>

  <div className="flex flex-wrap gap-2">
    {[
      {
        icon: <Link2 size={16} />,
        action: copyLink,
        color: "hover:bg-zinc-700",
        label: "Copy",
      },
      {
        icon: <MessageCircle size={16} />,
        action: shareWhatsApp,
        color: "hover:bg-green-600",
        label: "WhatsApp",
      },
      {
        icon: <Twitter size={16} />,
        action: shareTwitter,
        color: "hover:bg-sky-500",
        label: "Twitter",
      },
      {
        icon: <Linkedin size={16} />,
        action: shareLinkedIn,
        color: "hover:bg-blue-600",
        label: "LinkedIn",
      },
      {
        icon: <Facebook size={16} />,
        action: shareFacebook,
        color: "hover:bg-blue-700",
        label: "Facebook",
      },
      {
        icon: <Send size={16} />,
        action: shareTelegram,
        color: "hover:bg-sky-600",
        label: "Telegram",
      },
    ].map((btn, i) => (
      <motion.button
        key={i}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={btn.action}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03] text-zinc-300 transition-all duration-200 ${btn.color}`}
        title={btn.label}
      >
        {btn.icon}
      </motion.button>
    ))}
  </div>
</div>
            </motion.aside>

            {/* ═══════════ CENTER — PDF VIEWER ═══════════ */}
            <motion.main
              variants={fadeUp(0.08)}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-4"
            >
              <div
                id="preview"
                className="overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/70 shadow-2xl backdrop-blur-md"
              >
                {/* Viewer header */}
                <div className="relative overflow-hidden border-b border-white/[0.07] px-6 py-5 text-center">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-500/[0.08] via-amber-500/[0.02] to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

                  <p className="relative text-[0.66rem] font-semibold uppercase tracking-widest text-amber-600">
                    Document Preview
                  </p>
                  <h2 className="font-display relative mt-1 text-lg font-bold text-zinc-100">
                    Free Preview — {FREE_PAGES} / {totalPages ?? "…"} pages
                  </h2>
                  <p className="relative mt-1 text-xs text-zinc-500">
                    Scroll through sample pages before you decide to purchase
                  </p>
                </div>
           
                {/* PDF frame */}
                <div className="relative">
                 <iframe
                    key={accessLevel}
                    src={pdfSrc}
                    className="h-[110vh] w-full border-0"
                    title="Course preview"
                  />

                  {/* Preview-end overlay */}
                  {accessLevel === "preview" && (
                    <div className="absolute inset-x-0 bottom-0 h-[35%]">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-[#0c0b09]/90 to-transparent backdrop-blur-sm" />
                      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                        <p className="text-sm font-semibold text-zinc-200">
                          Preview ends here
                        </p>
                        <button
                          onClick={() =>
                            router.push(
                              `/auth/login?redirect=/courses/${course._id}`
                            )
                          }
                          className="rounded-full bg-blue-500 px-6 py-2.5 text-sm font-bold text-white"
                        >
                          Login to Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Scroll hint */}
                  <div className="pointer-events-none absolute bottom-3 right-3 animate-bounce rounded-full border border-white/[0.06] bg-black/60 px-3 py-1 text-[0.63rem] text-zinc-500 backdrop-blur-sm">
                    ⬇ scroll
                  </div>

                  {/* Lock overlay */}
                  {accessLevel === "locked" && (
                    <div className="absolute inset-x-0 bottom-0 h-[35%]">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-[#0c0b09]/90 to-transparent backdrop-blur-sm" />
                      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                        <p className="text-sm font-semibold text-zinc-200">
                          Full content is locked
                        </p>
                        {/* <button
                          onClick={() =>
                            
                            router.push(`/courses/${course._id}/checkout`)
                          }
                          className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-2.5 text-sm font-bold text-zinc-900"
                        > */}
                       <button onClick={handleBuy}>
                          Unlock for ₹{course.price}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Access status banners */}
                <AnimatePresence>
                  {accessLevel === "full_read" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-blue-500/15 bg-blue-500/[0.06] px-4 py-2 text-center text-xs font-medium text-blue-400"
                    >
                      👀 Logged in — Full notes unlocked for reading
                    </motion.div>
                  )}

                  {accessLevel === "full_access" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-emerald-500/15 bg-emerald-500/[0.06] px-4 py-2 text-center text-xs font-medium text-emerald-400"
                    >
                      ✅ Purchased — Download available
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ad block */}
              {accessLevel === "preview" && course.showAdsForFreeUsers && (
                <div className="rounded-2xl border border-dashed border-white/[0.06] p-5 text-center">
                  <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-widest text-zinc-600">
                    🔔 Advertisement
                  </p>
                  <div className="flex h-[90px] items-center justify-center rounded-lg bg-white/[0.02] text-[0.68rem] uppercase tracking-widest text-zinc-700">
                    Google AdSense Ad Here
                  </div>
                </div>
              )}
            </motion.main>

            {/* ═══════════ RIGHT SIDEBAR ═══════════ */}
            <motion.aside
              variants={fadeUp(0)}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-4 lg:sticky lg:top-6"
            >
              {/* Pricing card */}
              <div
                id="pricing"
                className="overflow-hidden rounded-2xl border border-amber-500/[0.18] bg-gradient-to-b from-[#1c1810] to-[#131108]"
              >
                {/* Top price section */}
                <div className="border-b border-amber-500/[0.1] p-5">
                  <div className="font-display text-4xl font-bold">
                    {course.isPaid ? `₹${course.price}` : "Free"}
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    One-time purchase · Lifetime access
                  </p>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 p-5">
                  {/* Perks */}
                  <div className="flex flex-col gap-2.5">
                    <Perk label="Full PDF access" />
                    <Perk label={`${totalPages ?? "–"} printable pages`} />
                    <Perk label="Free future updates" />
                    <Perk label="Instant delivery" />
                    {course.allowDownloadAfterPurchase && (
                      <Perk label="Download enabled" />
                    )}
                  </div>

                  <div className="h-px bg-white/[0.05]" />

                  {/* FULL ACCESS */}
                  {accessLevel === "full_access" &&
                    course.allowDownloadAfterPurchase && (
                      <a
                        // href={`http://localhost:3000/api/courses/${course._id}/pdf`}
                        href={`${process.env.NEXT_PUBLIC_API_URL}/courses/${course._id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center rounded-full bg-emerald-500 py-3 text-sm font-bold text-white"
                      >
                        ⬇ Download PDF
                      </a>
                    )}

                  {/* FULL READ (logged in but not paid) */}
                  {accessLevel === "full_read" && course.isPaid && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-center">
                      <p className="text-sm font-semibold text-amber-400">
                        Full notes unlocked for reading
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">
                        Pay ₹{course.price} to download PDF
                      </p>
                      <button
                        onClick={() =>
                           router.push(`/courses/${course._id}/checkout`)
                        }
                        className="mt-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-2 text-sm font-bold text-zinc-900"
                      >
                        🛒 Buy & Download PDF
                      </button>
                    </div>
                  )}

                  {/* LOCKED */}
                  {accessLevel === "locked" && (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() =>
                           router.push(`/courses/${course._id}/checkout`)
                        }
                        className="w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-sm font-bold text-zinc-900"
                      >
                        🛒 Buy Now — ₹{course.price}
                      </button>

                      <p className="text-center text-xs text-zinc-500">
                        🔒 Secure payment via Razorpay
                      </p>

                      <div className="flex flex-wrap justify-center gap-2">
                        {[
                          "UPI",
                          "Visa",
                          "Mastercard",
                          "Paytm",
                          "Net Banking",
                        ].map((p) => (
                          <span
                            key={p}
                            className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <PaymentIcons />

              {/* Course details */}
              <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/70 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-600">
                  Course Details
                </p>
                {[
                  ["Level",    course.level],
                  ["Language", course.language],
                  ["Duration", course.duration],
                  ["Category", course.category],
                  ["Pages",    totalPages ? `${totalPages} pages` : null],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <DetailRow
                      key={k as string}
                      label={k as string}
                      value={v as string}
                    />
                  ))}
              </div>
            </motion.aside>

          </div>{/* ── end grid ── */}

        </div>{/* ── end mx-auto container ── */}

      </div>{/* ── end font-body wrapper ── */}

      {/* ═══════════ MOBILE STICKY CTA ═══════════ */}
      {/* Moved OUTSIDE the grid and outside the page wrapper — renders at root level */}
      <AnimatePresence>
        {accessLevel === "locked" && showSticky && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.07] bg-[#0c0b09]/95 px-4 py-3 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.62rem] uppercase tracking-widest text-zinc-600">
                  Price
                </p>
              </div>
              <button
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-7 py-2.5 text-sm font-bold text-zinc-900 shadow-[0_4px_20px_rgba(251,191,36,0.35)]"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}