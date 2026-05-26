import { useCallback, useEffect, useState } from 'react';
import {
  ChallengeServiceError,
  createChallenge as apiCreateChallenge,
  getChallenges as apiGetChallenges,
} from '../services/challengeService';
import type { ChallengeProgressResponse, CreateChallengeRequest } from '../types/challenge.types';

type LoadState = 'idle' | 'loading' | 'success' | 'error';
type CreateState = 'idle' | 'submitting' | 'success' | 'error';

export interface UseChallengesResult {
  challenges: ChallengeProgressResponse[];
  isLoading: boolean;
  error: string | null;
  createState: CreateState;
  createError: string | null;
  createChallenge: (req: CreateChallengeRequest) => Promise<boolean>;
  reload: () => void;
}

export function useChallenges(
  token: string,
  options: { autoLoad?: boolean } = {}
): UseChallengesResult {
  const { autoLoad = true } = options;
  const [challenges, setChallenges] = useState<ChallengeProgressResponse[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [createState, setCreateState] = useState<CreateState>('idle');
  const [createError, setCreateError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoadState('loading');
    setError(null);
    try {
      const data = await apiGetChallenges(token);
      setChallenges(data);
      setLoadState('success');
    } catch (err) {
      const message =
        err instanceof ChallengeServiceError
          ? err.message
          : 'Erro inesperado ao carregar desafios.';
      setError(message);
      setLoadState('error');
    }
  }, [token]);

  useEffect(() => {
    if (autoLoad) {
      void load();
    }
  }, [load, autoLoad]);

  async function createChallenge(req: CreateChallengeRequest): Promise<boolean> {
    setCreateState('submitting');
    setCreateError(null);
    try {
      await apiCreateChallenge(token, req);
      setCreateState('success');
      void load();
      return true;
    } catch (err) {
      const message =
        err instanceof ChallengeServiceError
          ? err.message
          : 'Erro inesperado ao criar desafio.';
      setCreateError(message);
      setCreateState('error');
      return false;
    }
  }

  return {
    challenges,
    isLoading: loadState === 'loading',
    error,
    createState,
    createError,
    createChallenge,
    reload: load,
  };
}
