import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeScreen } from '../../src/features/home/screens/HomeScreen';
import { getSession } from '../../src/services/sessionManager';

type PageState = 'loading' | 'ready' | 'unauthenticated';

export default function HomePage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | undefined>();
  const [token, setToken] = useState('');

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();
        if (!session) {
          setPageState('unauthenticated');
          return;
        }

        setUserId(session.user.id);
        setUserName(session.user.name);
        setUserPhotoUrl(session.user.photoUrl);
        setToken(session.token);
        setPageState('ready');
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
          accessibilityLabel="Carregando Home"
        />
      </View>
    );
  }

  return (
    <HomeScreen
      userId={userId}
      userName={userName}
      userPhotoUrl={userPhotoUrl}
      token={token}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F6F8FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
