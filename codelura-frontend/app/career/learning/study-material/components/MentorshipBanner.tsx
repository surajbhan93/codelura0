import Link from "next/link";
import { memo } from "react";

export const MentorshipBanner = memo(function MentorshipBanner() {
  return (
    <div className="mt-20 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-xl text-center md:text-left">
        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider mb-4">
          1-on-1 Personalized Mentorship
        </span>
        <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight mb-3">
          Accelerate Your Tech Career With Direct Guidance
        </h2>
        <p className="text-indigo-100 text-base leading-relaxed">
          Connect directly for DSA mock interviews, resume feedback, and placement strategies tailored for software engineering roles.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
        <a
          href="https://topmate.io/talkwithsuraj/"
          target="_blank"
          rel="noreferrer"
          className="px-8 py-4 rounded-xl bg-white text-indigo-700 font-extrabold text-sm hover:bg-slate-100 hover:shadow-xl transition-all duration-200"
        >
          Book a Session →
        </a>
        <Link
          href="/premium"
          className="px-8 py-4 rounded-xl bg-indigo-800/60 border border-indigo-400/40 text-white font-extrabold text-sm hover:bg-indigo-800 transition-all duration-200"
        >
          View Plans
        </Link>
      </div>
    </div>
  );
});