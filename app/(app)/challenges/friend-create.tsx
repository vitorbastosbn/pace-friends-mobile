import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getSession } from '../../../src/services/sessionManager';
import { CreateFriendChallengeScreen } from '../../../src/features/challenge/screens/CreateFriendChallengeScreen';

type PageState = 'loading' | 'ready' | 'unauthenticated';

export default function CreateFriendChallengePage() {
  const router = useRouter();
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

  if (pageState !== 'ready') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#0D47A1"
          accessibilityLabel="Carregando"
        />
      </View>
    );
  }

  return <CreateFriendChallengeScreen token={token} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
