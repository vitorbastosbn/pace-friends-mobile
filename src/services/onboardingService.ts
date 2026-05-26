import * as SecureStore from 'expo-secure-store';

const KEY = 'pace_onboarding_complete';

export async function hasCompletedOnboarding(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(KEY);
  return value === 'true';
}

export async function markOnboardingComplete(): Promise<void> {
  await SecureStore.setItemAsync(KEY, 'true');
}
