"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authService } from "@/services/auth.service";

const roles = ["PARTICIPANT", "MENTOR", "JURY", "TRAVEL_COORDINATOR", "HOSPITALITY_MANAGER", "ADMIN"] as const;

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "PARTICIPANT",
    state: "",
    institution: "",
    domainOfInterest: "",
    teamName: "",
    governmentId: "",
    agreedToTerms: false
  });
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const passwordStrong = useMemo(() => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(form.password), [form.password]);

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!passwordStrong) {
      setError("Password must include uppercase, lowercase, number, special character and 8+ length");
      return;
    }

    try {
      await authService.register({ ...form, role: form.role as any });
      setOtpStep(true);
      setMessage("OTP sent to your email. Verify to activate account.");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await authService.verifyOtp(form.email, otp);
      setMessage("Registration verified successfully. You can now login.");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Complete onboarding for innovation event participants and stakeholders.</p>

        {!otpStep ? (
          <form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleRegister}>
            <input className="rounded-xl border p-3" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <input className="rounded-xl border p-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="rounded-xl border p-3" placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
            <select className="rounded-xl border p-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <input className="rounded-xl border p-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input className="rounded-xl border p-3" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            <input className="rounded-xl border p-3" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <input className="rounded-xl border p-3" placeholder="Institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
            <input className="rounded-xl border p-3" placeholder="Domain of Interest" value={form.domainOfInterest} onChange={(e) => setForm({ ...form, domainOfInterest: e.target.value })} />
            <input className="rounded-xl border p-3" placeholder="Team Name (if participant)" value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} />
            <input className="rounded-xl border p-3 md:col-span-2" placeholder="Government ID (optional)" value={form.governmentId} onChange={(e) => setForm({ ...form, governmentId: e.target.value })} />
            <label className="md:col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.agreedToTerms} onChange={(e) => setForm({ ...form, agreedToTerms: e.target.checked })} />
              I agree to terms and privacy policy
            </label>
            {error && <p className="md:col-span-2 text-sm text-red-500">{error}</p>}
            {message && <p className="md:col-span-2 text-sm text-green-600">{message}</p>}
            <Button className="md:col-span-2" type="submit">Create Account</Button>
          </form>
        ) : (
          <form className="mt-4 space-y-3" onSubmit={handleVerify}>
            <input className="w-full rounded-xl border p-3" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}
            <Button type="submit">Verify OTP</Button>
          </form>
        )}
      </Card>
    </main>
  );
}

