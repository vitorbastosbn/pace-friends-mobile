import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { getSession } from '../../src/services/sessionManager';
import { StreakScreen } from '../../src/features/streak/screens/StreakScreen';
import { colors } from '../../src/theme/colors';

export default function StreakRoute() {
  const [token, setToken] = useState<string>('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadToken() {
      try {
        const session = await getSession();
        setToken(session?.token ?? '');
      } finally {
        setReady(true);
      }
    }
    void loadToken();
  }, []);

  if (!ready) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Carregando" />
        </View>
      </SafeAreaView>
    );
  }

  return <StreakScreen token={token} />;
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
