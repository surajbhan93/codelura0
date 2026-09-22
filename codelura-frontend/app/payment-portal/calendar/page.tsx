"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

interface EMI {
  _id: string;
  emiNumber: number;
  emiAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: string;
  relatedPayments: Array<{
    paymentId: {
      _id: string;
      receiptNumber: string;
      amount: number;
    };
    amount: number;
    paidAt: string;
  }>;
}

interface Project {
  _id: string;
  projectName: string;
  totalProjectAmount: number;
  totalPaidAmount: number;
  remainingAmount: number;
}

export default function EMICalendarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [emis, setEmis] = useState<EMI[]>([]);
  const [calendar, setCalendar] = useState<Record<string, EMI[]>>({});

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/payment-login?redirect=/payment-portal/calendar");
        return;
      }

      // Get projects first
      const projectsRes = await axios.get(`${API_BASE_URL}/api/payments/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!projectsRes.data.projects || projectsRes.data.projects.length === 0) {
        toast.error("No active projects found");
        return;
      }

      const projectId = projectsRes.data.projects[0]._id;

      // Get project details
      const projectRes = await axios.get(
        `${API_BASE_URL}/api/payments/project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProject(projectRes.data.projectPayment);

      // Get EMI calendar
      const calendarRes = await axios.get(
        `${API_BASE_URL}/api/payments/emi-calendar/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEmis(calendarRes.data.emis || []);
      setCalendar(calendarRes.data.calendar || {});
    } catch (error: any) {
      console.error("Error fetching calendar:", error);
      toast.error(error.response?.data?.message || "Failed to load EMI calendar");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; icon: any; bgClass: string; textClass: string; borderClass: string }> = {
      PAID: { 
        label: "Paid", 
        icon: CheckCircle,
        bgClass: "bg-green-50", 
        textClass: "text-[#10B981]", 
        borderClass: "border-green-200" 
      },
      PARTIALLY_PAID: { 
        label: "Partial", 
        icon: Clock,
        bgClass: "bg-blue-50", 
        textClass: "text-[#2563EB]", 
        borderClass: "border-blue-200" 
      },
      OVERDUE: { 
        label: "Overdue", 
        icon: AlertCircle,
        bgClass: "bg-red-50", 
        textClass: "text-[#EF4444]", 
        borderClass: "border-red-200" 
      },
      PENDING: { 
        label: "Pending", 
        icon: Clock,
        bgClass: "bg-amber-50", 
        textClass: "text-[#F59E0B]", 
        borderClass: "border-amber-200" 
      },
      CANCELLED: { 
        label: "Cancelled", 
        icon: XCircle,
        bgClass: "bg-gray-50", 
        textClass: "text-[#64748B]", 
        borderClass: "border-[#E2E8F0]" 
      },
    };

    return configs[status] || configs.PENDING;
  };

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-white">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] rounded-full opacity-20 animate-pulse" />
            <Loader2 className="w-16 h-16 text-[#2563EB] animate-spin" />
          </div>
          <p className="text-sm font-semibold text-[#64748B]">Loading EMI calendar...</p>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div className="space-y-2">
            <Link
              href="/payment-portal"
              className="inline-flex items-center gap-2 text-[#2563EB] hover:text-[#1D4ED8] font-semibold text-sm transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Payment Portal
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight flex items-center gap-3">
              <Calendar className="w-8 h-8 text-[#2563EB]" />
              EMI Calendar
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] font-medium">
              View all your EMI due dates and payment history
            </p>
          </div>
        </div>

        {/* Project Summary Card */}
        {project && (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md">
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Project: {project.projectName}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-[#64748B] mb-1 font-semibold uppercase tracking-wide">Total Amount</p>
                <p className="text-xl font-bold text-[#0F172A]">{formatCurrency(project.totalProjectAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] mb-1 font-semibold uppercase tracking-wide">Paid</p>
                <p className="text-xl font-bold text-[#10B981]">{formatCurrency(project.totalPaidAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] mb-1 font-semibold uppercase tracking-wide">Remaining</p>
                <p className="text-xl font-bold text-[#F59E0B]">{formatCurrency(project.remainingAmount)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {Object.keys(calendar).length === 0 ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center shadow-md">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
              <Calendar className="w-8 h-8 text-[#64748B]" />
            </div>
            <p className="text-[#0F172A] font-semibold mb-1">No EMI Schedule Found</p>
            <p className="text-sm text-[#64748B]">Your EMI calendar will appear here once configured</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(calendar)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([monthKey, monthEmis]) => (
                <div key={monthKey} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md">
                  <h3 className="text-xl font-bold text-[#0F172A] mb-5 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#2563EB]" />
                    {getMonthName(monthKey)}
                  </h3>
                  
                  <div className="space-y-3">
                    {monthEmis.map((emi) => {
                      const statusConfig = getStatusConfig(emi.status);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <div
                          key={emi._id}
                          className="border border-[#E2E8F0] rounded-xl p-4 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-[#0F172A]">
                                EMI #{emi.emiNumber}
                              </span>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusConfig.label}
                              </span>
                            </div>
                            <span className="text-sm text-[#64748B] font-medium">
                              {formatDate(emi.dueDate)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#64748B] font-medium">Amount</span>
                            <span className="font-bold text-[#0F172A]">{formatCurrency(emi.emiAmount)}</span>
                          </div>

                          {emi.paidAmount > 0 && (
                            <>
                              <div className="flex items-center justify-between text-sm mt-2">
                                <span className="text-[#64748B] font-medium">Paid</span>
                                <span className="font-bold text-[#10B981]">{formatCurrency(emi.paidAmount)}</span>
                              </div>
                              
                              {emi.remainingAmount > 0 && (
                                <div className="flex items-center justify-between text-sm mt-2">
                                  <span className="text-[#64748B] font-medium">Remaining</span>
                                  <span className="font-bold text-[#F59E0B]">{formatCurrency(emi.remainingAmount)}</span>
                                </div>
                              )}

                              {/* Progress Bar */}
                              <div className="mt-3">
                                <div className="w-full bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] h-2 rounded-full transition-all"
                                    style={{
                                      width: `${(emi.paidAmount / emi.emiAmount) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
