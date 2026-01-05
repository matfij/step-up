export class ApiError extends Error {
  constructor(message: string, public key: string, public field?: string) {
    super(message);
  }
}

export interface User {
  id: string;
  email: string;
  username: string;
  apiToken: string;
}

export interface Activity {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startTime: number;
  duration: number;
  distance: number;
  averageSpeed: number;
  topSpeed: number;
  routeLatitudes: number[];
  routeLongitudes: number[];
}

export interface Progress {
  id: string;
  userId: string;
  level: number;
  experience: number;
  totalActivities: number;
  totalDuration: number;
  totalDistance: number;
  currentStreak: number;
  bestStreak: number;
}

export interface Achievements {
  id: string;
  userId: string;
  totalDistance: AchievementProgress;
  totalDuration: AchievementProgress;
  totalActivities: AchievementProgress;
  maxCurrentStreak: AchievementProgress;
  maxActivitySpeed: AchievementProgress;
  maxActivityDistance: AchievementProgress;
  greenhorn: AchievementProgress;
  marathoner: AchievementProgress;
}

export interface AchievementProgress {
  tier: AchievementTier;
  progress: number;
  nextTierProgress: number | null;
  achievedAt: number;
}

export enum AchievementTier {
  None = 0,
  Achieved = 1,
  BronzeI = 10,
  BronzeII = 11,
  BronzeIII = 12,
  SilverI = 20,
  SilverII = 21,
  SilverIII = 22,
  GoldI = 30,
  GoldII = 31,
  GoldIII = 32,
  RubyI = 40,
  RubyII = 41,
  RubyIII = 42,
  MasterI = 50,
  MasterII = 51,
  MasterIII = 52,
}
