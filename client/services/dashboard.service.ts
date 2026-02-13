import { apiFetch } from "./api";

export const dashboardService = {
  getParticipant: (token: string) =>
    apiFetch("/dashboard/participant", {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getAdmin: (token: string) =>
    apiFetch("/dashboard/admin", {
      headers: { Authorization: `Bearer ${token}` }
    })
};

