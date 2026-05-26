export interface AchievementProgress {
  current: number;
  total: number;
}

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconKey: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: AchievementProgress | null;
}

export interface AchievementApiResponse {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconKey: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: { current: number; total: number } | null;
}
