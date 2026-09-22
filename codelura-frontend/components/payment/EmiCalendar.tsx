"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatCurrency, formatDate, isOverdue, getDaysFromNow } from "@/lib/utils";

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
      receiptNumber?: string;
      amount: number;
    };
    amount: number;
    paidAt: string;
  }>;
}

interface CalendarData {
  [monthKey: string]: EMI[];
}

export default function EmiCalendar({ projectId }: { projectId: string }) {
  const [emis, setEmis] = useState<EMI[]>([]);
  const [calendar, setCalendar] = useState<CalendarData>({});
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    fetchEmiCalendar();
  }, [projectId]);

  const fetchEmiCalendar = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/payments/emi-calendar/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEmis(response.data.emis);
      setCalendar(response.data.calendar);

      // Set current month as default
      const currentMonth = new Date().toISOString().substring(0, 7);
      setSelectedMonth(currentMonth);
    } catch (error: any) {
      console.error("Error fetching EMI calendar:", error);
      toast.error("Failed to load EMI calendar");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (emi: EMI) => {
    switch (emi.status) {
      case "PAID":
        return (
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
            ✓
          </div>
        );
      case "PARTIALLY_PAID":
        return (
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
            ◐
          </div>
        );
      case "OVERDUE":
        return (
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
            ⚠
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
            ○
          </div>
        );
    }
  };

  const getStatusColor = (emi: EMI) => {
    switch (emi.status) {
      case "PAID":
        return "bg-green-50 border-green-200";
      case "PARTIALLY_PAID":
        return "bg-yellow-50 border-yellow-200";
      case "OVERDUE":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getDueDateBadge = (dueDate: string, status: string) => {
    if (status === "PAID") {
      return <span className="text-xs text-green-600 font-semibold">✓ Paid</span>;
    }

    const daysRemaining = getDaysFromNow(dueDate);

    if (daysRemaining < 0) {
      return (
        <span className="text-xs text-red-600 font-semibold">
          {Math.abs(daysRemaining)} days overdue
        </span>
      );
    } else if (daysRemaining === 0) {
      return <span className="text-xs text-orange-600 font-semibold">Due today</span>;
    } else if (daysRemaining <= 7) {
      return (
        <span className="text-xs text-orange-600 font-semibold">
          Due in {daysRemaining} days
        </span>
      );
    } else {
      return (
        <span className="text-xs text-gray-600">Due in {daysRemaining} days</span>
      );
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatMonthYear = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (emis.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">EMI Calendar</h2>
        <div className="text-center py-12">
          <p className="text-gray-600">No EMI schedule available</p>
        </div>
      </div>
    );
  }

  const sortedMonths = Object.keys(calendar).sort();
  const currentMonthEmis = selectedMonth && calendar[selectedMonth] ? calendar[selectedMonth] : [];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">EMI Calendar</h2>

      {/* Month Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Month
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
        >
          {sortedMonths.map((monthKey) => (
            <option key={monthKey} value={monthKey}>
              {formatMonthYear(monthKey)} ({calendar[monthKey].length} EMI
              {calendar[monthKey].length > 1 ? "s" : ""})
            </option>
          ))}
        </select>
      </div>

      {/* EMI Cards for Selected Month */}
      <div className="space-y-4">
        {currentMonthEmis.map((emi) => (
          <div
            key={emi._id}
            className={`border-2 rounded-xl p-4 ${getStatusColor(emi)} transition-all`}
          >
            <div className="flex items-start gap-4">
              {/* Status Icon */}
              <div className="flex-shrink-0">{getStatusIcon(emi)}</div>

              {/* EMI Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    EMI #{emi.emiNumber}
                  </h3>
                  {getDueDateBadge(emi.dueDate, emi.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Due Amount</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(emi.emiAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Paid Amount</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(emi.paidAmount)}
                    </p>
                  </div>
                </div>

                {emi.remainingAmount > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Remaining</p>
                    <p className="text-sm font-semibold text-orange-600">
                      {formatCurrency(emi.remainingAmount)}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Due Date: {formatDate(emi.dueDate)}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      emi.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : emi.status === "PARTIALLY_PAID"
                        ? "bg-yellow-100 text-yellow-800"
                        : emi.status === "OVERDUE"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {emi.status.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Related Payments */}
                {emi.relatedPayments && emi.relatedPayments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">Payment History</p>
                    <div className="space-y-1">
                      {emi.relatedPayments.map((payment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-gray-600">
                            {formatDate(payment.paidAt)}
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(payment.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Total EMIs</p>
            <p className="text-2xl font-bold text-gray-900">{emis.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Paid</p>
            <p className="text-2xl font-bold text-green-600">
              {emis.filter((e) => e.status === "PAID").length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-gray-600">
              {emis.filter((e) => e.status === "PENDING").length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Overdue</p>
            <p className="text-2xl font-bold text-red-600">
              {emis.filter((e) => e.status === "OVERDUE").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
