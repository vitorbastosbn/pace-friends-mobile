import type { Streak, StreakResponse } from '../types/streak.types';

export function mapStreakResponse(response: StreakResponse): Streak {
  return {
    currentStreak: response.currentStreak,
    targetFrequency: response.targetFrequency,
    daysCompletedThisWeek: response.daysCompletedThisWeek,
    remainingDays: response.remainingDays,
    xpProgress: response.xpProgress,
    lastResult: response.lastResult,
  };
}
