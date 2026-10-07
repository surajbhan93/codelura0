"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Coins,
  CreditCard,
  History,
  Unlock,
  Plus,
  ExternalLink,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getCreditWallet,
  getCreditHistory,
  getMyUnlockedReferrals,
  CreditWallet,
  CreditTransaction,
} from "@/lib/creditsApi";
import BuyCreditsModal from "./BuyCreditsModal";
import toast from "react-hot-toast";
import Link from "next/link";

export default function UserDashboardCredits() {
  const [wallet, setWallet] = useState<CreditWallet | null>(null);
  const [activeTab, setActiveTab] = useState<"unlocked" | "history">("unlocked");
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [unlockedReferrals, setUnlockedReferrals] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [walletData, unlockedData, historyData] = await Promise.all([
        getCreditWallet(),
        getMyUnlockedReferrals(),
        getCreditHistory(page, 10),
      ]);
      setWallet(walletData);
      setUnlockedReferrals(unlockedData);
      setHistory(historyData.transactions || []);
      setTotalPages(historyData.pagination?.pages || 1);
    } catch (err: any) {
      toast.error("Failed to load credits dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBuySuccess = (newBalance: number) => {
    if (wallet) {
      setWallet({
        ...wallet,
        balance: newBalance,
        totalPurchased: wallet.totalPurchased + (newBalance - wallet.balance),
      });
    }
    loadData();
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner & Wallet Stats */}
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-[#0c0d21] via-[#10122e] to-[#080916] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" /> Credit Balance Wallet
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              My Referral Credits & Unlocks
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Spend credits to unlock direct recruiter referral links and contact details.
            </p>
          </div>

          <button
            onClick={() => setIsBuyModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 font-bold text-sm text-white transition shadow-lg shadow-violet-500/25"
          >
            <Plus className="w-4 h-4" /> Buy More Credits
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Available Credits</p>
              <p className="text-2xl font-black text-amber-300">
                {loading ? "..." : wallet?.balance ?? 0}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Purchased</p>
              <p className="text-2xl font-black text-violet-300">
                {loading ? "..." : wallet?.totalPurchased ?? 0}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Unlock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Unlocked Referrals</p>
              <p className="text-2xl font-black text-emerald-300">
                {loading ? "..." : unlockedReferrals.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab("unlocked")}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "unlocked"
              ? "border-violet-500 text-violet-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Unlock className="w-4 h-4" /> My Unlocked Referrals ({unlockedReferrals.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "history"
              ? "border-violet-500 text-violet-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <History className="w-4 h-4" /> Credit Transactions Ledger
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "unlocked" ? (
        <div>
          {unlockedReferrals.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
              <Unlock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-300">No Unlocked Referrals Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Explore Premium Referral jobs in the Career Hub and spend credits to unlock recruiter contacts & apply links.
              </p>
              <Link
                href="/career"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition"
              >
                Browse Careers <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedReferrals.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between hover:border-violet-500/40 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-1">
                          ✓ Unlocked
                        </span>
                        <h4 className="font-bold text-lg text-white">{item.title}</h4>
                        <p className="text-xs text-violet-300 font-medium flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> {item.company}
                        </p>
                      </div>

                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{" "}
                        {item.unlockedAt ? new Date(item.unlockedAt).toLocaleDateString() : ""}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 my-3">{item.description}</p>

                    {/* Sensitive Unlocked Details */}
                    <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1.5 my-3 text-xs">
                      {item.recruiterEmail && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                          <span className="font-mono text-violet-300">{item.recruiterEmail}</span>
                        </div>
                      )}
                      {item.recruiterPhone && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                          <span className="font-mono text-violet-300">{item.recruiterPhone}</span>
                        </div>
                      )}
                      {item.applyInstructions && (
                        <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                          <span className="font-bold text-slate-300">Instructions:</span> {item.applyInstructions}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    {item.referralLink || item.careerPageUrl ? (
                      <a
                        href={item.referralLink || item.careerPageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        Apply Directly <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : null}
                    <Link
                      href={`/career/jobs/latest`}
                      className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* History Ledger Tab */
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  history.map((tx) => {
                    const isAddition = tx.amount > 0;
                    return (
                      <tr key={tx._id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(tx.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded ${
                              tx.type === "PURCHASE" || tx.type === "ADMIN_CREDIT"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-purple-500/10 text-purple-300 border border-purple-500/30"
                            }`}
                          >
                            {isAddition ? (
                              <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <ArrowUpRight className="w-3 h-3 text-purple-400" />
                            )}
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-200">{tx.description}</td>
                        <td
                          className={`py-3 px-4 font-bold text-sm ${
                            isAddition ? "text-emerald-400" : "text-purple-400"
                          }`}
                        >
                          {isAddition ? `+${tx.amount}` : tx.amount}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">{tx.balanceAfter}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buy Credits Modal */}
      <BuyCreditsModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onSuccess={handleBuySuccess}
      />
    </div>
  );
}
