import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Card>
        <h1 className="text-3xl font-bold">About InnoPulse 360</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          InnoPulse 360 is an AI-driven process performance platform designed for hackathons and innovation ecosystems. It unifies participant progress, mentor impact, jury fairness, travel operations, and event health in one secure SaaS system.
        </p>
      </Card>
    </main>
  );
}

