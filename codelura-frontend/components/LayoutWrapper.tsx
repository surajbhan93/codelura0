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

  const isServicePage = pathname.startsWith("/services");
  const isCareerPage = pathname.startsWith("/career");
  const isLocationPage = pathname.startsWith("/locations");

  return (
    <>
      {/* Navbar - shows on all pages including location pages */}
      {isServicePage ? (
        <ServiceNavbar />
      ) : isCareerPage ? (
        <CareerNavbar />
      ) : (
        <Navbar />
      )}

      {children}

      {/* Footer - hidden only on location pages */}
      {!isLocationPage && <Footer />}
    </>
  );
}