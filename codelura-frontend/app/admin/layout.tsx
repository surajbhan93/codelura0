"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import api from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me");

      console.log("AUTH RESPONSE 👉", res.data);

      if (!res.data?.user || res.data.user.role !== "admin") {
        router.replace("/auth/login");
      }
    } catch (err) {
      console.error("AUTH ERROR 👉", err);
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-[#0a0c17] text-white">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Checking admin access…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0b0d17]">
      {/* AdminSidebar handles its own responsive layout internally
          (fixed mobile top bar + slide-in drawer on small screens,
          static sidebar on md+) — do NOT wrap it in `hidden md:flex`,
          that hides the mobile hamburger/menu too. */}
      <AdminSidebar />

      {/* No horizontal/vertical padding here — every admin page already
          manages its own full-bleed background + padding (see app/admin/page.tsx,
          app/admin/jobs/page.tsx, etc). We only add top clearance on mobile
          so content doesn't start underneath the fixed hamburger bar. */}
      <main className="flex-1 w-full min-w-0 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
