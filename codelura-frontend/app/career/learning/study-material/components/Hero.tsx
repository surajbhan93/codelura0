import { memo } from "react";

const STATS = [
  { label: "Study Materials", value: "700+", icon: "📚" },
  { label: "Students Enrolled", value: "15K+", icon: "🎓" },
  { label: "Average Rating", value: "4.8 ★", icon: "⭐" },
  { label: "Premium Courses", value: "100+", icon: "🚀" },
];

export const Hero = memo(function Hero({
  totalCourses,
  paidCoursesCount,
}: {
  totalCourses: number;
  paidCoursesCount: number;
}) {
  const materialsValue = totalCourses > 0 ? `${totalCourses}+` : "700+";
  const premiumValue = paidCoursesCount > 0 ? `${paidCoursesCount}+` : "100+";

  return (
    <header className="text-center max-w-4xl mx-auto mb-12">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
        Top Rated Engineering & Placement Material
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] mb-6">
        Find the Best Study Materials <br className="hidden sm:inline" />
        for{" "}
        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Placements & Interviews
        </span>
      </h1>

      <p className="text-slate-600 text-base md:text-xl font-normal max-w-2xl mx-auto leading-relaxed mb-10">
        DSA Notes, Aptitude, Core Subjects, Interview Questions, Roadmaps and Premium Courses.
      </p>

      {/* Static Server-Rendered Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
        <div className="bg-white/90 border border-slate-200/80 rounded-2xl px-6 py-4 shadow-md shadow-slate-200/40 flex items-center gap-4 text-left transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shrink-0">
            📚
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{materialsValue}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Materials</div>
          </div>
        </div>

        <div className="bg-white/90 border border-slate-200/80 rounded-2xl px-6 py-4 shadow-md shadow-slate-200/40 flex items-center gap-4 text-left transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shrink-0">
            🎓
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">15K+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</div>
          </div>
        </div>

        <div className="bg-white/90 border border-slate-200/80 rounded-2xl px-6 py-4 shadow-md shadow-slate-200/40 flex items-center gap-4 text-left transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shrink-0">
            ⭐
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">4.8 ★</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</div>
          </div>
        </div>

        <div className="bg-white/90 border border-slate-200/80 rounded-2xl px-6 py-4 shadow-md shadow-slate-200/40 flex items-center gap-4 text-left transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shrink-0">
            🚀
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{premiumValue}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Premium Courses</div>
          </div>
        </div>
      </div>
    </header>
  );
});