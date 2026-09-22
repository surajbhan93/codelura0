"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import {
  CreditCard,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Hash,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

interface PaymentFormProps {
  projectId: string;
  maxAmount: number;
  emiAmount: number;
  paymentSettings: {
    upiNumber: string;
    qrCodeUrl: string | null;
  };
  onSuccess: () => void;
}

export default function PaymentForm({
  projectId,
  maxAmount,
  emiAmount,
  paymentSettings,
  onSuccess,
}: PaymentFormProps) {
  const [step, setStep] = useState<"amount" | "method" | "submit">("amount");
  const [amount, setAmount] = useState<number>(emiAmount || 0);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "QR">("UPI");
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const quickAmounts = [
    { label: `₹${emiAmount.toLocaleString("en-IN")} (Next EMI)`, value: emiAmount },
    { label: "₹5,000", value: 5000 },
    { label: "₹10,000", value: 10000 },
    { label: `₹${maxAmount.toLocaleString("en-IN")} (Full Remaining)`, value: maxAmount },
  ];

  const handleQuickAmount = (value: number) => {
    if (value <= maxAmount) {
      setAmount(value);
    }
  };

  const copyUpiNumber = async () => {
    try {
      await navigator.clipboard.writeText(paymentSettings.upiNumber);
      setCopiedUpi(true);
      toast.success("UPI ID / Number copied to clipboard!");
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {
      toast.error("Failed to copy UPI number");
    }
  };

  const openUpiApp = () => {
    const upiLink = `upi://pay?pa=${paymentSettings.upiNumber}@paytm&pn=Codelura&am=${amount}&cu=INR`;
    window.location.href = upiLink;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount <= 0 || amount > maxAmount) {
      toast.error(`Please enter an amount between ₹1 and ${formatCurrency(maxAmount)}`);
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!utrNumber.trim()) {
      toast.error("Please enter the UTR / Transaction ID");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("projectPaymentId", projectId);
      formData.append("amount", amount.toString());
      formData.append("paymentMethod", paymentMethod);
      formData.append("utrNumber", utrNumber.trim());
      formData.append("paymentDate", paymentDate);
      if (notes.trim()) {
        formData.append("notes", notes.trim());
      }

      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/api/payments/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onSuccess();
    } catch (error: any) {
      console.error("Payment submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between px-2 pb-4 border-b border-slate-800">
        {[
          { key: "amount", label: "1. Amount" },
          { key: "method", label: "2. Pay Method" },
          { key: "submit", label: "3. Confirm & UTR" },
        ].map((s, idx) => {
          const isActive = step === s.key;
          const isDone =
            (step === "method" && idx === 0) ||
            (step === "submit" && idx <= 1);

          return (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/40 ring-2 ring-violet-400/30"
                    : isDone
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                }`}
              >
                {isDone ? "✓" : idx + 1}
              </span>
              <span
                className={`text-xs font-semibold hidden sm:inline ${
                  isActive ? "text-white" : isDone ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                {s.label.split(". ")[1]}
              </span>
              {idx < 2 && <span className="text-slate-700 mx-1">›</span>}
            </div>
          );
        })}
      </div>

      {/* STEP 1: AMOUNT SELECTION */}
      {step === "amount" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Enter Payment Amount (INR)
            </label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-violet-400">
                ₹
              </span>
              <input
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="0"
                min="1"
                max={maxAmount}
                className="w-full pl-12 pr-6 py-4 text-3xl font-extrabold bg-slate-900 border-2 border-slate-700 hover:border-slate-600 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 rounded-2xl text-white outline-none transition-all shadow-inner"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 px-1">
              <span>Min: ₹1</span>
              <span>Max Remaining: <strong className="text-violet-300">{formatCurrency(maxAmount)}</strong></span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              ⚡ Quick Select Amount
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickAmounts.map((quick) => (
                <button
                  key={quick.label}
                  type="button"
                  onClick={() => handleQuickAmount(quick.value)}
                  disabled={quick.value > maxAmount}
                  className={`py-3.5 px-4 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between ${
                    amount === quick.value
                      ? "border-violet-500 bg-gradient-to-r from-violet-600/25 to-indigo-600/25 text-white shadow-lg shadow-violet-600/20 ring-1 ring-violet-500"
                      : quick.value > maxAmount
                      ? "border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed"
                      : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  <span>{quick.label}</span>
                  {amount === quick.value && <CheckCircle2 className="h-4 w-4 text-violet-400" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => amount > 0 && amount <= maxAmount && setStep("method")}
            disabled={!amount || amount <= 0 || amount > maxAmount}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <span>Continue to Payment Method</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* STEP 2: CHOOSE PAYMENT METHOD */}
      {step === "method" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("amount")}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Amount
            </button>
            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
              Amount: {formatCurrency(amount)}
            </span>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Payment Option
            </label>

            {/* UPI Option */}
            <div
              onClick={() => setPaymentMethod("UPI")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === "UPI"
                  ? "border-violet-500 bg-violet-950/30 shadow-xl shadow-violet-900/20"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-violet-600/30">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Pay using UPI / Mobile</p>
                    <p className="text-xs text-slate-400">Direct instant transfer via any UPI App</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === "UPI"
                      ? "border-violet-500 bg-violet-600 text-white"
                      : "border-slate-600"
                  }`}
                >
                  {paymentMethod === "UPI" && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {paymentMethod === "UPI" && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">UPI Number / VPA</span>
                      <span className="text-lg font-mono font-bold text-violet-300 tracking-wider">
                        {paymentSettings.upiNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={copyUpiNumber}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition"
                      >
                        {copiedUpi ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-violet-400" />}
                        <span>{copiedUpi ? "Copied" : "Copy"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={openUpiApp}
                        className="px-3.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-violet-600/20"
                      >
                        <span>Open App</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* QR Option */}
            {paymentSettings.qrCodeUrl && (
              <div
                onClick={() => setPaymentMethod("QR")}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "QR"
                    ? "border-violet-500 bg-violet-950/30 shadow-xl shadow-violet-900/20"
                    : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Scan QR Code</p>
                      <p className="text-xs text-slate-400">PhonePe, Google Pay, Paytm, BHIM</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "QR"
                        ? "border-violet-500 bg-violet-600 text-white"
                        : "border-slate-600"
                    }`}
                  >
                    {paymentMethod === "QR" && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                {paymentMethod === "QR" && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
                    <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl border-4 border-slate-800 mx-auto">
                      <Image
                        src={paymentSettings.qrCodeUrl}
                        alt="Payment QR Code"
                        width={220}
                        height={220}
                        className="rounded-xl mx-auto"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      UPI: <strong className="text-white font-mono">{paymentSettings.upiNumber}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setStep("submit")}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>I Have Completed the Payment</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* STEP 3: SUBMIT TRANSACTION ID (SUPER BEAUTIFUL & SCREENSHOT REMOVED) */}
      {step === "submit" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("method")}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Payment Method
            </button>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Safe & Secure
            </span>
          </div>

          {/* Amount & Method Summary Banner */}
          <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-slate-900 to-indigo-950/40 p-4 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Paying Amount</span>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-white">
                {formatCurrency(amount)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Method</span>
              <p className="text-sm font-bold text-violet-300">{paymentMethod}</p>
            </div>
          </div>

          {/* SUPER BEAUTIFUL UTR / TRANSACTION ID SECTION */}
          <div className="relative group">
            {/* Outer Multi-color Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500 group-focus-within:opacity-100 animate-pulse" />

            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-5 border border-slate-700/80 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-cyan-400 animate-bounce" /> UTR / Transaction ID *
                </label>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Required for Instant Verification
                </span>
              </div>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-cyan-400">
                  <Hash className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 423589123456 or T240916..."
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3.5 text-base font-mono font-bold bg-slate-950/90 border border-cyan-500/40 rounded-xl text-cyan-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition shadow-inner tracking-wider"
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-400 flex-shrink-0" />
                <span>Enter the 12-digit UTR or Transaction ID shown in PhonePe, GPay, Paytm, or your bank app.</span>
              </p>
            </div>
          </div>

          {/* Payment Date Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-violet-400" /> Payment Date *
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Optional Note / Remarks
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid from HDFC account ending in 4092..."
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !utrNumber.trim()}
            className="w-full py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            <Lock className="h-4 w-4" />
            <span>{submitting ? "Verifying & Submitting..." : "Submit Payment for Verification"}</span>
          </button>

          <p className="text-[11px] text-center text-slate-500">
            🔒 Your payment submission is encrypted and will be verified by the finance desk within 2-4 hours.
          </p>
        </div>
      )}
    </form>
  );
}
