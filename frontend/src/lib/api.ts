import type {
  User,
  Mission,
  Challenge,
  Location,
  ActivityItem,
  Observation,
  Achievement,
  Reward,
  PassportTimelineItem,
} from "../types";

const BASE = import.meta.env.VITE_API_URL || "/api";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  return localStorage.getItem("aquaimpact_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error || "Something went wrong. Please try again.", res.status);
  }
  return data as T;
}

export const api = {
  signup: (name: string, email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  demoLogin: () => request<{ token: string; user: User; simulated: boolean }>("/auth/demo", { method: "POST" }),
  me: () => request<{ user: User }>("/me"),

  missions: () => request<{ missions: Mission[] }>("/missions"),
  completeMission: (id: string) =>
    request<{ user: User; creditsAwarded: number; missions: Mission[] }>(`/missions/${id}/complete`, {
      method: "POST",
    }),

  locations: () => request<{ locations: Location[] }>("/locations"),
  challenge: () => request<{ challenge: Challenge }>("/challenge"),
  communityActivity: () => request<{ activity: ActivityItem[] }>("/community/activity"),

  observations: () => request<{ observations: Observation[] }>("/observations"),
  submitObservation: (payload: {
    locationId: string;
    categories: string[];
    description: string;
    hasPhoto: boolean;
  }) =>
    request<{
      observation: Observation;
      creditsAwarded: number;
      breakdown: Record<string, number>;
      user: User;
      challenge: { before: number; after: number; goal: number };
      newAchievements: string[];
    }>("/observations", { method: "POST", body: JSON.stringify(payload) }),

  passport: () =>
    request<{
      user: User;
      achievements: Achievement[];
      timeline: PassportTimelineItem[];
      nextReward: (Reward & { progressCredits: number }) | null;
    }>("/passport"),

  rewards: () => request<{ rewards: Reward[]; impactCredits: number }>("/rewards"),
  unlockReward: (id: string) =>
    request<{ user: User; reward: Reward }>(`/rewards/${id}/unlock`, { method: "POST" }),

  resetDemo: () => request<{ ok: boolean }>("/demo/reset", { method: "POST" }),

  setToken(token: string) {
    localStorage.setItem("aquaimpact_token", token);
  },
  clearToken() {
    localStorage.removeItem("aquaimpact_token");
  },
  getToken,
};

export { ApiError };
