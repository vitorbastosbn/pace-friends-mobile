import type { HomeSummary, HomeSummaryResponse } from '../types/home.types';

export function mapHomeSummaryResponse(response: HomeSummaryResponse): HomeSummary {
  return {
    currentStreak: response.streak.current,
    totalXp: response.xp.total,
    currentLevel: response.level.current,
    xpForNextLevel: response.level.xp_for_next_level,
    daysTrained: response.weekly_frequency.days_trained,
    weeklyGoal: response.weekly_frequency.goal,
    trainingPath: {
      currentLevel: response.training_path.current_level,
      progressPercent: response.training_path.progress_percent,
      available: response.training_path.available,
    },
  };
}
