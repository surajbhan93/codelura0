// "use client";

// import { useEffect, useMemo, useState, useDeferredValue, useCallback, memo } from "react";
// import api from "@/lib/api";
// import Link from "next/link";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";

// // ── TYPES ──────────────────────────────────────────────────────────────────
// type Course = {
//   _id: string;
//   title: string;
//   price: number;
//   isPaid: boolean;
//   category: string;
//   level?: "Beginner" | "Intermediate" | "Advanced" | string;
//   language?: string;
//   createdAt: string;
//   tags?: string[];
//   bannerImage?: string;
// };

// type Testimonial = {
//   _id: string;
//   name: string;
//   message: string;
//   rating: number;
//   profileImage?: string;
//   category: string;
//   createdAt: string;
// };

// type FilterType = "all" | "free" | "paid";
// type SortType = "popular" | "newest";

// // ── CONSTANTS ──────────────────────────────────────────────────────────────
// const ITEMS_PER_PAGE = 6;
// const STATIC_RATINGS = [4.8, 4.9, 4.7, 4.8, 4.6, 4.9, 4.7, 4.8];
// const STUDENT_COUNTS = [
//   "2.4k", "1.8k", "3.1k", "950", "4.2k", "1.2k", "1.9k", "2.8k",
//   "890", "5.1k", "1.1k", "2.3k", "740", "3.6k", "980", "1.5k"
// ];

// const FILTERS: FilterType[] = ["all", "free", "paid"];
// const SORTS: SortType[] = ["popular", "newest"];

// // Hash helper for consistent mock data per course ID across renders & pagination
// const hashString = (str: string): number => {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = (hash << 5) - hash + str.charCodeAt(i);
//     hash |= 0;
//   }
//   return Math.abs(hash);
// };

// const isNewCourse = (createdAt: string): boolean => {
//   const diff = Date.now() - new Date(createdAt).getTime();
//   return diff <= 7 * 24 * 60 * 60 * 1000;
// };

// // Level tag color tokens (Light Theme EdTech style)
// const LEVEL_STYLES: Record<string, string> = {
//   Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
//   Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
//   Advanced: "bg-rose-50 text-rose-700 border-rose-200",
// };

// // ── MEMOIZED SUB-COMPONENTS ────────────────────────────────────────────────

// const StarRating = memo(({ rating }: { rating: number }) => {
//   const full = Math.floor(rating);
//   return (
//     <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} out of 5`}>
//       {Array.from({ length: 5 }).map((_, i) => (
//         <svg
//           key={i}
//           className={`w-4 h-4 ${i < full ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
//           viewBox="0 0 24 24"
//         >
//           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//         </svg>
//       ))}
//     </div>
//   );
// });
// StarRating.displayName = "StarRating";

// const PillTab = memo(({
//   active,
//   onClick,
//   children
// }: {
//   active: boolean;
//   onClick: () => void;
//   children: React.ReactNode;
// }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
//       active
//         ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
//         : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-sm"
//     }`}
//   >
//     {children}
//   </button>
// ));
// PillTab.displayName = "PillTab";

// const StatCard = memo(({ value, label, icon }: { value: string; label: string; icon: string }) => (
//   <motion.div
//     whileHover={{ y: -4 }}
//     transition={{ type: "spring", stiffness: 300 }}
//     className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-6 py-4 shadow-lg shadow-slate-200/40 flex items-center gap-4 text-left"
//   >
//     <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shrink-0">
//       {icon}
//     </div>
//     <div>
//       <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
//       <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
//     </div>
//   </motion.div>
// ));
// StatCard.displayName = "StatCard";

// const SkeletonCard = memo(() => (
//   <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col justify-between">
//     <div>
//       <div className="h-48 bg-slate-200/70" />
//       <div className="p-6 space-y-4">
//         <div className="h-4 bg-slate-200 rounded-full w-1/3" />
//         <div className="h-5 bg-slate-200 rounded-full w-4/5" />
//         <div className="h-4 bg-slate-200/60 rounded-full w-2/3" />
//       </div>
//     </div>
//     <div className="p-6 pt-0">
//       <div className="h-12 bg-slate-200/80 rounded-xl" />
//     </div>
//   </div>
// ));
// SkeletonCard.displayName = "SkeletonCard";

