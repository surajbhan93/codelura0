"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "../types";

const STATIC_RATINGS = [4.8, 4.9, 4.7, 4.8, 4.6, 4.9, 4.7, 4.8];
const STUDENT_COUNTS = ["2.4k", "1.8k", "3.1k", "950", "4.2k", "1.2k", "1.9k", "2.8k"];

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const isNewCourse = (createdAt: string): boolean => {
  return Date.now() - new Date(createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000;
};

const LEVEL_STYLES: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  Advanced: "bg-rose-50 text-rose-700 border-rose-200",
};

export const CourseCard = memo(function CourseCard({
  course,
  isSaved,
  onToggleSave,
}: {
  course: Course;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}) {
  const hash = hashString(course._id);
  const rating = STATIC_RATINGS[hash % STATIC_RATINGS.length];
  const students = STUDENT_COUNTS[hash % STUDENT_COUNTS.length];
  const isTrending = hash % 2 === 0 || !course.isPaid;
  const isNew = isNewCourse(course.createdAt);
  const levelClass = course.level ? LEVEL_STYLES[course.level] || "bg-slate-100 text-slate-700 border-slate-200" : null;

  return (
    <div className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative h-52 bg-slate-100 overflow-hidden border-b border-slate-100">
          {course.bannerImage ? (
            <Image
              src={course.bannerImage}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 text-indigo-400">
              🎓
            </div>
          )}

          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-900/40 to-transparent pointer-events-none" />

          <div className="absolute top-3.5 left-3.5">
            <span className="px-3 py-1 rounded-full bg-white/90 border border-white/40 text-slate-800 text-[11px] font-bold shadow-sm uppercase tracking-wider">
              {course.category}
            </span>
          </div>

          <div className="absolute top-3.5 right-3.5">
            {course.isPaid ? (
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black shadow-md shadow-indigo-600/30">
                ₹{course.price}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-500/30">
                FREE
              </span>
            )}
          </div>

          <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5">
            {isTrending && (
              <span className="px-2.5 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold shadow-sm">
                🔥 Popular
              </span>
            )}
            {isNew && (
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500 text-white text-[10px] font-bold shadow-sm">
                ✦ New
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onToggleSave(course._id)}
            aria-label={isSaved ? "Remove bookmark" : "Save course"}
            className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-700 shadow-md hover:border-rose-300 transition-colors"
          >
            <span className="text-sm">{isSaved ? "❤️" : "🤍"}</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {levelClass && course.level && (
              <span className={`px-2.5 py-0.5 rounded-full border font-bold ${levelClass}`}>
                {course.level}
              </span>
            )}
            {course.language && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
                🌐 {course.language}
              </span>
            )}
            <span className="text-slate-500 font-medium ml-auto">
              👥 <strong className="text-slate-800 font-bold">{students}</strong> learners
            </span>
          </div>

          <h3 className="text-slate-900 font-bold text-base md:text-lg line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-amber-500 font-black text-sm">{rating.toFixed(1)}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-slate-400 text-xs font-medium">({students})</span>
          </div>

          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {course.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[11px] font-semibold text-slate-500 bg-slate-100/80 border border-slate-200/60 px-2.5 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-0">
        <Link
          href={`/career/learning/study-material/${course.slug}`}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-md ${
            course.isPaid
              ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-600/20"
              : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-500/20"
          }`}
        >
          {course.isPaid ? "Enroll Now" : "Start Learning"}
          <svg className="w-4 h-4" viewBox="0 0 15 15" fill="none">
            <path d="M3 7.5h9M8 4l3.5 3.5L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
});