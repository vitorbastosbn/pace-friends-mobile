import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AuthenticationError,
  GoogleSignInUnavailableError,
  signInWithGoogle,
  SignInCancelledError,
} from '../../src/services/authService';
import { saveSession } from '../../src/services/sessionManager';
import { useAuthNavigation } from '../../src/context/auth-navigation-context';

type LoginState = 'idle' | 'loading' | 'cancelled' | 'unavailable' | 'error';

export default function LoginScreen() {
  const { completeSignIn } = useAuthNavigation();
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleGoogleSignIn() {
    setLoginState('loading');
    setErrorMessage('');

    try {
      const authResponse = await signInWithGoogle();
      await saveSession({ token: authResponse.token, user: authResponse.user });
      completeSignIn();
    } catch (error: unknown) {
      if (error instanceof SignInCancelledError) {
        setLoginState('cancelled');
      } else if (error instanceof GoogleSignInUnavailableError) {
        setLoginState('unavailable');
      } else {
        setErrorMessage(
          error instanceof AuthenticationError
            ? error.message
            : 'Nao foi possivel autenticar. Tente novamente.'
        );
        setLoginState('error');
      }
    }
  }

  const isLoading = loginState === 'loading';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Branding block — centered vertically */}
        <View style={styles.brandingBlock}>
          <Text style={styles.appName} accessibilityRole="header">
            Pace Friends
          </Text>
          <Text style={styles.tagline}>Corra junto com seus amigos</Text>
        </View>

        {/* Action block — anchored to bottom */}
        <View style={styles.actionBlock}>
          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              isLoading && styles.googleButtonDisabled,
              pressed && !isLoading && styles.googleButtonPressed,
            ]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            accessibilityLabel="Entrar com Google"
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading, busy: isLoading }}
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#3C4043"
                accessibilityLabel="Entrando com Google"
              />
            ) : (
              <>
                <Text style={styles.googleIconText}>G</Text>
                <Text style={styles.googleButtonText}>Entrar com Google</Text>
              </>
            )}
          </Pressable>

          <View style={styles.feedbackArea}>
            {loginState === 'cancelled' && (
              <Text
                style={styles.cancelledMessage}
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
              >
                Login cancelado.
              </Text>
            )}
            {loginState === 'error' && (
              <Text
                style={styles.errorMessage}
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
              >
                {errorMessage}
              </Text>
            )}
            {loginState === 'unavailable' && (
              <Text
                style={styles.errorMessage}
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
              >
                Login com Google requer um development build.
              </Text>
            )}
          </View>
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  brandingBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0D47A1',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: '#546E7A',
    fontWeight: '400',
  },
  actionBlock: {
    width: '100%',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 12,
    gap: 10,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonPressed: {
    backgroundColor: '#F1F3F4',
  },
  googleIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',
    lineHeight: 22,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3C4043',
    letterSpacing: 0.25,
  },
  feedbackArea: {
    minHeight: 28,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelledMessage: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
  },
});