// const CourseCard = memo(({
//   course,
//   isSaved,
//   onToggleSave
// }: {
//   course: Course;
//   isSaved: boolean;
//   onToggleSave: (id: string) => void;
// }) => {
//   const hash = hashString(course._id);
//   const rating = STATIC_RATINGS[hash % STATIC_RATINGS.length];
//   const students = STUDENT_COUNTS[hash % STUDENT_COUNTS.length];
//   const isTrending = hash % 2 === 0 || !course.isPaid;
//   const isNew = isNewCourse(course.createdAt);
//   const levelBadgeClass = course.level ? LEVEL_STYLES[course.level] || "bg-slate-100 text-slate-700 border-slate-200" : null;

//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       whileHover={{ y: -6 }}
//       transition={{ duration: 0.25, ease: "easeOut" }}
//       className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
//     >
//       <div>
//         {/* Course Banner Container */}
//         <div className="relative h-52 bg-slate-100 overflow-hidden border-b border-slate-100">
//           {course.bannerImage ? (
//             <img
//               src={course.bannerImage}
//               alt={course.title}
//               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//               loading="lazy"
//               decoding="async"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 text-indigo-400">
//               🎓
//             </div>
//           )}

//           {/* Gradient Overlay for Top Badges Readability */}
//           <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-900/40 to-transparent pointer-events-none" />

//           {/* Top Category Badge */}
//           <div className="absolute top-3.5 left-3.5">
//             <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-slate-800 text-[11px] font-bold shadow-sm uppercase tracking-wider">
//               {course.category}
//             </span>
//           </div>

//           {/* Top Price Badge */}
//           <div className="absolute top-3.5 right-3.5">
//             {course.isPaid ? (
//               <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black shadow-md shadow-indigo-600/30">
//                 ₹{course.price}
//               </span>
//             ) : (
//               <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-500/30">
//                 FREE
//               </span>
//             )}
//           </div>

//           {/* Bottom Badges */}
//           <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5">
//             {isTrending && (
//               <span className="px-2.5 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold shadow-sm">
//                 🔥 Popular
//               </span>
//             )}
//             {isNew && (
//               <span className="px-2.5 py-0.5 rounded-md bg-indigo-500 text-white text-[10px] font-bold shadow-sm">
//                 ✦ New
//               </span>
//             )}
//           </div>

//           {/* Bookmark Button */}
//           <motion.button
//             whileTap={{ scale: 0.85 }}
//             type="button"
//             onClick={() => onToggleSave(course._id)}
//             aria-label={isSaved ? "Remove bookmark" : "Save course"}
//             className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-700 shadow-md hover:border-rose-300 transition-colors"
//           >
//             <span className="text-sm">{isSaved ? "❤️" : "🤍"}</span>
//           </motion.button>
//         </div>

//         {/* Course Main Details */}
//         <div className="p-6 space-y-4">
//           {/* Level, Language & Learners */}
//           <div className="flex flex-wrap items-center gap-2 text-xs">
//             {levelBadgeClass && course.level && (
//               <span className={`px-2.5 py-0.5 rounded-full border font-bold ${levelBadgeClass}`}>
//                 {course.level}
//               </span>
//             )}
//             {course.language && (
//               <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
//                 🌐 {course.language}
//               </span>
//             )}
//             <span className="text-slate-500 font-medium ml-auto">
//               👥 <strong className="text-slate-800 font-bold">{students}</strong> learners
//             </span>
//           </div>

//           {/* Title */}
//           <h3 className="text-slate-900 font-bold text-base md:text-lg line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
//             {course.title}
//           </h3>

//           {/* Star Rating & Score */}
//           <div className="flex items-center gap-2 pt-1">
//             <span className="text-amber-500 font-black text-sm">{rating.toFixed(1)}</span>
//             <StarRating rating={rating} />
//             <span className="text-slate-400 text-xs font-medium">({students})</span>
//           </div>

//           {/* Category Tags */}
//           {course.tags && course.tags.length > 0 && (
//             <div className="flex flex-wrap gap-1.5 pt-1">
//               {course.tags.slice(0, 3).map((tag) => (
//                 <span key={tag} className="text-[11px] font-semibold text-slate-500 bg-slate-100/80 border border-slate-200/60 px-2.5 py-0.5 rounded-md">
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* CTA Button */}
//       <div className="p-6 pt-0">
//         <Link
//           href={`/career/learning/study-material/${course._id}`}
//           className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-md ${
//             course.isPaid
//               ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30"
//               : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30"
//           }`}
//         >
//           {course.isPaid ? "Enroll Now" : "Start Learning"}
//           <svg className="w-4 h-4" viewBox="0 0 15 15" fill="none">
//             <path d="M3 7.5h9M8 4l3.5 3.5L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//         </Link>
//       </div>
//     </motion.div>
//   );
// });
// CourseCard.displayName = "CourseCard";

