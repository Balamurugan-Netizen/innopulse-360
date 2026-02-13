import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const registerSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phoneNumber: z.string().min(8),
    password: z.string().regex(passwordRegex, "Password must meet complexity requirements"),
    confirmPassword: z.string(),
    role: z.enum(["PARTICIPANT", "MENTOR", "JURY", "TRAVEL_COORDINATOR", "HOSPITALITY_MANAGER", "ADMIN"]),
    state: z.string().min(2),
    institution: z.string().min(2),
    domainOfInterest: z.string().min(2),
    teamName: z.string().optional(),
    governmentId: z.string().optional(),
    agreedToTerms: z.boolean().refine((value) => value, "Agreement is required")
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6)
});

export const refreshSchema = z.object({
  refreshToken: z.string().optional()
});
