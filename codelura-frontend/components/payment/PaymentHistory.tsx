"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Receipt, Clock, CheckCircle, XCircle } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

interface Payment {
  _id: string;
  amount: number;
  paymentMethod: string;
  utrNumber: string;
  paymentDate: string;
  status: string;
  receiptNumber?: string;
  relatedEmis: Array<{ emiNumber: number; emiAmount: number }>;
  createdAt: string;
}

export default function PaymentHistory({ projectId }: { projectId: string }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [projectId]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/payments/history?projectPaymentId=${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayments(response.data.payments);
    } catch (error: any) {
      console.error("Error fetching payment history:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; icon: any; bgClass: string; textClass: string; borderClass: string }> = {
      PAID: { 
        label: "Verified", 
        icon: CheckCircle,
        bgClass: "bg-green-50", 
        textClass: "text-[#10B981]", 
        borderClass: "border-green-200" 
      },
      VERIFICATION_PENDING: { 
        label: "Pending", 
        icon: Clock,
        bgClass: "bg-amber-50", 
        textClass: "text-[#F59E0B]", 
        borderClass: "border-amber-200" 
      },
      REJECTED: { 
        label: "Rejected", 
        icon: XCircle,
        bgClass: "bg-red-50", 
        textClass: "text-[#EF4444]", 
        borderClass: "border-red-200" 
      },
      CANCELLED: { 
        label: "Cancelled", 
        icon: XCircle,
        bgClass: "bg-gray-50", 
        textClass: "text-[#64748B]", 
        borderClass: "border-[#E2E8F0]" 
      },
      PARTIALLY_PAID: { 
        label: "Partial", 
        icon: Clock,
        bgClass: "bg-blue-50", 
        textClass: "text-[#2563EB]", 
        borderClass: "border-blue-200" 
      },
    };

    return configs[status] || { label: status, icon: Clock, bgClass: "bg-gray-50", textClass: "text-[#64748B]", borderClass: "border-[#E2E8F0]" };
  };

  const viewReceipt = (paymentId: string) => {
    window.open(`/payment-receipt/${paymentId}`, "_blank");
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-50 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-md">
      <h2 className="text-xl font-bold text-[#0F172A] mb-6">Payment History</h2>

      {payments.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
            <Receipt className="w-8 h-8 text-[#64748B]" />
          </div>
          <p className="text-[#0F172A] font-semibold mb-1">No payments yet</p>
          <p className="text-sm text-[#64748B]">Your payment history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={payment._id}
                className="border border-[#E2E8F0] rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-[#0F172A]">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-[#64748B] font-medium">
                      Paid on {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1.5 bg-gray-50 text-[#0F172A] text-xs font-semibold rounded-lg border border-[#E2E8F0]">
                      {payment.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-[#E2E8F0]">
                  <div>
                    <p className="text-xs text-[#64748B] mb-1.5 font-semibold uppercase tracking-wide">UTR Number</p>
                    <p className="text-sm font-mono font-bold text-[#0F172A]">
                      {payment.utrNumber}
                    </p>
                  </div>
                  {payment.receiptNumber && (
                    <div>
                      <p className="text-xs text-[#64748B] mb-1.5 font-semibold uppercase tracking-wide">Receipt Number</p>
                      <p className="text-sm font-mono font-bold text-[#0F172A]">
                        {payment.receiptNumber}
                      </p>
                    </div>
                  )}
                </div>

                {payment.relatedEmis && payment.relatedEmis.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                    <p className="text-xs text-[#64748B] mb-2.5 font-semibold uppercase tracking-wide">Allocated to EMIs</p>
                    <div className="flex flex-wrap gap-2">
                      {payment.relatedEmis.map((emi, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-lg border border-blue-200"
                        >
                          EMI #{emi.emiNumber}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {payment.status === "PAID" && payment.receiptNumber && (
                  <button
                    onClick={() => viewReceipt(payment._id)}
                    className="mt-4 w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-semibold rounded-xl transition-all duration-200 text-sm border border-blue-200"
                  >
                    View Receipt
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
