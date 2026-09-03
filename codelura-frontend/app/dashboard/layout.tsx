"use client";

import Sidebar from "./sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Local storage clear
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Extra safe
      localStorage.clear();
      sessionStorage.clear();

      // Redirect
      window.location.href = "/auth/login";

    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex">
      
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 bg-[#0b0d17] text-white min-h-screen">
        {children}
      </main>

    </div>
  );
}