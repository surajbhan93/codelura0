"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CreditCard,
  Coins,
  Users,
  IndianRupee,
  Search,
  RefreshCw,
  Gift,
  CheckCircle2,
  Clock,
  User,
  Mail,
  Phone,
  Sparkles,
  Filter,
} from "lucide-react";
import { getAdminSubscriptions } from "@/lib/creditsApi";
import toast from "react-hot-toast";

interface SubscriptionItem {
  _id: string;
  user: {
    _id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    phone?: string;
    role?: string;
  };
  type: string;
  creditsGranted: number;
  pricePaid: number;
  isFree: boolean;
  referenceId: string;
  referenceType: string;
  description: string;
  createdAt: string;
}

export default function AdminSubscriptionsManager() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    totalRevenue: 0,
    freeTrialCount: 0,
    paidCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "free">("all");

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminSubscriptions();
      if (res.success) {
        setSubscriptions(res.subscriptions || []);
        setStats(res.stats || { totalSubscriptions: 0, totalRevenue: 0, freeTrialCount: 0, paidCount: 0 });
      }
    } catch {
      toast.error("Failed to load subscription ledger.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const filteredItems = subscriptions.filter((item) => {
    const matchesFilter =
      filter === "all" ? true : filter === "paid" ? !item.isFree : item.isFree;

    const q = search.toLowerCase().trim();
    if (!q) return matchesFilter;

    const userName = item.user?.name || "";
    const userEmail = item.user?.email || "";
    const refId = item.referenceId || "";
    const desc = item.description || "";

    const matchesSearch =
      userName.toLowerCase().includes(q) ||
      userEmail.toLowerCase().includes(q) ||
      refId.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Student Subscriptions & Credit Payments
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Subscription & Payment Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track free trial activations, paid credit purchases, student emails, and revenue.
          </p>
        </div>

        <button
          onClick={fetchSubscriptions}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-2 text-xs font-semibold self-start sm:self-auto"
          title="Refresh Subscriptions"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 font-medium">Total Revenue</p>
          <p className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-1">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 font-medium">Paid Subscriptions</p>
          <p className="text-2xl font-black text-violet-300 mt-1">{stats.paidCount}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 font-medium">Free Trial Claims (30 Credits)</p>
          <p className="text-2xl font-black text-amber-300 mt-1">{stats.freeTrialCount}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 font-medium">Total Claims & Orders</p>
          <p className="text-2xl font-black text-white mt-1">{stats.totalSubscriptions}</p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name, email, payment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === "all"
                ? "bg-violet-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All ({stats.totalSubscriptions})
          </button>
          <button
            onClick={() => setFilter("paid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === "paid"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Paid Only ({stats.paidCount})
          </button>
          <button
            onClick={() => setFilter("free")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === "free"
                ? "bg-amber-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Free Trial Only ({stats.freeTrialCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Student Candidate</th>
              <th className="py-3 px-4">Subscription Type</th>
              <th className="py-3 px-4">Amount Paid</th>
              <th className="py-3 px-4">Credits Added</th>
              <th className="py-3 px-4">Reference ID</th>
              <th className="py-3 px-4">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Loading subscriptions ledger...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No subscription records found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item._id} className="hover:bg-slate-800/30 transition">
                  {/* Candidate User Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {item.user?.avatar ? (
                        <img
                          src={item.user.avatar}
                          alt={item.user?.name || "User"}
                          className="w-8 h-8 rounded-full object-cover border border-violet-500/40 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-300 text-xs flex-shrink-0">
                          {(item.user?.name || "S").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-sm text-white">
                          {item.user?.name || "Student Candidate"}
                        </span>
                        <p className="text-[11px] text-violet-300 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" /> {item.user?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      {item.isFree ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          <Gift className="w-3 h-3" /> Free Trial (30 Credits)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CreditCard className="w-3 h-3" /> Paid Package
                        </span>
                      )}
                      <p className="text-[11px] text-slate-400 font-mono">{item.description}</p>
                    </div>
                  </td>

                  {/* Price Paid */}
                  <td className="py-3 px-4">
                    {item.isFree ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-black bg-slate-800 text-slate-400 border border-slate-700">
                        ₹0 (FREE)
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        ₹{item.pricePaid}
                      </span>
                    )}
                  </td>

                  {/* Credits Granted */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-extrabold text-amber-300 text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      <Coins className="w-3 h-3 fill-amber-400" /> +{item.creditsGranted}
                    </span>
                  </td>

                  {/* Reference ID */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    {item.referenceId}
                  </td>

                  {/* Date & Time */}
                  <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatDate(item.createdAt)}
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
