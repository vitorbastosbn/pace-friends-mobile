import { useCallback, useEffect, useState } from 'react';
import {
  ChallengeServiceError,
  challengeService,
  friendChallengeService,
} from '../services/challengeService';
import type { FriendChallenge, IndividualChallenge } from '../types/challenge.types';

interface ChallengeOverviewState {
  individualChallenge: IndividualChallenge | null;
  friendChallenges: FriendChallenge[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useChallengeOverview(token: string): ChallengeOverviewState {
  const [individualChallenge, setIndividualChallenge] = useState<IndividualChallenge | null>(null);
  const [friendChallenges, setFriendChallenges] = useState<FriendChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [individual, friends] = await Promise.all([
        challengeService.getMyChallenge(token),
        friendChallengeService.list(token),
      ]);
      setIndividualChallenge(individual);
      setFriendChallenges(friends);
    } catch (cause) {
      setError(
        cause instanceof ChallengeServiceError
          ? cause.message
          : 'Nao foi possivel carregar seus desafios.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    individualChallenge,
    friendChallenges,
    isLoading,
    error,
    reload,
  };
}
