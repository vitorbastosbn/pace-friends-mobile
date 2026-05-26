import { useCallback, useEffect, useState } from 'react';
import { StreakServiceError, getStreak as apiGetStreak } from '../services/streakService';
import { subscribeToStreakChanges } from '../services/streakEvents';
import type { StreakData } from '../types/streak.types';

type LoadState = 'idle' | 'loading' | 'success' | 'error';

export interface UseStreakResult {
  streak: StreakData | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

export function useStreak(token: string): UseStreakResult {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoadState('loading');
    setError(null);
    try {
      const data = await apiGetStreak(token);
      setStreak(data);
      setLoadState('success');
    } catch (err) {
      const message =
        err instanceof StreakServiceError
          ? err.message
          : 'Erro inesperado ao carregar ofensiva.';
      setError(message);
      setLoadState('error');
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => subscribeToStreakChanges(load), [load]);

  return {
    streak,
    isLoading: loadState === 'loading',
    error,
    reload: load,
  };
}