// const TestimonialCard = memo(({ t }: { t: Testimonial }) => (
//   <motion.div
//     whileHover={{ y: -4 }}
//     transition={{ duration: 0.2 }}
//     className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md shadow-slate-200/50 flex flex-col justify-between hover:border-slate-300 transition-all"
//   >
//     <div className="space-y-4">
//       <div className="flex items-center gap-3">
//         {t.profileImage ? (
//           <img
//             src={t.profileImage}
//             alt={t.name}
//             className="w-12 h-12 rounded-full border-2 border-indigo-100 object-cover shadow-sm"
//             loading="lazy"
//           />
//         ) : (
//           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
//             {t.name.charAt(0).toUpperCase()}
//           </div>
//         )}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-1.5">
//             <h4 className="text-slate-900 font-bold text-sm truncate">{t.name}</h4>
//             <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
//               ✓ Verified
//             </span>
//           </div>
//           <div className="flex items-center gap-1.5 mt-1">
//             <StarRating rating={t.rating} />
//             <span className="text-amber-500 text-xs font-extrabold">{t.rating}.0</span>
//           </div>
//         </div>
//       </div>
//       <p className="text-slate-600 text-sm leading-relaxed italic">
//         "{t.message}"
//       </p>
//     </div>
//   </motion.div>
// ));
// TestimonialCard.displayName = "TestimonialCard";

// // ── MAIN COURSES PAGE COMPONENT ─────────────────────────────────────────────
// export default function CoursesPage() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [filter, setFilter] = useState<FilterType>("all");
//   const [sort, setSort] = useState<SortType>("popular");
//   const [search, setSearch] = useState("");
//   const [saved, setSaved] = useState<Set<string>>(new Set());

//   // Non-blocking search deferred input
//   const deferredSearch = useDeferredValue(search);

//   // Fetch API data cleanly
//   useEffect(() => {
//     let isMounted = true;
//     const controller = new AbortController();

//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [coursesRes, testimonialRes] = await Promise.all([
//           api.get("/courses", { signal: controller.signal }),
//           api.get("/testimonial/material", { signal: controller.signal })
//         ]);

//         if (isMounted) {
//           setCourses(coursesRes.data || []);
//           setTestimonials(testimonialRes.data?.data || []);
//         }
//       } catch (error: any) {
//         if (error.name !== "CanceledError" && error.name !== "AbortError") {
//           console.error("Error fetching study materials:", error);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//       controller.abort();
//     };
//   }, []);

//   const toggleSave = useCallback((id: string) => {
//     setSaved((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) {
//         next.delete(id);
//       } else {
//         next.add(id);
//       }
//       return next;
//     });
//   }, []);

//   // Filter & Sort calculation
//   const filteredCourses = useMemo(() => {
//     let list = courses;

//     if (filter === "free") {
//       list = list.filter((c) => !c.isPaid);
//     } else if (filter === "paid") {
//       list = list.filter((c) => c.isPaid);
//     }

//     const query = deferredSearch.trim().toLowerCase();
//     if (query) {
//       list = list.filter(
//         (c) =>
//           c.title.toLowerCase().includes(query) ||
//           c.category.toLowerCase().includes(query)
//       );
//     }

//     if (sort === "newest") {
//       return [...list].sort(
//         (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );
//     }

//     return list;
//   }, [courses, filter, deferredSearch, sort]);

//   // Derived metrics & pagination
//   const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE) || 1;
//   const start = (page - 1) * ITEMS_PER_PAGE;
//   const visibleCourses = useMemo(
//     () => filteredCourses.slice(start, start + ITEMS_PER_PAGE),
//     [filteredCourses, start]
//   );

