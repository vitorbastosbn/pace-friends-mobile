import type { ProfileData, ProfileUIModel } from '../types/profile.types';

export function mapProfileDataToUIModel(data: ProfileData): ProfileUIModel {
  return {
    name: data.name,
    email: data.email,
    photoUrl: data.photoUrl,
    objective: data.objective,
    weeklyFrequency: data.weeklyFrequency,
    totalXp: data.stats.totalXp,
    currentStreak: data.stats.currentStreak,
    achievementsUnlocked: data.stats.achievementsUnlocked,
    effectiveFrom: data.effectiveFrom,
  };
}
