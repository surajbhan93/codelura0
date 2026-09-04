"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import ServiceNavbar from "@/components/services/Navbar";
import CareerNavbar from "@/components/career/navbar";
import Footer from "@/components/shared/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/auth") ||
    pathname === "/login" ||
    pathname === "/signup";
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAdminPage = pathname.startsWith("/admin");
  const isServicePage = pathname.startsWith("/services");
  const isCareerPage = pathname.startsWith("/career");
  const isLocationPage = pathname.startsWith("/locations");

  // On Auth, Dashboard, and Admin pages, do not render the generic marketing Navbar & Footer
  if (isAuthPage || isDashboardPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Navbar - shows on all standard marketing & career pages */}
      {isServicePage ? (
        <ServiceNavbar />
      ) : isCareerPage ? (
        <CareerNavbar />
      ) : (
        <Navbar />
      )}

      {children}

      {/* Footer - hidden on location pages */}
      {!isLocationPage && <Footer />}
    </>
  );
}