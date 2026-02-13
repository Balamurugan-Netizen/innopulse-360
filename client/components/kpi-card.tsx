"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

type KpiCardProps = {
  label: string;
  value: number;
  suffix?: string;
};

export function KpiCard({ label, value, suffix = "" }: KpiCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {value.toFixed(1)}
          {suffix}
        </p>
      </Card>
    </motion.div>
  );
}