//   const freeCoursesCount = useMemo(() => courses.filter((c) => !c.isPaid).length, [courses]);
//   const paidCoursesCount = useMemo(() => courses.filter((c) => c.isPaid).length, [courses]);

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans selection:bg-indigo-500 selection:text-white">
//       {/* Decorative Soft Background Blurs */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
//         <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl" />
//         <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl" />
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
//         {/* ── HERO SECTION ── */}
//         <header className="text-center max-w-4xl mx-auto mb-12">
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
//           >
//             <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
//             Top Rated Engineering & Placement Material
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] mb-6"
//           >
//             Find the Best Study Materials <br className="hidden sm:inline" />
//             for <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Placements & Interviews</span>
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-slate-600 text-base md:text-xl font-normal max-w-2xl mx-auto leading-relaxed mb-10"
//           >
//             DSA Notes, Aptitude, Core Subjects, Interview Questions, Roadmaps and Premium Courses.
//           </motion.p>

//           {/* Large Glassmorphism Search Bar */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.96 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.25 }}
//             className="max-w-2xl mx-auto"
//           >
//             <div className="relative group">
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 placeholder="Search DSA notes, System Design, Java, Web Dev..."
//                 className="w-full px-7 py-5 pl-14 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200/90 text-slate-900 placeholder:text-slate-400 text-base md:text-lg shadow-xl shadow-slate-200/60 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
//               />
//               <svg
//                 className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//           </motion.div>

//           {/* Statistics Grid */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.35 }}
//             className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12"
//           >
//             <StatCard value={courses.length > 0 ? `${courses.length}+` : "700+"} label="Study Materials" icon="📚" />
//             <StatCard value="15K+" label="Students Enrolled" icon="🎓" />
//             <StatCard value="4.8 ★" label="Average Rating" icon="⭐" />
//             <StatCard value={paidCoursesCount > 0 ? `${paidCoursesCount}+` : "100+"} label="Premium Courses" icon="🚀" />
//           </motion.div>
//         </header>

//         {/* ── FILTER SECTION ── */}
//         <section className="mb-10">
//           <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 shadow-md shadow-slate-200/30">
//             {/* Filter Tabs */}
//             <div className="flex items-center gap-2">
//               {FILTERS.map((f) => (
//                 <PillTab
//                   key={f}
//                   active={filter === f}
//                   onClick={() => {
//                     setFilter(f);
//                     setPage(1);
//                   }}
//                 >
//                   {f === "all" ? "All Tracks" : f === "free" ? "Free Resources" : "Premium Courses"}
//                 </PillTab>
//               ))}
//             </div>

//             {/* Sort Tabs */}
//             <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4 w-full sm:w-auto justify-end">
//               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline">Sort By:</span>
//               {SORTS.map((s) => (
//                 <PillTab
//                   key={s}
//                   active={sort === s}
//                   onClick={() => setSort(s)}
//                 >
//                   {s === "popular" ? "🔥 Popular" : "🆕 Newest"}
//                 </PillTab>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SKELETON LOADING ── */}
//         {loading && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <SkeletonCard key={i} />
//             ))}
//           </div>
//         )}

//         {/* ── EMPTY STATE ── */}
//         {!loading && filteredCourses.length === 0 && (
//           <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm max-w-lg mx-auto">
//             <div className="text-5xl mb-4">📭</div>
//             <h3 className="text-slate-900 font-bold text-xl">No study materials found</h3>
//             <p className="text-slate-500 text-sm mt-2">Try clearing filters or searching for another keyword.</p>
//           </div>
//         )}

//         {/* ── COURSE CARDS GRID ── */}
//         {!loading && visibleCourses.length > 0 && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               <AnimatePresence mode="popLayout">
//                 {visibleCourses.map((course) => (
//                   <CourseCard
//                     key={course._id}
//                     course={course}
//                     isSaved={saved.has(course._id)}
//                     onToggleSave={toggleSave}
//                   />
//                 ))}
//               </AnimatePresence>
//             </div>

//             {/* ── PAGINATION ── */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2 mt-12">
//                 <button
//                   type="button"
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   disabled={page === 1}
//                   className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
//                 >
//                   ‹ Prev
//                 </button>

//                 {Array.from({ length: totalPages }).map((_, i) => {
//                   const pNum = i + 1;
//                   return (
//                     <button
//                       key={pNum}
//                       type="button"
//                       onClick={() => setPage(pNum)}
//                       className={`w-10 h-10 rounded-xl text-xs font-extrabold transition-all ${
//                         page === pNum
//                           ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
//                           : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
//                       }`}
//                     >
//                       {pNum}
//                     </button>
//                   );
//                 })}

//                 <button
//                   type="button"
//                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={page === totalPages}
//                   className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
//                 >
//                   Next ›
//                 </button>
//               </div>
//             )}
//           </>
//         )}

