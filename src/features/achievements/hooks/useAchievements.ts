import { useCallback, useEffect, useState } from 'react';
import { AchievementsServiceError, getUserAchievements } from '../services/achievementsService';
import { mapAchievements, sortAchievements } from '../mappers/achievementMapper';
import type { Achievement } from '../types/achievement.types';

type LoadState = 'idle' | 'loading' | 'success' | 'error';

export interface UseAchievementsResult {
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

export function useAchievements(token: string): UseAchievementsResult {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoadState('loading');
    setError(null);
    try {
      const raw = await getUserAchievements(token);
      setAchievements(sortAchievements(mapAchievements(raw)));
      setLoadState('success');
    } catch (err) {
      const message =
        err instanceof AchievementsServiceError
          ? err.message
          : 'Erro inesperado ao carregar conquistas.';
      setError(message);
      setLoadState('error');
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    achievements,
    isLoading: loadState === 'loading',
    error,
    reload: load,
  };
}
