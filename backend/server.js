import express from "express";
import cors from "cors";
import { getState, save, id, hashPassword, resetDemo } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ---------- helpers ----------

function publicUser(u) {
  const { passwordHash, ...rest } = u;
  return {
    ...rest,
    locationsCount: u.locationIds.length,
  };
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  const state = getState();
  const user = token ? state.users[token] : null;
  if (!user) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  req.user = user;
  next();
}

function missionsForUser(user) {
  const state = getState();
  return state.missions.map((m) => {
    const completed = user.completedMissionIds.includes(m.id);
    return {
      ...m,
      completed,
      progressCurrent: m.id === "m5" ? user.streak : m.progressCurrent,
    };
  });
}

function achievementsForUser(user) {
  const state = getState();
  return state.achievementCatalog.map((a) => ({
    ...a,
    unlocked: user.achievementIds.includes(a.id),
  }));
}

function timeAgoLabel(iso, hoursAgo) {
  if (hoursAgo != null) return `${hoursAgo}h ago`;
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

// ---------- auth ----------

app.post("/api/auth/signup", (req, res) => {
  const state = getState();
  const { name, email, password } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: "Full name is required." });
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "Enter a valid email address." });
  if (!password || password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });

  const existing = Object.values(state.users).find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(409).json({ error: "An account with that email already exists. Try signing in instead." });

  const userId = id("u");
  const user = {
    id: userId,
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    impactCredits: 0,
    streak: 0,
    verifiedObservations: 0,
    evidenceSubmissions: 0,
    challengesCompleted: 0,
    locationIds: [],
    completedMissionIds: [],
    unlockedRewardIds: [],
    achievementIds: [],
    createdAt: new Date().toISOString(),
    isDemo: false,
  };
  state.users[userId] = user;
  save();
  res.json({ token: userId, user: publicUser(user) });
});

app.post("/api/auth/login", (req, res) => {
  const state = getState();
  const { email, password } = req.body || {};
  const user = Object.values(state.users).find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password || "")) {
    return res.status(401).json({ error: "That email and password combination doesn't match our records." });
  }
  res.json({ token: user.id, user: publicUser(user) });
});

// Simulated OAuth / one-click demo access — signs the judge straight into the seeded demo account.
app.post("/api/auth/demo", (req, res) => {
  const state = getState();
  const user = state.users["u_demo"];
  res.json({ token: user.id, user: publicUser(user), simulated: true });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// ---------- missions ----------

app.get("/api/missions", requireAuth, (req, res) => {
  res.json({ missions: missionsForUser(req.user) });
});

app.post("/api/missions/:missionId/complete", requireAuth, (req, res) => {
  const state = getState();
  const user = req.user;
  const mission = state.missions.find((m) => m.id === req.params.missionId);
  if (!mission) return res.status(404).json({ error: "Mission not found." });
  if (mission.kind === "observation") {
    return res.status(400).json({ error: "Complete this mission from the Observe flow." });
  }
  if (user.completedMissionIds.includes(mission.id)) {
    return res.status(409).json({ error: "Mission already completed." });
  }

  user.completedMissionIds.push(mission.id);
  user.impactCredits += mission.reward;
  if (mission.kind === "streak" && user.streak < mission.progressTotal) {
    user.streak += 1;
  }
  save();
  res.json({ user: publicUser(user), creditsAwarded: mission.reward, missions: missionsForUser(user) });
});

// ---------- locations ----------

app.get("/api/locations", (req, res) => {
  const state = getState();
  res.json({ locations: state.locations });
});

// ---------- community / challenge ----------

app.get("/api/challenge", (req, res) => {
  const state = getState();
  res.json({ challenge: state.challenge });
});

app.get("/api/community/activity", (req, res) => {
  const state = getState();
  const items = [...state.activity]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 12)
    .map((a) => ({ ...a, timeLabel: timeAgoLabel(a.createdAt, a.hoursAgo) }));
  res.json({ activity: items });
});

// ---------- observations ----------

app.get("/api/observations", requireAuth, (req, res) => {
  const state = getState();
  const items = state.observations
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ observations: items });
});

