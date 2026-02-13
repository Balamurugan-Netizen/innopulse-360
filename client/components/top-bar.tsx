"use client";

import { Bell } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/50 bg-white/60 px-4 py-3 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Measure Innovation. Monitor Process. Maximize Impact.</p>
        <div className="flex items-center gap-3">
          <button className="relative rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-500" />
          </button>
          <ThemeToggle />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">Profile</DropdownMenu.Trigger>
            <DropdownMenu.Content className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <DropdownMenu.Item className="cursor-pointer rounded-lg px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Settings</DropdownMenu.Item>
              <DropdownMenu.Item className="cursor-pointer rounded-lg px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Logout</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}

