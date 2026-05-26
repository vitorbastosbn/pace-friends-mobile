export interface HomeSummaryResponse {
  streak: {
    current: number;
    unit: string;
  };
  xp: {
    total: number;
  };
  level: {
    current: number;
    xp_for_next_level: number | null;
  };
  weekly_frequency: {
    days_trained: number;
    goal: number;
  };
  training_path: {
    current_level: string | null;
    progress_percent: number | null;
    available: boolean;
  };
}

export interface HomeSummary {
  currentStreak: number;
  totalXp: number;
  currentLevel: number;
  xpForNextLevel: number | null;
  daysTrained: number;
  weeklyGoal: number;
  trainingPath: {
    currentLevel: string | null;
    progressPercent: number | null;
    available: boolean;
  };
}
