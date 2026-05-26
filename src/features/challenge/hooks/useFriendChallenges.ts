import { useCallback, useEffect, useState } from 'react';
import {
  ChallengeServiceError,
  createFriendChallenge as apiCreate,
  joinFriendChallenge as apiJoin,
  getFriendChallenges as apiGetAll,
} from '../services/challengeService';
import type {
  CreateFriendChallengeRequest,
  FriendChallengeResponse,
} from '../types/challenge.types';

type LoadState = 'idle' | 'loading' | 'success' | 'error';
type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export interface UseFriendChallengesResult {
  challenges: FriendChallengeResponse[];
  loadState: LoadState;
  loadError: string | null;
  createState: SubmitState;
  createError: string | null;
  joinState: SubmitState;
  joinError: string | null;
  createdChallenge: FriendChallengeResponse | null;
  reload: () => void;
  create: (data: CreateFriendChallengeRequest) => Promise<FriendChallengeResponse | null>;
  join: (inviteCode: string) => Promise<FriendChallengeResponse | null>;
}

export function useFriendChallenges(token: string): UseFriendChallengesResult {
  const [challenges, setChallenges] = useState<FriendChallengeResponse[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createState, setCreateState] = useState<SubmitState>('idle');
  const [createError, setCreateError] = useState<string | null>(null);
  const [joinState, setJoinState] = useState<SubmitState>('idle');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [createdChallenge, setCreatedChallenge] = useState<FriendChallengeResponse | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoadState('loading');
    setLoadError(null);
    try {
      const data = await apiGetAll(token);
      setChallenges(data);
      setLoadState('success');
    } catch (err) {
      const message =
        err instanceof ChallengeServiceError
          ? err.message
          : 'Erro inesperado ao carregar desafios.';
      setLoadError(message);
      setLoadState('error');
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(data: CreateFriendChallengeRequest): Promise<FriendChallengeResponse | null> {
    setCreateState('submitting');
    setCreateError(null);
    setCreatedChallenge(null);
    try {
      const result = await apiCreate(token, data);
      setCreatedChallenge(result);
      setCreateState('success');
      void load();
      return result;
    } catch (err) {
      const message =
        err instanceof ChallengeServiceError
          ? err.message
          : 'Erro inesperado ao criar desafio.';
      setCreateError(message);
      setCreateState('error');
      return null;
    }
  }

  async function join(inviteCode: string): Promise<FriendChallengeResponse | null> {
    setJoinState('submitting');
    setJoinError(null);
    try {
      const result = await apiJoin(token, inviteCode);
      setJoinState('success');
      void load();
      return result;
    } catch (err) {
      const message =
        err instanceof ChallengeServiceError
          ? err.message
          : 'Erro inesperado ao entrar no desafio.';
      setJoinError(message);
      setJoinState('error');
      return null;
    }
  }

  return {
    challenges,
    loadState,
    loadError,
    createState,
    createError,
    joinState,
    joinError,
    createdChallenge,
    reload: load,
    create,
    join,
  };
}
