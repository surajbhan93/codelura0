"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import PendingPayments from "@/components/admin/payments/PendingPayments";
import AllProjects from "@/components/admin/payments/AllProjects";
import PaymentSettings from "@/components/admin/payments/PaymentSettings";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pending" | "projects" | "settings">("pending");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingCount: 0,
    totalProjects: 0,
    activeProjects: 0,
  });

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login?redirect=/admin/payments");
        return;
      }

      // Verify admin role
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.user.role !== "admin") {
        toast.error("Access denied. Admin only.");
        router.push("/");
        return;
      }
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/login?redirect=/admin/payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const [pendingRes, projectsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/payments/admin/pending?limit=1`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/payments/admin/all-projects?limit=1`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats({
        pendingCount: pendingRes.data.total || 0,
        totalProjects: projectsRes.data.total || 0,
        activeProjects: projectsRes.data.total || 0, // Can be refined with status filter
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handlePaymentVerified = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600">Verify payments, manage projects, and configure settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Verification</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalProjects}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Projects</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
                  activeTab === "pending"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                Pending Verification
                {stats.pendingCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
                    {stats.pendingCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
                  activeTab === "projects"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
                  activeTab === "settings"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                Payment Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "pending" && <PendingPayments onPaymentVerified={handlePaymentVerified} />}
            {activeTab === "projects" && <AllProjects />}
            {activeTab === "settings" && <PaymentSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
