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
      <div className="h-screen flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0b0d17]">
      <aside className="hidden md:flex w-64">
        <AdminSidebar />
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
