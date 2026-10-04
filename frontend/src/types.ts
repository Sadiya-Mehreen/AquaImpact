export interface User {
  id: string;
  name: string;
  email: string;
  impactCredits: number;
  streak: number;
  verifiedObservations: number;
  evidenceSubmissions: number;
  challengesCompleted: number;
  locationIds: string[];
  locationsCount: number;
  completedMissionIds: string[];
  unlockedRewardIds: string[];
  achievementIds: string[];
  createdAt: string;
  isDemo: boolean;
}

export interface Mission {
  id: string;
  emoji: string;
  title: string;
  description: string;
  reward: number;
  type: "nearby" | "community" | "weekly" | "challenges";
  isToday?: boolean;
  kind: "observation" | "instant" | "streak";
  completed: boolean;
  progressCurrent?: number;
  progressTotal?: number;
}

export interface Challenge {
  id: string;
  title: string;
  goal: number;
  currentProgress: number;
  participantCount: number;
  locationCount: number;
  milestoneUnlocked: boolean;
}

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  observationCount: number;
  contributorCount: number;
  lastObservationLabel: string;
}

export interface ActivityItem {
  id: string;
  userLabel: string;
  action: string;
  locationName: string | null;
  timeLabel: string;
  isCurrentUser?: boolean;
}

export interface Observation {
  id: string;
  userId: string;
  locationId: string;
  locationName: string;
  categories: string[];
  description: string;
  hasPhoto: boolean;
  status: string;
  creditsAwarded: number;
  breakdown: Record<string, number>;
  createdAt: string;
}

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface Reward {
  id: string;
  emoji: string;
  title: string;
  cost: number;
  description: string;
  status: "available" | "partner_locked" | "coming_soon";
  label?: string;
  unlocked?: boolean;
  affordable?: boolean;
}

export interface PassportTimelineItem {
  id: string;
  locationName: string;
  status: string;
  creditsAwarded: number;
  createdAt: string;
  kind: string;
}
