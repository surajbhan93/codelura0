"use client";

import { useEffect, useState } from "react";
import { Coins, Sparkles, X, CheckCircle2, ShieldCheck, Zap, Gift, Check } from "lucide-react";
import {
  getCreditPackages,
  createCreditOrder,
  verifyCreditPayment,
  claimFreeTrial,
  getCreditWallet,
  CreditPackage,
} from "@/lib/creditsApi";
import toast from "react-hot-toast";

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newBalance: number) => void;
  requiredCredits?: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BuyCreditsModal({
  isOpen,
  onClose,
  onSuccess,
  requiredCredits,
}: BuyCreditsModalProps) {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [freeTrialClaimed, setFreeTrialClaimed] = useState(false);
  const [claimingTrial, setClaimingTrial] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Load Razorpay script dynamically if not present
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [pkgs, wallet] = await Promise.all([
          getCreditPackages(),
          getCreditWallet().catch(() => null),
        ]);
        setPackages(pkgs);
        if (wallet?.freeTrialClaimed) {
          setFreeTrialClaimed(true);
        }
      } catch (err: any) {
        toast.error("Failed to load credit packages.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaimTrial = async () => {
    try {
      setClaimingTrial(true);
      const res = await claimFreeTrial();
      if (res.success) {
        toast.success(res.message || "🎉 30 Free Trial Credits Activated!");
        setFreeTrialClaimed(true);
        if (onSuccess && res.wallet?.balance !== undefined) {
          onSuccess(res.wallet.balance);
        }
      } else {
        toast.error(res.message || "Failed to claim free trial.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not claim free trial.");
    } finally {
      setClaimingTrial(false);
    }
  };

  const handleBuy = async (pkg: CreditPackage) => {
    try {
      setPurchasingId(pkg._id);
      const orderData = await createCreditOrder(pkg._id);

      if (!orderData.success || !orderData.order) {
        toast.error(orderData.message || "Failed to initiate payment.");
        setPurchasingId(null);
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Codelura Credits",
        description: `Purchase ${pkg.name} (${pkg.credits} Credits)`,
        order_id: orderData.order.id,
        handler: async (response: any) => {
          toast.loading("Verifying payment...", { id: "credit-pay" });
          try {
            const verifyRes = await verifyCreditPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              packageId: pkg._id,
            });

            if (verifyRes.success) {
              toast.success(verifyRes.message || "Credits added to wallet!", { id: "credit-pay" });
              if (onSuccess && verifyRes.wallet?.balance !== undefined) {
                onSuccess(verifyRes.wallet.balance);
              }
              onClose();
            } else {
              toast.error(verifyRes.message || "Payment verification failed.", { id: "credit-pay" });
            }
          } catch (err: any) {
            toast.error(err?.response?.data?.message || "Payment verification failed.", { id: "credit-pay" });
          } finally {
            setPurchasingId(null);
          }
        },
        modal: {
          ondismiss: () => {
            setPurchasingId(null);
            toast("Payment cancelled.", { icon: "ℹ️" });
          },
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not start payment.");
      setPurchasingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-md p-4 pt-20 sm:pt-24 pb-12 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#090d1f] border border-violet-500/30 p-6 sm:p-8 shadow-2xl text-white my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-violet-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-sm">
            <Coins className="w-4 h-4 text-amber-400 fill-amber-400" /> 30 Free Trial Credits Included For New Users
          </div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Get Credits to Unlock Premium Referrals
          </h2>
          {requiredCredits ? (
            <p className="text-sm text-amber-300 mt-2 font-medium bg-amber-500/10 border border-amber-500/20 py-1.5 px-3 rounded-xl inline-block">
              ⚠️ You need at least <span className="font-bold">{requiredCredits} credits</span> to unlock this referral opportunity.
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-1">
              Select a credit package to recharge your wallet instantly. Credits never expire!
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading packages...</p>
          </div>
        ) : (
          /* Package Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dedicated Free Trial Card */}
            <div className="relative rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-slate-900 p-5 flex flex-col justify-between transition hover:scale-[1.01] shadow-lg shadow-emerald-500/10 col-span-1 sm:col-span-2 mb-1">
              <span className="absolute -top-3 right-4 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                100% FREE TRIAL
              </span>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-white">Student Free Trial Pack</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold">
                      ₹0 FREE
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-black text-sm ml-2">
                      <Coins className="w-4 h-4 fill-amber-400" /> 30 Credits
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Activate <strong>30 Free Referral Credits</strong> instantly to test & unlock premium recruiter contact details.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> 30 Free Referral Credits</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> Unlock Direct HR & Recruiter Contacts</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> 100% Free Candidate Access</span>
                  </div>
                </div>

                <div className="flex-shrink-0 sm:self-center">
                  <button
                    onClick={handleClaimTrial}
                    disabled={freeTrialClaimed || claimingTrial}
                    className={`px-5 py-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md w-full sm:w-auto ${
                      freeTrialClaimed
                        ? "bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-not-allowed opacity-90"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 cursor-pointer"
                    }`}
                  >
                    {claimingTrial ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        Activating...
                      </>
                    ) : freeTrialClaimed ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> 30 Free Credits Claimed
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4" /> Activate 30 Free Credits
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {packages.map((pkg) => {
              const isPurchasing = purchasingId === pkg._id;
              const isPopular = pkg.badge?.toLowerCase().includes("popular") || pkg.badge?.toLowerCase().includes("best");

              // Tier-specific features without emoji clutter
              const features =
                pkg.price <= 49
                  ? [
                      `${pkg.credits} Instant Credits to Unlock HR Referrals`,
                      `Direct Recruiter Email & Contact Details`,
                      `Internal Employee Referral Apply Links`,
                      `100% Verified Openings & Lifetime Validity`,
                    ]
                  : pkg.price <= 99
                  ? [
                      `${pkg.credits} Credits (Most Popular Among Candidates)`,
                      `Verified HR Email & Direct Phone Number Access`,
                      `Priority Internal Referral Apply Links`,
                      `10x Higher Chance of Interview Shortlisting`,
                      `Unlocked Details Never Expire (Lifetime Access)`,
                    ]
                  : pkg.price <= 199
                  ? [
                      `${pkg.credits} Credits (Best Value for Active Job Seekers)`,
                      `Direct HR Email + Direct Phone + LinkedIn Access`,
                      `Fast-Track Internal Referral Submissions`,
                      `Direct Interview Opportunities & Resume Boost`,
                      `Lifetime Credit Validity + Priority Candidate Support`,
                    ]
                  : [
                      `${pkg.credits} Credits (Ultimate Placement Pass)`,
                      `Unlimited Access to Top MNC & Tech HR Networks`,
                      `VIP Direct Referral Submissions & Direct Calls`,
                      `Fast-Track Candidate Shortlisting & Resume Push`,
                      `Lifetime Unlocked Access & Dedicated 24/7 Support`,
                    ];

              return (
                <div
                  key={pkg._id}
                  className={`relative rounded-xl border p-5 flex flex-col justify-between transition hover:scale-[1.02] ${
                    isPopular
                      ? "border-violet-500 bg-gradient-to-br from-violet-950/40 via-purple-900/20 to-slate-900 shadow-lg shadow-violet-500/10"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  {pkg.badge && (
                    <span className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                      {pkg.badge}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-base text-white">{pkg.name}</h3>
                      <div className="flex items-center gap-1 text-amber-400 font-extrabold text-lg">
                        <Coins className="w-4 h-4 fill-amber-400" />
                        <span>{pkg.credits}</span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-2xl font-black text-white">₹{pkg.price}</span>
                      <span className="text-xs text-slate-400">one-time</span>
                    </div>

                    <ul className="space-y-2 mb-4 text-xs text-slate-300">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBuy(pkg)}
                    disabled={purchasingId !== null}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md ${
                      isPopular
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    } disabled:opacity-50`}
                  >
                    {isPurchasing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" /> Buy Now for ₹{pkg.price}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> 100% Secure Razorpay Payment
          </span>
          <span>Instant wallet top-up</span>
        </div>
      </div>
    </div>
  );
}
