export type UserObjective =
  | 'LOSE_WEIGHT'
  | 'GAIN_MUSCLE'
  | 'IMPROVE_FITNESS'
  | 'MAINTAIN';

export type WeeklyFrequency =
  | 'ONE'
  | 'TWO'
  | 'THREE'
  | 'FOUR'
  | 'FIVE'
  | 'SIX'
  | 'SEVEN';

export interface ProfileStats {
  totalXp: number;
  currentStreak: number;
  achievementsUnlocked: number;
  totalVictories: number;
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

export interface UpdateFrequencyResponse {
  weeklyFrequency: number;
  effectiveFrom: string;
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
  totalVictories: number;
  effectiveFrom: string;
}
