"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { FileText, Calendar } from "lucide-react";

interface ProjectInfoProps {
  project: {
    _id: string;
    projectName: string;
    projectDescription?: string;
    totalProjectAmount: number;
    totalPaidAmount: number;
    remainingAmount: number;
    emiAmount: number;
  };
  nextEmi: {
    emiNumber: number;
    emiAmount: number;
    dueDate: string;
  } | null;
  emis: Array<{
    _id: string;
    emiNumber: number;
    emiAmount: number;
    paidAmount: number;
    status: string;
    dueDate: string;
  }>;
}

export default function ProjectInfo({ project, nextEmi, emis }: ProjectInfoProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return "✓";
      case "PARTIALLY_PAID":
        return "◐";
      case "OVERDUE":
        return "!";
      default:
        return "○";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-[#10B981]";
      case "PARTIALLY_PAID":
        return "text-[#F59E0B]";
      case "OVERDUE":
        return "text-[#EF4444]";
      default:
        return "text-[#64748B]";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-50 border-green-200";
      case "PARTIALLY_PAID":
        return "bg-amber-50 border-amber-200";
      case "OVERDUE":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-[#E2E8F0]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Details Card */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md">
        <h2 className="text-lg font-bold text-[#0F172A] mb-5">Project Details</h2>
        
        <div className="space-y-5">
          <div>
            <p className="text-xs text-[#64748B] mb-1.5 font-semibold uppercase tracking-wide">Project Name</p>
            <p className="text-base font-bold text-[#0F172A]">{project.projectName}</p>
          </div>

          {project.projectDescription && (
            <div>
              <p className="text-xs text-[#64748B] mb-1.5 font-semibold uppercase tracking-wide">Description</p>
              <p className="text-sm text-[#64748B] leading-relaxed">{project.projectDescription}</p>
            </div>
          )}

          <div className="border-t border-[#E2E8F0] pt-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-[#64748B] font-medium">Total Amount</span>
              <span className="text-lg font-bold text-[#0F172A]">
                {formatCurrency(project.totalProjectAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-[#64748B] font-medium">Paid Amount</span>
              <span className="text-lg font-bold text-[#10B981]">
                {formatCurrency(project.totalPaidAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#64748B] font-medium">Remaining</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {formatCurrency(project.remainingAmount)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#E2E8F0] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${(project.totalPaidAmount / project.totalProjectAmount) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-[#64748B] mt-2.5 text-right font-medium">
              {((project.totalPaidAmount / project.totalProjectAmount) * 100).toFixed(1)}% Complete
            </p>
          </div>

          {nextEmi && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
              <p className="text-xs text-[#64748B] mb-1.5 font-semibold">Next EMI Due</p>
              <p className="text-2xl font-bold text-[#0F172A]">
                {formatCurrency(nextEmi.emiAmount)}
              </p>
              <p className="text-xs text-[#64748B] mt-2 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Due: {formatDate(nextEmi.dueDate)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Link
              href={`/emi-agreement/${project._id}`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl transition-all duration-200 shadow-md shadow-blue-500/20 font-semibold text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>View EMI Agreement</span>
            </Link>
            <Link
              href={`/payment-portal/calendar`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white hover:bg-gray-50 border border-[#E2E8F0] text-[#0F172A] rounded-xl transition-all duration-200 font-semibold text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>EMI Calendar</span>
            </Link>
          </div>
          
          <p className="text-xs text-center text-[#64748B] font-medium">
            Professional invoice with MSME & RBI compliance
          </p>
        </div>
      </div>

      {/* EMI Timeline */}
      {emis.length > 0 && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#0F172A] mb-5">EMI Timeline</h3>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E2E8F0]" />

            <div className="space-y-4">
              {emis.map((emi, index) => (
                <div key={emi._id} className="relative flex items-start">
                  {/* Status Icon */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white ${
                      emi.status === "PAID"
                        ? "border-[#10B981]"
                        : emi.status === "PARTIALLY_PAID"
                        ? "border-[#F59E0B]"
                        : emi.status === "OVERDUE"
                        ? "border-[#EF4444]"
                        : "border-[#E2E8F0]"
                    }`}
                  >
                    <span className={`text-xs font-bold ${getStatusColor(emi.status)}`}>
                      {getStatusIcon(emi.status)}
                    </span>
                  </div>

                  {/* EMI Details */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#0F172A] text-sm">
                        EMI #{emi.emiNumber}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border ${getStatusBg(emi.status)} ${getStatusColor(emi.status)}`}>
                        {emi.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#0F172A] font-semibold">
                        {formatCurrency(emi.paidAmount)} / {formatCurrency(emi.emiAmount)}
                      </span>
                      <span className="text-[#64748B] font-medium">
                        {formatDate(emi.dueDate)}
                      </span>
                    </div>
                    {/* Progress bar for partial payments */}
                    {emi.status === "PARTIALLY_PAID" && (
                      <div className="mt-2">
                        <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#F59E0B] h-1.5 rounded-full transition-all"
                            style={{
                              width: `${(emi.paidAmount / emi.emiAmount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
