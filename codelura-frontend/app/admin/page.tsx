"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame, Users, BookOpen, ShoppingBag, LayoutDashboard,
  FileText, PlusCircle, TrendingUp, CreditCard, Briefcase,
  ArrowUpRight, RefreshCw
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */
type PopularBlog = {
  _id: string;
  title?: string;
  score: number;
};

type StatsData = {
  totalBlogs: number;
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  totalServices: number;
  totalSubscriptions: number;
};

type RecentSub = {
  _id: string;
  status: string;
  finalAmount?: number;
  user?: { email?: string };
  premiumService?: { title?: string };
  createdAt?: string;
};

/* ============================================================
   PAGE
============================================================ */
export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<PopularBlog[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentSubs, setRecentSubs] = useState<RecentSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [blogsRes, statsRes, subsRes] = await Promise.allSettled([
        api.get("/admin/blogs/popular"),
        api.get("/admin/stats"),
        api.get("/premium/admin/subscriptions"),
      ]);

      if (blogsRes.status === "fulfilled") setBlogs(blogsRes.value.data || []);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data || null);
      if (subsRes.status === "fulfilled") {
        const all: RecentSub[] = subsRes.value.data?.subs || [];
        setRecentSubs(all.slice(0, 5));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ── Greeting ── */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ══════════════ HEADER ══════════════ */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">Admin Panel</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{greeting} 👋</h1>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening with your platform today.</p>
          </div>
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm transition-all duration-150"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* ══════════════ STAT CARDS ══════════════ */}
        <section>
          <SectionTitle title="Overview" />
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse h-24" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Total Users"         value={stats?.totalUsers ?? "—"}         icon={<Users className="w-5 h-5" />}       color="indigo" />
              <StatCard label="Blogs"               value={stats?.totalBlogs ?? "—"}          icon={<FileText className="w-5 h-5" />}    color="blue"   />
              <StatCard label="Courses / Notes"     value={stats?.totalCourses ?? "—"}        icon={<BookOpen className="w-5 h-5" />}    color="violet" />
              <StatCard label="Subscriptions"       value={stats?.totalSubscriptions ?? "—"}  icon={<CreditCard className="w-5 h-5" />}  color="green"  />
              <StatCard label="Services"            value={stats?.totalServices ?? "—"}       icon={<Briefcase className="w-5 h-5" />}   color="amber"  />
              <StatCard label="Revenue (₹)"         value={stats?.totalRevenue != null ? `₹${stats.totalRevenue.toLocaleString("en-IN")}` : "—"} icon={<TrendingUp className="w-5 h-5" />} color="rose" />
            </div>
          )}
        </section>

        {/* ══════════════ QUICK ACTIONS ══════════════ */}
        <section>
          <SectionTitle title="Quick Actions" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <QuickAction href="/admin/blogs/add"       label="New Blog"         icon={<FileText className="w-5 h-5" />}    color="blue"   />
            <QuickAction href="/admin/courses/add"     label="Add Course"       icon={<BookOpen className="w-5 h-5" />}    color="violet" />
            <QuickAction href="/admin/premium"         label="Manage Premium"   icon={<CreditCard className="w-5 h-5" />}  color="green"  />
            <QuickAction href="/admin/services/add"    label="Add Service"      icon={<Briefcase className="w-5 h-5" />}   color="amber"  />
            <QuickAction href="/admin/work/add"        label="Add Work"         icon={<PlusCircle className="w-5 h-5" />}  color="rose"   />
          </div>
        </section>

        {/* ══════════════ BOTTOM GRID ══════════════ */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Popular Blogs */}
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-gray-700">Popular Blogs</h2>
              </div>
              <Link href="/admin/blogs" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton rows={5} />
            ) : blogs.length === 0 ? (
              <EmptyState icon={<FileText className="w-10 h-10" />} message="No popular blogs yet" />
            ) : (
              <ul className="divide-y divide-gray-100">
                {blogs.slice(0, 6).map((b, i) => (
                  <motion.li
                    key={b._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${i === 0 ? "bg-orange-100 text-orange-600" : i === 1 ? "bg-gray-200 text-gray-600" : i === 2 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{b.title || "Untitled Blog"}</p>
                      <p className="text-xs text-gray-400 font-mono truncate">{b._id}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-sm font-bold text-indigo-600">{b.score}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </section>

          {/* Recent Subscriptions */}
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-green-500" />
                <h2 className="text-sm font-semibold text-gray-700">Recent Subscriptions</h2>
              </div>
              <Link href="/admin/premium" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton rows={5} />
            ) : recentSubs.length === 0 ? (
              <EmptyState icon={<CreditCard className="w-10 h-10" />} message="No subscriptions yet" />
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentSubs.map((sub, i) => (
                  <motion.li
                    key={sub._id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 uppercase">
                      {sub.user?.email?.[0] || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{sub.user?.email || "Unknown user"}</p>
                      <p className="text-xs text-gray-400 truncate">{sub.premiumService?.title || "—"}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <SubStatusBadge status={sub.status} />
                      {sub.finalAmount != null && (
                        <span className="text-xs font-semibold text-gray-600">₹{sub.finalAmount}</span>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
============================================================ */

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{title}</h2>;
}

/* ── Stat Card ── */
const statColorMap: Record<string, { bg: string; icon: string; value: string }> = {
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-400", value: "text-indigo-700" },
  blue:   { bg: "bg-blue-50",   icon: "text-blue-400",   value: "text-blue-700"   },
  violet: { bg: "bg-violet-50", icon: "text-violet-400", value: "text-violet-700" },
  green:  { bg: "bg-green-50",  icon: "text-green-400",  value: "text-green-700"  },
  amber:  { bg: "bg-amber-50",  icon: "text-amber-400",  value: "text-amber-700"  },
  rose:   { bg: "bg-rose-50",   icon: "text-rose-400",   value: "text-rose-700"   },
};

function StatCard({ label, value, icon, color }: {
  label: string; value: string | number; icon: React.ReactNode; color: string;
}) {
  const c = statColorMap[color] || statColorMap.indigo;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col gap-3"
    >
      <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center`}>{icon}</div>
      <div>
        <p className={`text-xl font-bold ${c.value} leading-tight`}>{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

/* ── Quick Action ── */
const qaColorMap: Record<string, string> = {
  blue:   "border-blue-200   bg-blue-50   hover:bg-blue-100   text-blue-700",
  violet: "border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700",
  green:  "border-green-200  bg-green-50  hover:bg-green-100  text-green-700",
  amber:  "border-amber-200  bg-amber-50  hover:bg-amber-100  text-amber-700",
  rose:   "border-rose-200   bg-rose-50   hover:bg-rose-100   text-rose-700",
};

function QuickAction({ href, label, icon, color }: {
  href: string; label: string; icon: React.ReactNode; color: string;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-2 border rounded-2xl py-4 px-3 text-xs font-semibold transition-all duration-150 shadow-sm ${qaColorMap[color] || qaColorMap.blue}`}
    >
      {icon}
      {label}
    </Link>
  );
}

/* ── Sub Status Badge ── */
const subStatusMap: Record<string, string> = {
  pending:   "bg-amber-50  text-amber-700",
  approved:  "bg-green-50  text-green-700",
  rejected:  "bg-red-50    text-red-600",
  suspended: "bg-orange-50 text-orange-600",
  expired:   "bg-gray-100  text-gray-500",
};

function SubStatusBadge({ status }: { status: string }) {
  const cls = subStatusMap[status] || "bg-gray-100 text-gray-500";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${cls}`}>{status}</span>
  );
}

/* ── Loading Skeleton ── */
function LoadingSkeleton({ rows }: { rows: number }) {
  return (
    <ul className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
          <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="w-12 h-5 bg-gray-200 rounded-full" />
        </li>
      ))}
    </ul>
  );
}

/* ── Empty State ── */
function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-gray-400">
      <div className="text-gray-300 mb-3">{icon}</div>
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
}