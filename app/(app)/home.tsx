import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getSession } from '../../src/services/sessionManager';
import {
  StreakCard,
  StreakCardError,
  StreakCardSkeleton,
} from '../../src/features/streak/components/StreakCard';
import { useStreak } from '../../src/features/streak/hooks/useStreak';

type HomeState = 'loading' | 'ready';

export default function HomeScreen() {
  const router = useRouter();
  const [homeState, setHomeState] = useState<HomeState>('loading');
  const [userName, setUserName] = useState<string>('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();
        setUserName(session?.user.name ?? '');
        setToken(session?.token ?? '');
      } catch {
        setUserName('');
      } finally {
        setHomeState('ready');
      }
    }

    void loadSession();
  }, []);

  const { streak, isLoading: streakLoading, error: streakError, reload: reloadStreak } =
    useStreak(token);

  const welcomeMessage = userName ? `Bem-vindo, ${userName}!` : 'Bem-vindo!';

  if (homeState === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#0D47A1"
            accessibilityLabel="Carregando perfil"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Welcome content — centered */}
        <View style={styles.welcomeBlock}>
          {streakLoading && (
            <StreakCardSkeleton onPress={() => router.push('/(app)/streak')} />
          )}
          {!streakLoading && streakError && (
            <StreakCardError message={streakError} onRetry={reloadStreak} />
          )}
          {!streakLoading && !streakError && streak && (
            <StreakCard data={streak} onPress={() => router.push('/(app)/streak')} />
          )}
          <Text
            style={styles.welcomeMessage}
            accessibilityRole="header"
            accessibilityLabel={welcomeMessage}
          >
            {welcomeMessage}
          </Text>
          <Text style={styles.subtitle}>
            Voce esta conectado ao Pace Friends.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeMessage: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#546E7A',
    textAlign: 'center',
    fontWeight: '400',
  },
});
