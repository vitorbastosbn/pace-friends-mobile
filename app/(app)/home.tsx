import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { signOut } from '../../src/services/authService';
import { getSession } from '../../src/services/sessionManager';
import { useAuthNavigation } from '../../src/context/auth-navigation-context';

type HomeState = 'loading' | 'ready';

export default function HomeScreen() {
  const { completeSignOut } = useAuthNavigation();
  const [homeState, setHomeState] = useState<HomeState>('loading');
  const [userName, setUserName] = useState<string>('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();
        setUserName(session?.user.name ?? '');
      } catch {
        setUserName('');
      } finally {
        setHomeState('ready');
      }
    }

    void loadSession();
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      completeSignOut();
    }
  }

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

        {/* Logout action — anchored to bottom */}
        <View style={styles.actionBlock}>
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              isSigningOut && styles.signOutButtonDisabled,
              pressed && !isSigningOut && styles.signOutButtonPressed,
            ]}
            onPress={handleSignOut}
            disabled={isSigningOut}
            accessibilityLabel="Sair da conta"
            accessibilityRole="button"
            accessibilityState={{ disabled: isSigningOut, busy: isSigningOut }}
          >
            {isSigningOut ? (
              <ActivityIndicator
                size="small"
                color="#D32F2F"
                accessibilityLabel="Saindo da conta"
              />
            ) : (
              <Text style={styles.signOutButtonText}>Sair</Text>
            )}
          </Pressable>
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
    paddingBottom: 48,
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
  actionBlock: {
    width: '100%',
  },
  signOutButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D32F2F',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutButtonPressed: {
    backgroundColor: '#FFEBEE',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    letterSpacing: 0.25,
  },
});
