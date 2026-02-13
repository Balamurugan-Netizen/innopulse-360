import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { title: "Performance Intelligence", icon: Gauge, desc: "Real-time IPI, TISS, and EPPI insights for every stakeholder." },
  { title: "Secure Workflow", icon: ShieldCheck, desc: "JWT + refresh tokens, RBAC, OTP verification, and activity audits." },
  { title: "AI Maturity Tracking", icon: Sparkles, desc: "Innovation stage scoring from concept to scalable innovation." }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid items-center gap-8 py-10 lg:grid-cols-2">
        <div>
          <p className="mb-3 inline-flex rounded-full border border-cyan-300/60 bg-cyan-100/60 px-3 py-1 text-xs font-semibold uppercase text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300">
            AI-Driven Event Intelligence Platform
          </p>
          <h1 className="text-4xl font-black leading-tight text-slate-900 dark:text-white sm:text-5xl">
            InnoPulse 360
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">Measure Innovation. Monitor Process. Maximize Impact.</p>
          <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-300">
            Full-stack SaaS platform for hackathon and innovation event process monitoring with role-based analytics, KPI engines, and operational risk visibility.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/register">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Innovation Lifecycle</h2>
          <ol className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li>1. Concept ideation and registration quality assessment</li>
            <li>2. Validation using mentor and jury checkpoints</li>
            <li>3. Prototype execution tracked with milestone analytics</li>
            <li>4. Scalable innovation readiness with maturity indexing</li>
          </ol>
        </Card>
      </section>

      <section className="grid gap-4 py-10 md:grid-cols-3">
        {features.map(({ title, icon: Icon, desc }) => (
          <Card key={title}>
            <Icon className="h-5 w-5 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 py-10 md:grid-cols-3">
        {["Starter", "Growth", "Enterprise"].map((plan, i) => (
          <Card key={plan} className={i === 1 ? "border-cyan-400" : ""}>
            <h3 className="text-lg font-bold">{plan}</h3>
            <p className="mt-2 text-3xl font-black">${i === 0 ? 49 : i === 1 ? 149 : 499}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">per month</p>
          </Card>
        ))}
      </section>

      <footer className="border-t border-slate-200/50 py-6 text-sm text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
        Â© 2026 InnoPulse 360. All rights reserved.
      </footer>
    </main>
  );
}


