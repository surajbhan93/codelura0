"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Coins,
  Users,
  Search,
  RefreshCw,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Unlock,
  Download,
  ExternalLink,
  IndianRupee,
  CreditCard,
} from "lucide-react";
import {
  getAdminUnlockedReferrals,
  AdminUnlockedReferralItem,
} from "@/lib/creditsApi";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminUnlockedReferralsManager() {
  const [unlocks, setUnlocks] = useState<AdminUnlockedReferralItem[]>([]);
  const [stats, setStats] = useState({
    totalUnlocks: 0,
    totalCreditsSpent: 0,
    uniqueUsersCount: 0,
    totalRevenue: 0,
    estimatedUnlockRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUnlocks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminUnlockedReferrals();
      if (res.success) {
        setUnlocks(res.unlocks || []);
        setStats(
          res.stats || {
            totalUnlocks: 0,
            totalCreditsSpent: 0,
            uniqueUsersCount: 0,
            totalRevenue: 0,
            estimatedUnlockRevenue: 0,
          }
        );
      }
    } catch {
      toast.error("Failed to load unlocked referrals ledger.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnlocks();
  }, [fetchUnlocks]);

  const filteredUnlocks = unlocks.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;

    const userName = item.user?.name || "";
    const userEmail = item.user?.email || "";
    const userPhone = item.user?.phone || "";
    const jobTitle = item.job?.title || "";
    const company = item.job?.company || "";

    return (
      userName.toLowerCase().includes(q) ||
      userEmail.toLowerCase().includes(q) ||
      userPhone.toLowerCase().includes(q) ||
      jobTitle.toLowerCase().includes(q) ||
      company.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const exportCSV = () => {
    if (filteredUnlocks.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const headers = [
      "User Name",
      "User Email",
      "User Phone",
      "Referral Job Title",
      "Company",
      "Credits Spent",
      "Unlocked Date",
    ];

    const rows = filteredUnlocks.map((u) => [
      `"${u.user?.name || ""}"`,
      `"${u.user?.email || ""}"`,
      `"${u.user?.phone || ""}"`,
      `"${u.job?.title || ""}"`,
      `"${u.job?.company || ""}"`,
      u.creditCost,
      `"${formatDate(u.unlockedAt)}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `premium_referral_unlocks_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Exported CSV successfully! 📊");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Unlock className="w-3.5 h-3.5 text-amber-400" /> User Referral Credit Unlocks
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Premium Referral Unlock & Revenue Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track total payments collected, credits spent, unlocking candidate name, email, and mobile phone number.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 transition flex items-center gap-1.5 text-xs font-bold"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={fetchUnlocks}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Summary Cards (Including Total Revenue Payment) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Payments / Revenue */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 relative overflow-hidden shadow-lg">
          <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Total Credit Revenue (Payment)
          </p>
          <p className="text-2xl font-black text-emerald-300 mt-1 flex items-center gap-0.5">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-500/80 mt-1 font-medium">
            Payments from credit purchases
          </p>
        </div>

        {/* Total Referral Unlocks */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Unlock className="w-3.5 h-3.5 text-amber-400" /> Total Referral Unlocks
          </p>
          <p className="text-2xl font-black text-white mt-1">
            {stats.totalUnlocks}
          </p>
        </div>

        {/* Total Credits Spent */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Total Credits Spent
          </p>
          <p className="text-2xl font-black text-amber-300 mt-1">
            {stats.totalCreditsSpent}{" "}
            <span className="text-xs font-normal text-slate-400">Credits</span>
          </p>
          {stats.estimatedUnlockRevenue > 0 && (
            <p className="text-[10px] text-slate-500 mt-1">
              Est. Value: ~₹{stats.estimatedUnlockRevenue.toLocaleString()}
            </p>
          )}
        </div>

        {/* Unique Unlocking Users */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-violet-400" /> Unique Unlocking Users
          </p>
          <p className="text-2xl font-black text-violet-300 mt-1">
            {stats.uniqueUsersCount}
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by User Name, Email, Phone/Mobile, Job Title, or Company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">User Details (Name & Contact)</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Mobile / Phone</th>
              <th className="py-3 px-4">Unlocked Referral Job</th>
              <th className="py-3 px-4">Credits Used</th>
              <th className="py-3 px-4">Unlocked At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Loading user referral unlocks...
                </td>
              </tr>
            ) : filteredUnlocks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No unlocked referral records found.
                </td>
              </tr>
            ) : (
              filteredUnlocks.map((item) => (
                <tr key={item._id} className="hover:bg-slate-800/30 transition">
                  {/* User Name & Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs flex-shrink-0 overflow-hidden">
                        {item.user?.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.user.avatar}
                            alt={item.user.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (item.user?.name?.[0] || "U").toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">
                          {item.user?.name || "Candidate User"}
                        </p>
                        <span className="text-[10px] text-slate-500">
                          ID: {item.user?._id?.slice(-6) || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4">
                    <a
                      href={`mailto:${item.user?.email}`}
                      className="text-violet-300 hover:text-violet-200 font-mono text-xs flex items-center gap-1.5 hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5 text-violet-400" />
                      {item.user?.email || "N/A"}
                    </a>
                  </td>

                  {/* Mobile / Phone */}
                  <td className="py-3.5 px-4">
                    {item.user?.phone ? (
                      <a
                        href={`tel:${item.user.phone}`}
                        className="text-emerald-400 hover:text-emerald-300 font-mono text-xs flex items-center gap-1.5 hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {item.user.phone}
                      </a>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-600" /> Not Provided
                      </span>
                    )}
                  </td>

                  {/* Referral Job Details */}
                  <td className="py-3.5 px-4">
                    <div>
                      {item.job?.slug && item.job.slug !== "#" ? (
                        <Link
                          href={`/jobs-Alerts/${item.job.slug}`}
                          className="font-bold text-white hover:text-amber-300 transition text-xs flex items-center gap-1"
                        >
                          {item.job?.title} <ExternalLink className="w-3 h-3 text-slate-500" />
                        </Link>
                      ) : (
                        <span className="font-bold text-slate-300 text-xs">
                          {item.job?.title}
                        </span>
                      )}
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-violet-400" /> {item.job?.company}
                      </p>
                    </div>
                  </td>

                  {/* Credits Cost */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-extrabold text-amber-300 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
                      <Coins className="w-3.5 h-3.5 fill-amber-400" /> {item.creditCost} Credits
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formatDate(item.unlockedAt)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
