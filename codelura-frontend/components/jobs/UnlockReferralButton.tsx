"use client";

import { useState } from "react";
import { Lock, Unlock, Coins, ArrowRight, CheckCircle2 } from "lucide-react";
import { unlockReferral } from "@/lib/creditsApi";
import BuyCreditsModal from "@/components/credits/BuyCreditsModal";
import toast from "react-hot-toast";

interface UnlockReferralButtonProps {
  referralId: string;
  creditCost?: number;
  isUnlocked?: boolean;
  onUnlockedSuccess?: (updatedJob: any, newBalance: number) => void;
  className?: string;
}

export default function UnlockReferralButton({
  referralId,
  creditCost = 10,
  isUnlocked = false,
  onUnlockedSuccess,
  className = "",
}: UnlockReferralButtonProps) {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [loading, setLoading] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const handleUnlockClick = async () => {
    // Check if token exists
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please log in to unlock premium referrals.");
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    try {
      setLoading(true);
      const res = await unlockReferral(referralId);

      if (res.success) {
        setUnlocked(true);
        toast.success(res.message || "Referral unlocked successfully!", { icon: "🎉" });

        if (res.wallet?.balance !== undefined) {
          window.dispatchEvent(
            new CustomEvent("credits-updated", { detail: { balance: res.wallet.balance } })
          );
        }

        if (onUnlockedSuccess) {
          onUnlockedSuccess(res.referral, res.wallet?.balance);
        }
      }
    } catch (err: any) {
      const data = err?.response?.data;
      if (err?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      } else if (data?.insufficientCredits) {
        toast.error(`Insufficient credits. You need ${creditCost} credits to unlock this referral.`);
        setShowBuyModal(true);
      } else {
        toast.error(data?.message || "Failed to unlock referral.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (unlocked) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Unlocked</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleUnlockClick}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-violet-600 hover:from-amber-400 hover:to-violet-500 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <span>Unlocking...</span>
          </>
        ) : (
          <>
            <Lock className="w-3.5 h-3.5 text-slate-950" />
            <span>Unlock Referral</span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-950/20 text-slate-950 font-black text-[10px]">
              <Coins className="w-3 h-3 fill-slate-950" /> {creditCost}
            </span>
          </>
        )}
      </button>

      <BuyCreditsModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        requiredCredits={creditCost}
        onSuccess={() => {
          setShowBuyModal(false);
          // Auto retry unlock after purchase
          handleUnlockClick();
        }}
      />
    </>
  );
}
