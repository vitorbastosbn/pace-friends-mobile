import { useCallback, useEffect, useState } from 'react';
import {
  TrailServiceError,
  getTrainingPath as apiGetTrainingPath,
  levelUp as apiLevelUp,
} from '../services/trailService';
import { mapTrainingPathData } from '../mappers/trailMapper';
import type { LevelUpResult, TrainingPathData } from '../types/trail.types';

type LoadState = 'idle' | 'loading' | 'success' | 'error';
type LevelUpState = 'idle' | 'submitting' | 'success' | 'error';

export interface UseTrailResult {
  trail: TrainingPathData | null;
  loadState: LoadState;
  loadError: string | null;
  levelUpState: LevelUpState;
  levelUpError: string | null;
  levelUpResult: LevelUpResult | null;
  executeLevelUp: () => Promise<void>;
  reload: () => void;
}

export function useTrail(userId: string, token: string): UseTrailResult {
  const [trail, setTrail] = useState<TrainingPathData | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [levelUpState, setLevelUpState] = useState<LevelUpState>('idle');
  const [levelUpError, setLevelUpError] = useState<string | null>(null);
  const [levelUpResult, setLevelUpResult] = useState<LevelUpResult | null>(null);

  const load = useCallback(async () => {
    if (!userId || !token) return;
    setLoadState('loading');
    setLoadError(null);
    try {
      const data = await apiGetTrainingPath(userId, token);
      setTrail(mapTrainingPathData(data));
      setLoadState('success');
    } catch (err) {
      const message =
        err instanceof TrailServiceError
          ? err.message
          : 'Erro inesperado ao carregar trilha.';
      setLoadError(message);
      setLoadState('error');
    }
  }, [userId, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const executeLevelUp = useCallback(async () => {
    setLevelUpState('submitting');
    setLevelUpError(null);
    setLevelUpResult(null);
    try {
      const result = await apiLevelUp(userId, token);
      setLevelUpResult(result);
      setLevelUpState('success');
      // Reload trail to reflect new level
      void load();
    } catch (err) {
      const message =
        err instanceof TrailServiceError
          ? err.message
          : 'Erro inesperado ao evoluir de nivel.';
      setLevelUpError(message);
      setLevelUpState('error');
    }
  }, [userId, token, load]);

  return {
    trail,
    loadState,
    loadError,
    levelUpState,
    levelUpError,
    levelUpResult,
    executeLevelUp,
    reload: load,
  };
}
