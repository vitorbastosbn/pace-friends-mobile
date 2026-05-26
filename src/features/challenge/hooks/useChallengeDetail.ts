import { useCallback, useEffect, useState } from 'react';
import {
  ChallengeServiceError,
  getChallengeDetail as apiGetChallengeDetail,
  registerActivity as apiRegisterActivity,
} from '../services/challengeService';
import type {
  ActivityResponse,
  ChallengeProgressResponse,
  RegisterActivityRequest,
} from '../types/challenge.types';

type LoadState = 'idle' | 'loading' | 'success' | 'error';
type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export interface UseChallengeDetailResult {
  detail: ChallengeProgressResponse | null;
  activities: ActivityResponse[];
  isLoading: boolean;
  error: string | null;
  submitState: SubmitState;
  submitError: string | null;
  registerActivity: (req: RegisterActivityRequest) => Promise<boolean>;
  reload: () => void;
}

export function useChallengeDetail(
  token: string,
  challengeId: string,
  options: { autoLoad?: boolean } = {}
): UseChallengeDetailResult {
  const { autoLoad = true } = options;
  const [detail, setDetail] = useState<ChallengeProgressResponse | null>(null);
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token || !challengeId) return;
    setLoadState('loading');
    setError(null);
    try {
      const detailData = await apiGetChallengeDetail(token, challengeId);
      setDetail(detailData);
      setActivities(detailData.activities ?? []);
      setLoadState('success');
    } catch (err) {
      const message =
        err instanceof ChallengeServiceError
          ? err.message
          : 'Erro inesperado ao carregar desafio.';
      setError(message);
      setLoadState('error');
    }
  }, [token, challengeId]);

  useEffect(() => {
    if (autoLoad) {
      void load();
    }
  }, [load, autoLoad]);

  async function registerActivity(req: RegisterActivityRequest): Promise<boolean> {
    setSubmitState('submitting');
    setSubmitError(null);
    try {
      await apiRegisterActivity(token, challengeId, req);
      setSubmitState('success');
      void load();
      return true;
    } catch (err) {
      const message =
        err instanceof ChallengeServiceError
          ? err.message
          : 'Erro inesperado ao registrar atividade.';
      setSubmitError(message);
      setSubmitState('error');
      return false;
    }
  }

  return {
    detail,
    activities,
    isLoading: loadState === 'loading',
    error,
    submitState,
    submitError,
    registerActivity,
    reload: load,
  };
}
