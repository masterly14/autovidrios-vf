"use client";

import { usePathname } from "next/navigation";
import NavBarComponent from "@/components/navbar";
import Footer from "@/components/footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/administracion");

  return (
    <>
      {!isAdminRoute && <NavBarComponent />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