app.post("/api/observations", requireAuth, (req, res) => {
  const state = getState();
  const user = req.user;
  const { locationId, categories, description, hasPhoto } = req.body || {};

  const location = state.locations.find((l) => l.id === locationId);
  if (!location) return res.status(400).json({ error: "Choose a location before submitting." });
  if (!categories || categories.length === 0) return res.status(400).json({ error: "Select at least one observation category." });

  // Basic duplicate / spam guard: same user + same location within 30 seconds.
  const key = `${user.id}:${locationId}`;
  const last = state.lastSubmissionByLocation[key];
  if (last && Date.now() - last < 30 * 1000) {
    return res.status(429).json({ error: "You've just submitted an observation here. Give it a little time before contributing again at this location." });
  }
  state.lastSubmissionByLocation[key] = Date.now();

  const breakdown = { observation: 50 };
  if (hasPhoto) breakdown.evidence = 20;
  const creditsAwarded = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const observation = {
    id: id("o"),
    userId: user.id,
    locationId,
    locationName: location.name,
    categories,
    description: description || "",
    hasPhoto: !!hasPhoto,
    status: "verified",
    creditsAwarded,
    breakdown,
    createdAt: new Date().toISOString(),
  };
  state.observations.unshift(observation);

  const challengeBefore = state.challenge.currentProgress;
  state.challenge.currentProgress = Math.min(state.challenge.goal, state.challenge.currentProgress + 1);
  const challengeAfter = state.challenge.currentProgress;
  if (state.challenge.currentProgress >= state.challenge.goal) {
    state.challenge.milestoneUnlocked = true;
  }

  user.impactCredits += creditsAwarded;
  user.verifiedObservations += 1;
  if (hasPhoto) user.evidenceSubmissions += 1;
  if (!user.locationIds.includes(locationId)) user.locationIds.push(locationId);
  if (!user.completedMissionIds.includes("m1")) user.completedMissionIds.push("m1");

  // Achievement checks
  const newAchievements = [];
  const maybeUnlock = (achId, condition) => {
    if (condition && !user.achievementIds.includes(achId)) {
      user.achievementIds.push(achId);
      newAchievements.push(achId);
    }
  };
  maybeUnlock("citizen_scientist", user.verifiedObservations >= 1);
  maybeUnlock("water_guardian", user.verifiedObservations >= 40);
  maybeUnlock("evidence_collector", user.evidenceSubmissions >= 25);
  maybeUnlock("consistent_contributor", user.streak >= 4);
  if (state.challenge.milestoneUnlocked) {
    maybeUnlock("community_water_guardian", true);
  }

  location.observationCount += 1;

  state.activity.unshift({
    id: id("act"),
    userLabel: user.name.split(" ")[0],
    action: "contributed an observation",
    locationName: location.name,
    createdAt: new Date().toISOString(),
    hoursAgo: 0,
    isCurrentUser: true,
  });

  save();

  res.json({
    observation,
    creditsAwarded,
    breakdown,
    user: publicUser(user),
    challenge: { before: challengeBefore, after: challengeAfter, goal: state.challenge.goal },
    newAchievements,
  });
});

// ---------- passport ----------

app.get("/api/passport", requireAuth, (req, res) => {
  const state = getState();
  const user = req.user;
  const timeline = state.observations
    .filter((o) => o.userId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)
    .map((o) => ({
      id: o.id,
      locationName: o.locationName,
      status: o.status,
      creditsAwarded: o.creditsAwarded,
      createdAt: o.createdAt,
      kind: o.hasPhoto ? "Evidence submitted" : "Observation verified",
    }));

  const nextReward = state.rewards
    .filter((r) => r.status === "available" && !user.unlockedRewardIds.includes(r.id))
    .sort((a, b) => a.cost - b.cost)[0];

  res.json({
    user: publicUser(user),
    achievements: achievementsForUser(user),
    timeline,
    nextReward: nextReward
      ? { ...nextReward, progressCredits: Math.min(user.impactCredits, nextReward.cost) }
      : null,
  });
});

// ---------- rewards ----------

app.get("/api/rewards", requireAuth, (req, res) => {
  const state = getState();
  const user = req.user;
  const rewards = state.rewards.map((r) => ({
    ...r,
    unlocked: user.unlockedRewardIds.includes(r.id),
    affordable: user.impactCredits >= r.cost,
  }));
  res.json({ rewards, impactCredits: user.impactCredits });
});

app.post("/api/rewards/:rewardId/unlock", requireAuth, (req, res) => {
  const state = getState();
  const user = req.user;
  const reward = state.rewards.find((r) => r.id === req.params.rewardId);
  if (!reward) return res.status(404).json({ error: "Reward not found." });
  if (reward.status !== "available") {
    return res.status(400).json({ error: "This reward isn't available yet — it's a future / partner reward for this prototype." });
  }
  if (user.unlockedRewardIds.includes(reward.id)) {
    return res.status(409).json({ error: "Already unlocked." });
  }
  if (user.impactCredits < reward.cost) {
    return res.status(400).json({ error: "Not enough Impact Credits yet." });
  }
  user.impactCredits -= reward.cost;
  user.unlockedRewardIds.push(reward.id);
  save();
  res.json({ user: publicUser(user), reward });
});

// ---------- demo control ----------

app.post("/api/demo/reset", (req, res) => {
  resetDemo();
  res.json({ ok: true });
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`AquaImpact API listening on http://localhost:${PORT}`);
});
