import { useCallback, useEffect, useRef, useState } from 'react';
import { getProfile, updateProfile, ProfileServiceError } from '../services/profileService';
import { mapProfileDataToUIModel } from '../mappers/profileMapper';
import { validateProfileUpdate } from '../validation/profileValidation';
import type { ProfileUIModel, UserObjective, WeeklyFrequency } from '../types/profile.types';

type LoadState = 'idle' | 'loading' | 'success' | 'error';
type SaveState = 'idle' | 'submitting' | 'success' | 'error';

export interface UseProfileResult {
  profile: ProfileUIModel | null;
  loadState: LoadState;
  saveState: SaveState;
  loadError: string | null;
  saveError: string | null;
  pendingObjective: UserObjective | null;
  pendingFrequency: WeeklyFrequency | null;
  isDirty: boolean;
  setObjective: (value: UserObjective) => void;
  setFrequency: (value: WeeklyFrequency) => void;
  saveProfile: () => Promise<void>;
  resetChanges: () => void;
  reload: () => void;
}

export function useProfile(userId: string, token: string): UseProfileResult {
  const [profile, setProfile] = useState<ProfileUIModel | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingObjective, setPendingObjective] = useState<UserObjective | null>(null);
  const [pendingFrequency, setPendingFrequency] = useState<WeeklyFrequency | null>(null);

  // Use a ref to track the latest userId/token without causing effect re-runs
  const paramsRef = useRef({ userId, token });
  paramsRef.current = { userId, token };

  const loadProfile = useCallback(async () => {
    setLoadState('loading');
    setLoadError(null);
    try {
      const data = await getProfile(paramsRef.current.userId, paramsRef.current.token);
      const uiModel = mapProfileDataToUIModel(data);
      setProfile(uiModel);
      setPendingObjective(null);
      setPendingFrequency(null);
      setLoadState('success');
    } catch (err) {
      const message =
        err instanceof ProfileServiceError
          ? err.message
          : 'Erro inesperado ao carregar perfil.';
      setLoadError(message);
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const isDirty =
    (pendingObjective !== null && pendingObjective !== profile?.objective) ||
    (pendingFrequency !== null && pendingFrequency !== profile?.weeklyFrequency);

  function setObjective(value: UserObjective) {
    setPendingObjective(value);
    setSaveState('idle');
    setSaveError(null);
  }

  function setFrequency(value: WeeklyFrequency) {
    setPendingFrequency(value);
    setSaveState('idle');
    setSaveError(null);
  }

  function resetChanges() {
    setPendingObjective(null);
    setPendingFrequency(null);
    setSaveState('idle');
    setSaveError(null);
  }

  async function saveProfile() {
    if (!profile) return;

    const objective = pendingObjective ?? profile.objective;
    const weeklyFrequency = pendingFrequency ?? profile.weeklyFrequency;

    const validationError = validateProfileUpdate(objective, weeklyFrequency);
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setSaveState('submitting');
    setSaveError(null);

    try {
      const updated = await updateProfile(
        paramsRef.current.userId,
        paramsRef.current.token,
        { objective, weeklyFrequency }
      );
      const uiModel = mapProfileDataToUIModel(updated);
      setProfile(uiModel);
      setPendingObjective(null);
      setPendingFrequency(null);
      setSaveState('success');
    } catch (err) {
      const message =
        err instanceof ProfileServiceError
          ? err.message
          : 'Erro inesperado ao salvar.';
      setSaveError(message);
      setSaveState('error');
    }
  }

  return {
    profile,
    loadState,
    saveState,
    loadError,
    saveError,
    pendingObjective,
    pendingFrequency,
    isDirty,
    setObjective,
    setFrequency,
    saveProfile,
    resetChanges,
    reload: loadProfile,
  };
}
