import { apiFetch } from "./api";

export type RegisterPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: "PARTICIPANT" | "MENTOR" | "JURY" | "TRAVEL_COORDINATOR" | "HOSPITALITY_MANAGER" | "ADMIN";
  state: string;
  institution: string;
  domainOfInterest: string;
  teamName?: string;
  governmentId?: string;
  agreedToTerms: boolean;
};

export const authService = {
  register: (payload: RegisterPayload) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  verifyOtp: (email: string, otp: string) => apiFetch("/auth/verify-otp", { method: "POST", body: JSON.stringify({ email, otp }) }),
  login: (email: string, password: string) => apiFetch<{ accessToken: string; user: { role: string } }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })
};