//         {/* ── MENTORSHIP BANNER ── */}
//         {!loading && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mt-20 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
//           >
//             {/* Background Decorative Waves */}
//             <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
//             <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

//             <div className="relative z-10 max-w-xl text-center md:text-left">
//               <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider mb-4">
//                 1-on-1 Personalized Mentorship
//               </span>
//               <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight mb-3">
//                 Accelerate Your Tech Career With Direct Guidance
//               </h2>
//               <p className="text-indigo-100 text-base leading-relaxed">
//                 Connect directly for DSA mock interviews, resume feedback, and placement strategies tailored for software engineering roles.
//               </p>
//             </div>

//             <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
//               <a
//                 href="https://topmate.io/talkwithsuraj/"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="px-8 py-4 rounded-xl bg-white text-indigo-700 font-extrabold text-sm hover:bg-slate-100 hover:shadow-xl transition-all duration-200"
//               >
//                 Book a Session →
//               </a>
//               <Link
//                 href="/premium"
//                 className="px-8 py-4 rounded-xl bg-indigo-800/60 border border-indigo-400/40 text-white font-extrabold text-sm hover:bg-indigo-800 transition-all duration-200"
//               >
//                 View Plans
//               </Link>
//             </div>
//           </motion.div>
//         )}

//         {/* ── TESTIMONIALS SECTION ── */}
//         {!loading && testimonials.length > 0 && (
//           <section className="mt-20">
//             <div className="text-center max-w-2xl mx-auto mb-10">
//               <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
//                 Student Success Stories
//               </span>
//               <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
//                 Trusted by 15,000+ Students & Engineers
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {testimonials.slice(0, 3).map((t) => (
//                 <TestimonialCard key={t._id} t={t} />
//               ))}
//             </div>

//             {testimonials.length > 3 && (
//               <div className="text-center mt-8">
//                 <Link
//                   href="/testimonial/material"
//                   className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
//                 >
//                   View All Reviews →
//                 </Link>
//               </div>
//             )}
//           </section>
//         )}

//       </div>
//     </div>
//   );
// }

import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getCourses, getTestimonials } from "./lib/data";
import { Hero } from "./components/Hero";
import { CourseGrid } from "./components/CourseGrid";
import { MentorshipBanner } from "./components/MentorshipBanner";

// Lazy load below-the-fold Testimonials section for optimal bundle splitting
const Testimonials = dynamic(
  () => import("./components/Testimonials").then((mod) => mod.Testimonials),
  { ssr: true }
);

// Enable ISR (Incremental Static Revalidation) every 5 minutes
export const revalidate = 300;

// Full SEO Metadata (Desktop 100 / SEO 100)
export const metadata: Metadata = {
  title: "Best Study Materials for Placements & Software Engineering Interviews",
  description: "Free and premium DSA Notes, Aptitude Guides, System Design, Core CS Subjects, Roadmaps and Interview Preparation Courses.",
  keywords: ["DSA Notes", "Placement Prep", "Coding Interview Questions", "Software Engineering Courses", "System Design"],
  openGraph: {
    title: "Best Study Materials for Placements & Engineering Interviews",
    description: "DSA Notes, Aptitude, Core Subjects, Interview Questions & Roadmaps.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Placement Study Materials",
    description: "Prepare for Software Engineering Interviews with top-rated DSA and System Design materials.",
  },
};

export default async function CoursesPage() {
  // Fetch cached data in parallel on the server
  const [courses, testimonials] = await Promise.all([
    getCourses(),
    getTestimonials(),
  ]);

  const paidCoursesCount = courses.filter((c) => c.isPaid).length;

  // Rich JSON-LD Structured Data Schema for Search Engines (SEO 100)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Software Engineering Study Materials & Courses",
    "itemListElement": courses.slice(0, 10).map((c, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Course",
        "name": c.title,
        "description": c.category,
        "provider": {
          "@type": "Organization",
          "name": "Tech Prep Hub",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans selection:bg-indigo-500 selection:text-white">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Hero totalCourses={courses.length} paidCoursesCount={paidCoursesCount} />

          <CourseGrid initialCourses={courses} />

          <MentorshipBanner />

          <Suspense fallback={<div className="h-40 animate-pulse bg-slate-200/50 rounded-2xl mt-20" />}>
            <Testimonials testimonials={testimonials} />
          </Suspense>
        </div>
      </main>
    </>
  );
}