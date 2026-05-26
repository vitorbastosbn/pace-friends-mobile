import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getSession } from '../../../../../src/services/sessionManager';
import { RegisterCheckInScreen } from '../../../../../src/features/challenge/screens/RegisterCheckInScreen';

type PageState = 'loading' | 'ready' | 'unauthenticated';

export default function RegisterCheckInPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [token, setToken] = useState('');

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();
        if (session) {
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

  if (pageState !== 'ready' || !id) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#16a766"
          accessibilityLabel="Carregando"
        />
      </View>
    );
  }

  return <RegisterCheckInScreen token={token} challengeId={id} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
