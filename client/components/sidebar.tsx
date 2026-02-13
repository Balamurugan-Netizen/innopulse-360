"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarProps = {
  role: "PARTICIPANT" | "ADMIN";
};

const participantMenu = [
  ["Overview", "/dashboard/participant"],
  ["My Team", "/dashboard/participant#my-team"],
  ["Travel & Accommodation", "/dashboard/participant#travel"],
  ["Mentor Sessions", "/dashboard/participant#mentor"],
  ["Viva Analytics", "/dashboard/participant#viva"],
  ["Performance Index", "/dashboard/participant#performance"],
  ["Notifications", "/dashboard/participant#notifications"],
  ["Profile Settings", "/dashboard/participant#settings"]
] as const;

const adminMenu = [
  ["Event Overview", "/dashboard/admin"],
  ["User Management", "/dashboard/admin#users"],
  ["Registration Analytics", "/dashboard/admin#registration"],
  ["Travel Monitoring", "/dashboard/admin#travel"],
  ["Accommodation Monitoring", "/dashboard/admin#accommodation"],
  ["Mentor Effectiveness", "/dashboard/admin#mentor"],
  ["Jury Scoring Analysis", "/dashboard/admin#jury"],
  ["EPPI", "/dashboard/admin#eppi"],
  ["AI Maturity Index", "/dashboard/admin#maturity"],
  ["Risk Alerts", "/dashboard/admin#alerts"],
  ["System Health", "/dashboard/admin#health"],
  ["Reports Export", "/dashboard/admin#reports"]
] as const;

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const menu = role === "ADMIN" ? adminMenu : participantMenu;

  return (
    <aside className="hidden w-72 flex-col gap-2 rounded-2xl border border-slate-200/50 bg-white/60 p-3 shadow-soft backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/50 lg:flex">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{role} Menu</p>
      {menu.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
            pathname === href && "bg-blue-600 text-white hover:bg-blue-600 dark:text-white"
          )}
        >
          {label}
        </Link>
      ))}
    </aside>
  );
}

