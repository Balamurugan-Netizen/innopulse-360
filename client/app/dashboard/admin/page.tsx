"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { ImprovementChart } from "@/components/improvement-chart";
import { dashboardService } from "@/services/dashboard.service";

type AdminPayload = {
  stats: {
    totalUsers: number;
    pendingApprovals: number;
    registrationEfficiency: number;
    travelPunctuality: number;
    accommodationResolutionEfficiency: number;
    sessionPunctuality: number;
    juryFairnessScore: number;
    eppi: number;
    aiInnovationMaturityIndex: number;
  };
  riskAlerts: string[];
  heatmapData: { label: string; ipi: number }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("accessToken") || "";
        const payload = await dashboardService.getAdmin(token);
        setData(payload as AdminPayload);
      } catch (e) {
        setError((e as Error).message);
      }
    };
    void run();
  }, []);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!data) return <p>Loading admin command center...</p>;

  return (
    <main className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Users" value={data.stats.totalUsers} />
        <KpiCard label="Pending Approvals" value={data.stats.pendingApprovals} />
        <KpiCard label="EPPI" value={data.stats.eppi} />
        <KpiCard label="AI Maturity Index" value={data.stats.aiInnovationMaturityIndex} />
      </div>

      <Card id="eppi">
        <h2 className="text-lg font-semibold">Event Process Performance Index Trend</h2>
        <ImprovementChart data={data.heatmapData.map((x) => ({ date: x.label, ipi: x.ipi }))} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card id="alerts">
          <h3 className="text-lg font-semibold">Risk Alerts Panel</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {data.riskAlerts.length ? data.riskAlerts.map((alert) => <li key={alert}>{alert}</li>) : <li>No active alerts.</li>}
          </ul>
        </Card>

        <Card id="health">
          <h3 className="text-lg font-semibold">System Health Indicator</h3>
          <p className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            Operational
          </p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Reports export endpoints are available for PDF/CSV integration on backend extensions.</p>
        </Card>
      </div>
    </main>
  );
}

