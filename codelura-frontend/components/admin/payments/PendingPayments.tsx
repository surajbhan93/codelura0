"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

interface Payment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  projectPaymentId: {
    _id: string;
    projectName: string;
    totalProjectAmount: number;
  };
  amount: number;
  paymentMethod: string;
  utrNumber: string;
  paymentDate: string;
  screenshotUrl?: string;
  notes?: string;
  createdAt: string;
}

export default function PendingPayments({ onPaymentVerified }: { onPaymentVerified: () => void }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/payments/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data.payments);
    } catch (error: any) {
      console.error("Error fetching pending payments:", error);
      toast.error("Failed to load pending payments");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (paymentId: string) => {
    if (!verificationNotes.trim() && !confirm("Proceed without verification notes?")) {
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/payments/admin/verify/${paymentId}`,
        { verificationNotes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Payment verified successfully!");
      setSelectedPayment(null);
      setVerificationNotes("");
      fetchPendingPayments();
      onPaymentVerified();
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      toast.error(error.response?.data?.message || "Failed to verify payment");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    if (!confirm("Are you sure you want to reject this payment?")) {
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/payments/admin/reject/${paymentId}`,
        { rejectionReason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Payment rejected");
      setSelectedPayment(null);
      setRejectionReason("");
      fetchPendingPayments();
      onPaymentVerified();
    } catch (error: any) {
      console.error("Error rejecting payment:", error);
      toast.error(error.response?.data?.message || "Failed to reject payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading pending payments...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-600 mb-2">No pending payments</p>
        <p className="text-sm text-gray-500">All payments have been verified</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {payments.map((payment) => (
        <div
          key={payment._id}
          className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all"
        >
          {/* Client Info */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {payment.userId.name}
              </h3>
              <p className="text-sm text-gray-600">{payment.userId.email}</p>
              {payment.userId.phone && (
                <p className="text-sm text-gray-600">{payment.userId.phone}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Submitted</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(payment.createdAt)}
              </p>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Project</p>
            <p className="font-semibold text-gray-900 mb-2">
              {payment.projectPaymentId.projectName}
            </p>
            <p className="text-xs text-gray-500">
              Total Project Amount: {formatCurrency(payment.projectPaymentId.totalProjectAmount)}
            </p>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amount</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(payment.amount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Method</p>
              <p className="font-semibold text-gray-900">{payment.paymentMethod}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">UTR Number</p>
              <p className="font-mono text-sm font-semibold text-gray-900">
                {payment.utrNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Payment Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(payment.paymentDate)}
              </p>
            </div>
          </div>

          {payment.notes && (
            <div className="bg-yellow-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600 mb-1">Client Notes</p>
              <p className="text-sm text-gray-900">{payment.notes}</p>
            </div>
          )}

          {/* Screenshot */}
          {payment.screenshotUrl && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Payment Screenshot</p>
              <div className="relative w-full max-w-md">
                <Image
                  src={payment.screenshotUrl}
                  alt="Payment Screenshot"
                  width={400}
                  height={400}
                  className="rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
                  onClick={() => window.open(payment.screenshotUrl, "_blank")}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedPayment?._id === payment._id ? (
            <div className="space-y-4 bg-white rounded-lg p-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Notes (Optional)
                </label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Add any notes about this payment verification..."
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason for rejection..."
                  rows={2}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleVerify(payment._id)}
                  disabled={processing}
                  className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-all"
                >
                  {processing ? "Processing..." : "✓ Verify Payment"}
                </button>
                <button
                  onClick={() => handleReject(payment._id)}
                  disabled={processing || !rejectionReason.trim()}
                  className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-all"
                >
                  ✕ Reject Payment
                </button>
                <button
                  onClick={() => {
                    setSelectedPayment(null);
                    setVerificationNotes("");
                    setRejectionReason("");
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setSelectedPayment(payment)}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Review Payment
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
