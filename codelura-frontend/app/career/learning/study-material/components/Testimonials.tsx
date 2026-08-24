import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import { Testimonial } from "../types";

export const Testimonials = memo(function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="mt-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Student Success Stories
        </span>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
          Trusted by 15,000+ Students & Engineers
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.slice(0, 3).map((t) => (
          <div
            key={t._id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md shadow-slate-200/50 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-200"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {t.profileImage ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 shrink-0">
                    <Image
                      src={t.profileImage}
                      alt={t.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-slate-900 font-bold text-sm truncate">{t.name}</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-amber-500 text-xs font-extrabold">{t.rating}.0</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                {t.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length > 3 && (
        <div className="text-center mt-8">
          <Link
            href="/testimonial/material"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 shadow-sm transition-all"
          >
            View All Reviews →
          </Link>
        </div>
      )}
    </section>
  );
});