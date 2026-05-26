export type XpProgress = {
  xpPerDay: number;
  potentialXp: number;
  potentialXpIfBroken: number;
};

export type StreakProgress = {
  targetFrequency: number;
  daysCompletedThisWeek: number;
  remainingDays: number;
};

export type Streak = StreakProgress & {
  currentStreak: number;
  xpProgress: XpProgress;
  lastResult: 'MAINTAINED' | 'BROKEN' | null;
};

export type StreakResponse = {
  currentStreak: number;
  targetFrequency: number;
  daysCompletedThisWeek: number;
  remainingDays: number;
  xpProgress: XpProgress;
  lastResult: 'MAINTAINED' | 'BROKEN' | null;
};

export type StreakData = Streak;

export type WeekRange = {
  start: Date;
  end: Date;
};
