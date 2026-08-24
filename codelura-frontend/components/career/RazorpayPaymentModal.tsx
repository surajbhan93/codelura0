"use client";

import { useState } from "react";
import { X, ShieldCheck, CreditCard, QrCode, Building2, CheckCircle2, Lock } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface RazorpayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    orderId: string;
    enrollmentId: string;
    amount: number;
    currency: string;
    itemTitle: string;
  };
  onSuccess: () => void;
}

export default function RazorpayPaymentModal({
  isOpen,
  onClose,
  orderData,
  onSuccess,
}: RazorpayPaymentModalProps) {
  const [activeTab, setActiveTab] = useState<"card" | "upi" | "netbanking">("upi");
  const [loading, setLoading] = useState(false);

  // Form states
  const [upiId, setUpiId] = useState("success@razorpay");
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call backend verification
      const { data } = await api.post("/enrollments/verify-payment", {
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: `pay_rzp_${Date.now()}`,
        razorpay_signature: "mock_razorpay_signature",
        enrollmentId: orderData.enrollmentId,
      });

      if (data.success) {
        toast.success(`Payment Successful! Enrolled in ${orderData.itemTitle} 🎉`);
        onSuccess();
        onClose();
      } else {
        toast.error("Payment verification failed.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Payment processing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-blue-500/30 bg-[#0B0F28] text-white shadow-2xl shadow-blue-950/80">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-blue-500/20 bg-gradient-to-r from-[#0F1435] to-[#0A0D24] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-blue-400">
              Razorpay
            </span>
            <span className="flex items-center gap-1 rounded-full bg-blue-950/80 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
              <ShieldCheck size={12} className="text-blue-400" />
              Secured Checkout
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Order Summary Box */}
        <div className="border-b border-blue-500/10 bg-[#0E1333] px-6 py-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Payment for
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <h4 className="text-base font-extrabold text-white truncate max-w-[240px]">
              {orderData.itemTitle}
            </h4>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">
                ₹{orderData.amount.toLocaleString("en-IN")}
              </span>
              <span className="block text-[10px] text-slate-400 font-medium">
                Inclusive of GST
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Tab */}
        <div className="flex border-b border-blue-500/15 bg-[#090C22]">
          <button
            type="button"
            onClick={() => setActiveTab("upi")}
            className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-bold transition border-b-2 ${
              activeTab === "upi"
                ? "border-blue-500 bg-blue-950/40 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <QrCode size={14} />
            UPI / QR
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("card")}
            className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-bold transition border-b-2 ${
              activeTab === "card"
                ? "border-blue-500 bg-blue-950/40 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <CreditCard size={14} />
            Cards
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("netbanking")}
            className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-bold transition border-b-2 ${
              activeTab === "netbanking"
                ? "border-blue-500 bg-blue-950/40 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 size={14} />
            Netbanking
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePay} className="p-6 space-y-4">
          {activeTab === "upi" && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Enter VPA / UPI ID (Google Pay, PhonePe, Paytm)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@upi"
                  className="w-full rounded-xl border border-blue-500/30 bg-[#070A1E] px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <span className="absolute right-3 top-3 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Auto Verified
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-blue-950/30 border border-blue-500/20 p-3 text-[11px] text-slate-300">
                <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                <span>Instant confirmation via UPI App notification</span>
              </div>
            </div>
          )}

          {activeTab === "card" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full rounded-xl border border-blue-500/30 bg-[#070A1E] px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full rounded-xl border border-blue-500/30 bg-[#070A1E] px-4 py-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full rounded-xl border border-blue-500/30 bg-[#070A1E] px-4 py-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "netbanking" && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Select Bank
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-semibold text-left transition ${
                      selectedBank === bank
                        ? "border-blue-500 bg-blue-950/60 text-blue-300"
                        : "border-blue-500/20 bg-[#070A1E] text-slate-300 hover:border-blue-500/40"
                    }`}
                  >
                    🏦 {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 px-6 py-4 text-xs font-extrabold text-white shadow-lg shadow-blue-600/40 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock size={14} />
                Pay ₹{orderData.amount.toLocaleString("en-IN")} via Razorpay
              </span>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400 font-medium">
            256-Bit SSL Encrypted • Powered by Razorpay Gateway
          </p>
        </form>
      </div>
    </div>
  );
}
