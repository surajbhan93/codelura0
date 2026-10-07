"use client";

import { useEffect, useState, useCallback } from "react";
import { Coins, Plus, Sparkles } from "lucide-react";
import { getCreditWallet } from "@/lib/creditsApi";
import BuyCreditsModal from "./BuyCreditsModal";

interface CreditBadgeProps {
  showBuyBtn?: boolean;
  className?: string;
  onBalanceChange?: (balance: number) => void;
}

export default function CreditBadge({
  showBuyBtn = true,
  className = "",
  onBalanceChange,
}: CreditBadgeProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      const wallet = await getCreditWallet();
      setBalance(wallet.balance);
      if (onBalanceChange) onBalanceChange(wallet.balance);
    } catch {
      // User might not be logged in or token invalid
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [onBalanceChange]);

  useEffect(() => {
    fetchBalance();

    // Listen to global credit update custom events if emitted
    const handleCreditUpdate = (e: CustomEvent) => {
      if (typeof e.detail?.balance === "number") {
        setBalance(e.detail.balance);
      } else {
        fetchBalance();
      }
    };

    window.addEventListener("credits-updated" as any, handleCreditUpdate);
    return () => {
      window.removeEventListener("credits-updated" as any, handleCreditUpdate);
    };
  }, [fetchBalance]);

  if (balance === null && !loading) return null;

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-violet-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm">
          <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{loading ? "..." : `${balance} Credits`}</span>
        </div>

        {showBuyBtn && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-sm"
            title="Recharge Credits"
          >
            <Plus className="w-3.5 h-3.5" /> Buy Credits
          </button>
        )}
      </div>

      <BuyCreditsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newBal) => {
          setBalance(newBal);
          if (onBalanceChange) onBalanceChange(newBal);
          window.dispatchEvent(new CustomEvent("credits-updated", { detail: { balance: newBal } }));
        }}
      />
    </>
  );
}
