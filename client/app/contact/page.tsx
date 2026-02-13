import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Card>
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Email: support@innopulse360.com</p>
        <p className="text-slate-600 dark:text-slate-300">Sales: sales@innopulse360.com</p>
      </Card>
    </main>
  );
}

