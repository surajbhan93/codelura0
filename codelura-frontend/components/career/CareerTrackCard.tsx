import Link from "next/link";
import { CareerTrack } from "@/components/admin/careerTrack";

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

export default function CareerTrackCard({ track }: { track: CareerTrack }) {
  const displayPrice = track.discountPrice || track.price || 9999;
  const originalPrice = track.price || 14999;

  return (
    <Link
      href={`/career/learning/career-tracks/${track.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-purple-500/20 bg-[#0C0F28] transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-950/50"
    >
      {/* Thumbnail Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-[#07091B]">
        {track.thumbnail ? (
          <img
            src={track.thumbnail}
            alt={track.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-900/60 to-indigo-950 p-6 text-center"
          >
            <span className="text-xl font-bold text-white tracking-wide">{track.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F28] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="rounded-full bg-purple-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-300 backdrop-blur-md border border-purple-500/30">
            {track.badge || "CAREER TRACK"}
          </span>
          {track.featured && (
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur border border-amber-500/40">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col gap-3.5 p-6">
        <div className="flex items-center justify-between text-xs">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
              levelColors[track.level] || levelColors["Intermediate"]
            }`}
          >
            {track.level || "Intermediate"}
          </span>
          <span className="font-semibold text-slate-400">
            ⏱️ {track.totalHours || track.duration || "450+ Hours"}
          </span>
        </div>

        <h3 className="text-lg font-bold leading-snug text-white transition group-hover:text-purple-300">
          {track.title}
        </h3>

        {track.shortDescription && (
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">
            {track.shortDescription}
          </p>
        )}

        {/* Salary Range & Projects Badge */}
        <div className="grid grid-cols-2 gap-2 border-t border-purple-500/10 pt-3 text-[11px]">
          <div className="rounded-lg bg-purple-950/30 border border-purple-500/20 p-2">
            <span className="block text-slate-400 text-[10px]">Expected CTC</span>
            <span className="font-bold text-amber-300">{track.salaryRange || "₹8 LPA - ₹24 LPA"}</span>
          </div>
          <div className="rounded-lg bg-purple-950/30 border border-purple-500/20 p-2">
            <span className="block text-slate-400 text-[10px]">Real Projects</span>
            <span className="font-bold text-emerald-400">{track.totalProjects || 8} Production Projects</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-purple-500/10 pt-4">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-white">
                ₹{displayPrice.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">1:1 Mentorship Included</span>
          </div>

          <span className="rounded-xl bg-purple-600/20 border border-purple-500/40 px-3.5 py-2 text-xs font-bold text-purple-300 transition group-hover:bg-purple-600 group-hover:text-white">
            Explore Track →
          </span>
        </div>
      </div>
    </Link>
  );
}