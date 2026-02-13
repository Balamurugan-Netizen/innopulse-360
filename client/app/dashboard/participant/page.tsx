"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { ImprovementChart } from "@/components/improvement-chart";
import { dashboardService } from "@/services/dashboard.service";

type ParticipantPayload = {
  kpis: { ipi: number; punctuality: number; attendance: number; mentorImprovement: number };
  improvementGraph: { date: string; ipi: number }[];
  mentorFeedback: { date: string; feedback: string; score: number }[];
  vivaBreakdown: { score: number; contribution: number; milestone: number };
};

export default function ParticipantDashboardPage() {
  const [data, setData] = useState<ParticipantPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("accessToken") || "";
        const payload = await dashboardService.getParticipant(token);
        setData(payload as ParticipantPayload);
      } catch (e) {
        setError((e as Error).message);
      }
    };
    void run();
  }, []);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!data) return <p>Loading dashboard...</p>;

  return (
    <main className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Individual Performance Index" value={data.kpis.ipi} />
        <KpiCard label="Attendance" value={data.kpis.attendance} suffix="%" />
        <KpiCard label="Punctuality" value={data.kpis.punctuality} suffix="%" />
        <KpiCard label="Mentor Improvement" value={data.kpis.mentorImprovement} suffix="%" />
      </div>

      <Card id="performance">
        <h2 className="text-lg font-semibold">Improvement Graph</h2>
        <ImprovementChart data={data.improvementGraph} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card id="mentor">
          <h3 className="text-lg font-semibold">Mentor Feedback</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {data.mentorFeedback.map((item, index) => (
              <li key={index} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <p>{item.feedback || "No comments"}</p>
                <p className="text-xs text-slate-500">Score: {item.score}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card id="viva">
          <h3 className="text-lg font-semibold">Viva Score Breakdown</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Viva Score: {data.vivaBreakdown.score}</li>
            <li>Contribution: {data.vivaBreakdown.contribution}%</li>
            <li>Milestone Completion: {data.vivaBreakdown.milestone}%</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}

