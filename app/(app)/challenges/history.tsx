import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getSession } from '../../../src/services/sessionManager';
import { ChallengeHistoryScreen } from '../../../src/features/challenge/screens/ChallengeHistoryScreen';

export default function ChallengeHistoryPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const session = await getSession();
      if (session) {
        setToken(session.token);
        setReady(true);
      } else {
        router.replace('/(auth)/login');
      }
    }
    void init();
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0050D7" />
      </View>
    );
  }

  return <ChallengeHistoryScreen token={token} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#F9F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
