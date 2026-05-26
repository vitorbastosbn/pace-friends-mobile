export type UserObjective =
  | 'LOSE_WEIGHT'
  | 'GAIN_MUSCLE'
  | 'IMPROVE_FITNESS'
  | 'MAINTAIN';

export type WeeklyFrequency = 'THREE' | 'FOUR' | 'FIVE';

export interface ProfileStats {
  totalXp: number;
  currentStreak: number;
  achievementsUnlocked: number;
}

export interface ProfileData {
  name: string;
  email: string;
  photoUrl: string | null;
  objective: UserObjective;
  weeklyFrequency: WeeklyFrequency;
  stats: ProfileStats;
  effectiveFrom: string;
}

export interface UpdateProfileRequest {
  objective: UserObjective;
  weeklyFrequency: WeeklyFrequency;
}

export interface ProfileUIModel {
  name: string;
  email: string;
  photoUrl: string | null;
  objective: UserObjective;
  weeklyFrequency: WeeklyFrequency;
  totalXp: number;
  currentStreak: number;
  achievementsUnlocked: number;
  effectiveFrom: string;
}
