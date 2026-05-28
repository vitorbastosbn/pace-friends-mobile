import { useCallback, useEffect, useState } from 'react';
import { friendChallengeService, ChallengeServiceError } from '../services/challengeService';
import type { FriendChallenge } from '../types/challenge.types';

const PAGE_SIZE = 10;

export interface UseChallengeHistoryResult {
  items: FriendChallenge[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasNext: boolean;
  loadMore: () => void;
  reload: () => void;
}

export function useChallengeHistory(token: string): UseChallengeHistoryResult {
  const [items, setItems] = useState<FriendChallenge[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (targetPage: number, append: boolean) => {
    if (!token) return;
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);
    setError(null);
    try {
      const result = await friendChallengeService.history(token, targetPage, PAGE_SIZE);
      setItems(prev => append ? [...prev, ...result.items] : result.items);
      setPage(result.page);
      setHasNext(result.hasNext);
    } catch (err) {
      const message = err instanceof ChallengeServiceError ? err.message : 'Erro inesperado.';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [token]);

  useEffect(() => {
    void load(0, false);
  }, [load]);

  function loadMore() {
    if (!hasNext || isLoadingMore) return;
    void load(page + 1, true);
  }

  function reload() {
    void load(0, false);
  }

  return { items, isLoading, isLoadingMore, error, hasNext, loadMore, reload };
}
