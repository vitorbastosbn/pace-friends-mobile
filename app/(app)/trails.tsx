import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getSession } from '../../src/services/sessionManager';
import { TrailScreen } from '../../src/features/trail/screens/TrailScreen';
import { colors } from '../../src/theme/colors';

type PageState = 'loading' | 'ready' | 'unauthenticated';

export default function TrailsPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();
        if (session) {
          setUserId(session.user.id);
          setToken(session.token);
          setPageState('ready');
        } else {
          setPageState('unauthenticated');
        }
      } catch {
        setPageState('unauthenticated');
      }
    }

    void loadSession();
  }, []);

  useEffect(() => {
    if (pageState === 'unauthenticated') {
      router.replace('/(auth)/login');
    }
  }, [pageState, router]);

  if (pageState !== 'ready') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          accessibilityLabel="Carregando trilha"
        />
      </View>
    );
  }

  return <TrailScreen userId={userId} token={token} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
