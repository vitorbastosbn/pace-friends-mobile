import type { Achievement, AchievementApiResponse } from '../types/achievement.types';

export function mapAchievement(api: AchievementApiResponse): Achievement {
  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    description: api.description,
    iconKey: api.iconKey,
    unlocked: api.unlocked,
    unlockedAt: api.unlockedAt,
    progress: api.progress ?? null,
  };
}

export function mapAchievements(apiList: AchievementApiResponse[]): Achievement[] {
  return apiList.map(mapAchievement);
}

export function sortAchievements(achievements: Achievement[]): Achievement[] {
  const unlocked = achievements
    .filter((a) => a.unlocked)
    .sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) return 0;
      return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
    });

  const lockedWithProgress = achievements
    .filter((a) => !a.unlocked && a.progress !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  const lockedPure = achievements
    .filter((a) => !a.unlocked && a.progress === null)
    .sort((a, b) => a.name.localeCompare(b.name));

  return [...unlocked, ...lockedWithProgress, ...lockedPure];
}
