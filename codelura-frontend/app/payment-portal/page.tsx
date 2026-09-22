"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import PaymentForm from "@/components/payment/PaymentForm";
import ProjectInfo from "@/components/payment/ProjectInfo";
import PaymentHistory from "@/components/payment/PaymentHistory";
import {
  CreditCard,
  ShieldCheck,
  ArrowRight,
  X,
  Building2,
  Calendar,
  Loader2,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

interface ProjectPayment {
  _id: string;
  projectName: string;
  projectDescription: string;
  totalProjectAmount: number;
  totalPaidAmount: number;
  remainingAmount: number;
  emiAmount: number;
  status: string;
}

interface EMI {
  _id: string;
  emiNumber: number;
  emiAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: string;
}

interface PaymentSettings {
  upiNumber: string;
  qrCodeUrl: string | null;
}

export default function PaymentPortalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectPayment | null>(null);
  const [emis, setEmis] = useState<EMI[]>([]);
  const [nextEmi, setNextEmi] = useState<EMI | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/payment-login?redirect=/payment-portal");
        return;
      }

      const projectsRes = await axios.get(`${API_BASE_URL}/api/payments/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!projectsRes.data.projects || projectsRes.data.projects.length === 0) {
        toast.error("No active project payment accounts found");
        return;
      }

      const projectId = projectsRes.data.projects[0]._id;

      const projectRes = await axios.get(
        `${API_BASE_URL}/api/payments/project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProject(projectRes.data.projectPayment);
      setEmis(projectRes.data.emis || []);
      setNextEmi(projectRes.data.nextEmi || null);

      const settingsRes = await axios.get(`${API_BASE_URL}/api/payment-settings`);
      setPaymentSettings(settingsRes.data.settings);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "Failed to load payment portal data");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    fetchData();
    toast.success("Payment submitted successfully! Admin verification in progress.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-white">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] rounded-full opacity-20 animate-pulse" />
            <Loader2 className="w-16 h-16 text-[#2563EB] animate-spin" />
          </div>
          <p className="text-sm font-semibold text-[#64748B]">Loading secure payment portal...</p>
        </div>
      </div>
    );
  }

  if (!project || !paymentSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-white p-4">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center max-w-md shadow-lg space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
            <Building2 className="h-8 w-8 text-[#2563EB]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">No Active Projects</h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            There are currently no active payment accounts associated with your profile.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all duration-200 shadow-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure Payment Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
              Pay <span className="text-[#2563EB]">Codelura</span>
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] font-medium">
              Manage your project payments and EMI schedule
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/payment-portal/calendar`}
              className="px-5 py-2.5 bg-white hover:bg-gray-50 border border-[#E2E8F0] text-[#0F172A] font-semibold text-sm rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm"
            >
              <Calendar className="h-4 w-4" />
              <span>EMI Calendar</span>
            </Link>
            <button
              onClick={() => setShowPaymentForm(true)}
              className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <CreditCard className="h-4 w-4" />
              <span>Make Payment</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Project Info & EMI Timeline */}
          <div className="lg:col-span-1 space-y-6">
            <ProjectInfo project={project} nextEmi={nextEmi} emis={emis} />
          </div>

          {/* Right Column: Make Payment Form OR Payment History */}
          <div className="lg:col-span-2 space-y-6">
            {showPaymentForm ? (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-lg space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#0F172A]">Make a Payment</h2>
                      <p className="text-sm text-[#64748B]">
                        Complete payment via UPI or QR code
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className="text-[#64748B] hover:text-[#0F172A] p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <PaymentForm
                  projectId={project._id}
                  maxAmount={project.remainingAmount}
                  emiAmount={project.emiAmount}
                  paymentSettings={paymentSettings}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            ) : (
              <>
                {/* Payment CTA Card */}
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 sm:p-8 shadow-md relative overflow-hidden">
                  {/* Subtle glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-md">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-blue-200 text-[#2563EB] text-xs font-semibold">
                        ⚡ Quick Payment
                      </div>
                      <h2 className="text-2xl font-bold text-[#0F172A]">
                        Ready to Make a Payment?
                      </h2>
                      <p className="text-sm text-[#64748B] leading-relaxed">
                        Pay via UPI or QR code, submit transaction details, and track your payment status in real-time.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowPaymentForm(true)}
                      className="px-7 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 text-sm shadow-lg shadow-blue-500/25 group"
                    >
                      <span>Pay Now</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>

                {/* Payment History Component */}
                <PaymentHistory projectId={project._id} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
