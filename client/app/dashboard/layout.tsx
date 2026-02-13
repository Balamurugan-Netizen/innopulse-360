"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = pathname.includes("/dashboard/admin") ? "ADMIN" : "PARTICIPANT";

  return (
    <div>
      <TopBar />
      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-5">
        <Sidebar role={role} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

