import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomUUID, createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "data.json");

export function hashPassword(pw) {
  return createHash("sha256").update(pw).digest("hex");
}

export function id(prefix) {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

function daysAgoLabel(n) {
  if (n === 0) return "Today";
  if (n === 1) return "Yesterday";
  return `${n} days ago`;
}

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function seed() {
  const demoUserId = "u_demo";

  const locations = [
    { id: "jakkur", name: "Jakkur Lake", lat: 13.0733, lng: 77.596, observationCount: 42, contributorCount: 18, lastObservationLabel: "Today" },
    { id: "ulsoor", name: "Ulsoor Lake", lat: 12.9815, lng: 77.6205, observationCount: 35, contributorCount: 22, lastObservationLabel: "2 days ago" },
    { id: "hebbal", name: "Hebbal Lake", lat: 13.0455, lng: 77.5973, observationCount: 28, contributorCount: 15, lastObservationLabel: "Today" },
    { id: "bellandur", name: "Bellandur Lake", lat: 12.9351, lng: 77.6786, observationCount: 31, contributorCount: 19, lastObservationLabel: "3 days ago" },
  ];

  const missions = [
    { id: "m1", emoji: "🌊", title: "Local Water Check", description: "Visit a nearby waterbody and complete today's observation.", reward: 50, type: "nearby", isToday: true, kind: "observation" },
    { id: "m2", emoji: "📸", title: "Evidence Collector", description: "Submit 3 useful environmental photos.", reward: 75, type: "nearby", kind: "instant" },
    { id: "m3", emoji: "🔄", title: "Local Guardian", description: "Return to a waterbody you've already monitored.", reward: 60, type: "nearby", kind: "instant" },
    { id: "m4", emoji: "🤝", title: "Community Helper", description: "Help review an observation that needs community validation.", reward: 40, type: "community", kind: "instant" },
    { id: "m5", emoji: "🔥", title: "Stewardship Streak", description: "Contribute once every week for 4 weeks.", reward: 150, type: "weekly", kind: "streak", progressCurrent: 2, progressTotal: 4 },
  ];

  const challenge = {
    id: "c1",
    title: "The 500 Observation Challenge",
    goal: 500,
    currentProgress: 327,
    participantCount: 184,
    locationCount: 12,
    milestoneUnlocked: false,
  };

  const rewards = [
    { id: "r1", emoji: "📜", title: "Impact Certificate", cost: 750, description: "Generate your verified contribution certificate.", status: "available" },
    { id: "r2", emoji: "🎓", title: "Learning Unlock", cost: 500, description: "Access an environmental learning resource.", status: "available" },
    { id: "r3", emoji: "🌱", title: "Community Action", cost: 500, description: "Direct your credits toward a community environmental initiative.", status: "available" },
    { id: "r4", emoji: "🧑‍🔬", title: "Expert Session", cost: 1500, description: "Community / researcher interaction.", status: "partner_locked", label: "Partner reward" },
    { id: "r5", emoji: "🌊", title: "Special Community Challenge", cost: 1000, description: "A new collective goal, unlocked at the next milestone.", status: "coming_soon", label: "Coming soon" },
  ];

  const achievementCatalog = [
    { id: "citizen_scientist", emoji: "🏅", title: "Citizen Scientist", description: "Submitted your first verified observation." },
    { id: "water_guardian", emoji: "🌊", title: "Water Guardian", description: "Reached 40 verified observations." },
    { id: "evidence_collector", emoji: "📸", title: "Evidence Collector", description: "Submitted 25+ pieces of evidence." },
    { id: "consistent_contributor", emoji: "🔥", title: "Consistent Contributor", description: "Kept a 4-week stewardship streak." },
    { id: "community_water_guardian", emoji: "🌊", title: "Community Water Guardian", description: "Part of the community that completed the 500 Observation Challenge." },
  ];

  const observations = [
    { id: "o1", userId: demoUserId, locationId: "jakkur", locationName: "Jakkur Lake", categories: ["water_clarity"], description: "Water looked clear near the eastern bank, a few birds around.", hasPhoto: true, status: "verified", creditsAwarded: 70, breakdown: { observation: 50, evidence: 20 }, createdAt: isoDaysAgo(0) },
    { id: "o2", userId: demoUserId, locationId: "ulsoor", locationName: "Ulsoor Lake", categories: ["algae"], description: "Noticed a patch of algae bloom near the boating dock.", hasPhoto: true, status: "verified", creditsAwarded: 90, breakdown: { observation: 50, evidence: 20, bonus: 20 }, createdAt: isoDaysAgo(4) },
    { id: "o3", userId: demoUserId, locationId: "hebbal", locationName: "Hebbal Lake", categories: ["water_level"], description: "Water level looked lower than last visit.", hasPhoto: false, status: "verified", creditsAwarded: 50, breakdown: { observation: 50 }, createdAt: isoDaysAgo(11) },
    { id: "o4", userId: demoUserId, locationId: "bellandur", locationName: "Bellandur Lake", categories: ["waste"], description: "Some litter collecting near the inflow point.", hasPhoto: true, status: "verified", creditsAwarded: 70, breakdown: { observation: 50, evidence: 20 }, createdAt: isoDaysAgo(18) },
    { id: "o5", userId: demoUserId, locationId: "jakkur", locationName: "Jakkur Lake", categories: ["wildlife"], description: "Spotted a group of herons on the northern shore.", hasPhoto: false, status: "verified", creditsAwarded: 50, breakdown: { observation: 50 }, createdAt: isoDaysAgo(25) },
  ];

  const activity = [
    { id: id("act"), userLabel: "Aisha", action: "contributed an observation", locationName: "Ulsoor Lake", createdAt: isoDaysAgo(0), hoursAgo: 2 },
    { id: id("act"), userLabel: "Rahul", action: "submitted new evidence", locationName: "Hebbal Lake", createdAt: isoDaysAgo(0), hoursAgo: 3 },
    { id: id("act"), userLabel: "Priya", action: "completed a Local Guardian mission", locationName: null, createdAt: isoDaysAgo(0), hoursAgo: 5 },
    { id: id("act"), userLabel: "Team Bengaluru", action: "reached 300 observations", locationName: null, createdAt: isoDaysAgo(0), hoursAgo: 6 },
  ];

  const users = {
    [demoUserId]: {
      id: demoUserId,
      name: "Sadiya Mehreen",
      email: "sadiya@aquaimpact.dev",
      passwordHash: hashPassword("demo1234"),
      impactCredits: 1250,
      streak: 4,
      verifiedObservations: 42,
      evidenceSubmissions: 31,
      challengesCompleted: 6,
      locationIds: ["jakkur", "ulsoor", "hebbal", "bellandur", "kaikondrahalli", "puttenahalli", "varthur", "madiwala"],
      completedMissionIds: [],
      unlockedRewardIds: [],
      achievementIds: ["citizen_scientist", "water_guardian", "evidence_collector", "consistent_contributor"],
      createdAt: isoDaysAgo(90),
      isDemo: true,
    },
  };

  return {
    users,
    locations,
    missions,
    challenge,
    rewards,
    achievementCatalog,
    observations,
    activity,
    lastSubmissionByLocation: {},
  };
}

let state;

export function load() {
  if (existsSync(DATA_PATH)) {
    try {
      state = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
      return state;
    } catch {
      // fall through to reseed on parse failure
    }
  }
  state = seed();
  save();
  return state;
}

export function save() {
  writeFileSync(DATA_PATH, JSON.stringify(state, null, 2));
}

export function getState() {
  return state;
}

export function resetDemo() {
  state = seed();
  save();
  return state;
}

load();
