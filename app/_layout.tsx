import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { configureGoogleSignIn } from '../src/services/authService';
import { getSession, isTokenExpired } from '../src/services/sessionManager';
import { hasCompletedOnboarding } from '../src/services/onboardingService';
import { AuthNavigationProvider } from '../src/context/auth-navigation-context';

type AuthState = 'checking' | 'onboarding' | 'authenticated' | 'unauthenticated';

export default function RootLayout() {
  const [authState, setAuthState] = useState<AuthState>('checking');
  const segments = useSegments();
  const router = useRouter();

  const completeSignIn = useCallback(() => setAuthState('authenticated'), []);
  const completeSignOut = useCallback(() => setAuthState('unauthenticated'), []);
  const completeOnboarding = useCallback(() => setAuthState('authenticated'), []);

  const authNavigation = useMemo(
    () => ({ completeSignIn, completeSignOut, completeOnboarding }),
    [completeSignIn, completeSignOut, completeOnboarding]
  );

  useEffect(() => {
    void configureGoogleSignIn().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[authService] ${message}`);
    });

    async function checkSession() {
      try {
        const session = await getSession();
        const valid = session !== null && !isTokenExpired(session.token);
        if (!valid) {
          setAuthState('unauthenticated');
          return;
        }
        const onboardingDone = await hasCompletedOnboarding();
        setAuthState(onboardingDone ? 'authenticated' : 'onboarding');
      } catch {
        setAuthState('unauthenticated');
      }
    }

    void checkSession();
  }, []);

  useEffect(() => {
    if (authState === 'checking') return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (authState === 'onboarding' && !inOnboardingGroup) {
      router.replace('/(onboarding)/');
    } else if (authState === 'authenticated' && !inAppGroup) {
      router.replace('/(app)/home');
    } else if (authState === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [authState, router, segments]);

  if (authState === 'checking') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#0D47A1"
          accessibilityLabel="Verificando sessao"
        />
      </View>
    );
  }

  return (
    <AuthNavigationProvider value={authNavigation}>
      <Slot />
    </AuthNavigationProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
