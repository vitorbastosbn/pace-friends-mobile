import { useCallback, useEffect, useState } from 'react';
import { getHomeSummary, HomeServiceError } from '../services/homeService';
import type { HomeSummary } from '../types/home.types';

type LoadState = 'loading' | 'success' | 'error';

export interface UseHomeSummaryResult {
  summary: HomeSummary | null;
  loadState: LoadState;
  error: string | null;
  reload: () => void;
}

export function useHomeSummary(userId: string, token: string): UseHomeSummaryResult {
  const [summary, setSummary] = useState<HomeSummary | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId || !token) return;

    setLoadState('loading');
    setError(null);
    try {
      setSummary(await getHomeSummary(userId, token));
      setLoadState('success');
    } catch (loadError: unknown) {
      setError(
        loadError instanceof HomeServiceError
          ? loadError.message
          : 'Erro inesperado ao carregar sua Home.'
      );
      setLoadState('error');
    }
  }, [token, userId]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    summary,
    loadState,
    error,
    reload: load,
  };
}
