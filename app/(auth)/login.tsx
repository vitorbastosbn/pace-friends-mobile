import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  useFonts as useBeVietnamPro,
} from '@expo-google-fonts/be-vietnam-pro';
import {
  PlusJakartaSans_700Bold,
  useFonts as usePlusJakartaSans,
} from '@expo-google-fonts/plus-jakarta-sans';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import {
  AuthenticationError,
  GoogleSignInUnavailableError,
  signInWithGoogle,
  SignInCancelledError,
} from '../../src/services/authService';
import { saveSession } from '../../src/services/sessionManager';
import { useAuthNavigation } from '../../src/context/auth-navigation-context';
import { colors } from '../../src/theme/colors';
import { fonts } from '../../src/theme/typography';

type LoginState = 'idle' | 'loading' | 'cancelled' | 'unavailable' | 'error';

const RUNNERS_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCnukUcqSe2Hp76JKvvhwoUldX-lfs5t8MMvvSYsjgx76S7Mm5g6KgoPpfOiNcWfeL-DBQMUR1B6t5CoRRZsQCY1mXB_pC45GffGsb3MfCrUr6V6YZqVHCBrJkINZxK9CkxSOUtoBzB-56DCoXZT_yYfEwE2CYVLzuXLb7ZDhngQXPC7BteEZKJlZFxaNVINkkqUWl4RlFGzF3U_Q0iVx84iLWIPNRb4ZYeqVb6irkVkrQwxYTZAA62iuj_iP9K2M6ueJ2weop8wJjr';
const GOOGLE_LOGO = 'https://developers.google.com/identity/images/g-logo.png';

export default function LoginScreen() {
  const { completeSignIn } = useAuthNavigation();
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayFontsLoaded] = usePlusJakartaSans({ PlusJakartaSans_700Bold });
  const [bodyFontsLoaded] = useBeVietnamPro({
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
  });

  async function handleGoogleSignIn() {
    setLoginState('loading');
    setErrorMessage('');

    try {
      const authResponse = await signInWithGoogle();
      await saveSession({ token: authResponse.token, user: authResponse.user });
      void completeSignIn();
    } catch (error: unknown) {
      if (error instanceof SignInCancelledError) {
        setLoginState('cancelled');
      } else if (error instanceof GoogleSignInUnavailableError) {
        setLoginState('unavailable');
      } else {
        setErrorMessage(
          error instanceof AuthenticationError
            ? error.message
            : 'Não foi possível autenticar. Tente novamente.'
        );
        setLoginState('error');
      }
    }
  }

  const isLoading = loginState === 'loading';

  if (!displayFontsLoaded || !bodyFontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ExpoStatusBar style="dark" />
        <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Carregando" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ExpoStatusBar style="dark" />
      <View pointerEvents="none" style={styles.backgroundLight}>
        <View style={[styles.glow, styles.blueGlow]} />
        <View style={[styles.glow, styles.greenGlow]} />
        <View style={[styles.glow, styles.yellowGlow]} />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandingBlock}>
          <View style={styles.logo}>
            <MaterialIcons name="directions-run" size={48} color={colors.onPrimary} />
          </View>
          <Text selectable style={styles.appName} accessibilityRole="header">
            Pace Friends
          </Text>
          <Text selectable style={styles.tagline}>Corra junto com seus amigos</Text>
        </View>

        <ImageBackground
          source={{ uri: RUNNERS_IMAGE }}
          style={styles.featurePanel}
          imageStyle={styles.featureImage}
          accessibilityLabel="Amigos correndo juntos"
        >
          <View style={styles.panelTint} />
          <View style={styles.floatingCards}>
            <FeatureCard
              icon="emoji-events"
              label="Novo Desafio"
              title="Maratona de Verão"
              tone="secondary"
              shiftedLeft
            />
            <FeatureCard
              icon="group"
              label="Atividade Recente"
              title="Lucas correu 5km"
              tone="primary"
              shiftedRight
            />
          </View>
        </ImageBackground>

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
                color={colors.onSurface}
                accessibilityLabel="Entrando com Google"
              />
            ) : (
              <>
                <Image source={{ uri: GOOGLE_LOGO }} style={styles.googleLogo} />
                <Text style={styles.googleButtonText}>Entrar com Google</Text>
              </>
            )}
          </Pressable>

          {loginState === 'cancelled' ? (
            <Text selectable style={styles.cancelledMessage} accessibilityLiveRegion="polite">
              Login cancelado.
            </Text>
          ) : null}
          {loginState === 'error' ? (
            <Text
              selectable
              style={styles.errorMessage}
              accessibilityLiveRegion="polite"
              accessibilityRole="alert"
            >
              {errorMessage}
            </Text>
          ) : null}
          {loginState === 'unavailable' ? (
            <Text
              selectable
              style={styles.errorMessage}
              accessibilityLiveRegion="polite"
              accessibilityRole="alert"
            >
              Login com Google requer um development build.
            </Text>
          ) : null}

          <Text selectable style={styles.terms}>
            Ao continuar, você concorda com nossos{'\n'}Termos de Serviço e Política de
            Privacidade.
          </Text>
        </View>

        <View style={styles.pagination} accessibilityElementsHidden>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </ScrollView>
    </View>
  );
}

function FeatureCard({
  icon,
  label,
  shiftedLeft,
  shiftedRight,
  title,
  tone,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  shiftedLeft?: boolean;
  shiftedRight?: boolean;
  title: string;
  tone: 'primary' | 'secondary';
}) {
  return (
    <View
      style={[
        styles.featureCard,
        shiftedLeft && styles.cardShiftedLeft,
        shiftedRight && styles.cardShiftedRight,
      ]}
    >
      <View style={[styles.featureIcon, tone === 'primary' && styles.primaryFeatureIcon]}>
        <MaterialIcons
          name={icon}
          size={20}
          color={tone === 'primary' ? colors.primaryDark : colors.secondary}
        />
      </View>
      <View style={styles.featureText}>
        <Text selectable style={styles.featureLabel}>{label}</Text>
        <Text selectable style={styles.featureTitle}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  loadingScreen: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  backgroundLight: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  glow: {
    borderRadius: 999,
    position: 'absolute',
  },
  blueGlow: {
    backgroundColor: 'rgba(0, 80, 215, 0.04)',
    boxShadow: '0 0 96px 72px rgba(0, 80, 215, 0.04)',
    height: 220,
    left: -75,
    top: 20,
    width: 220,
  },
  greenGlow: {
    backgroundColor: 'rgba(125, 251, 177, 0.09)',
    boxShadow: '0 0 86px 58px rgba(125, 251, 177, 0.09)',
    height: 200,
    right: -66,
    top: 365,
    width: 200,
  },
  yellowGlow: {
    backgroundColor: 'rgba(255, 224, 139, 0.12)',
    boxShadow: '0 0 68px 40px rgba(255, 224, 139, 0.12)',
    bottom: -42,
    height: 145,
    left: 92,
    width: 145,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    gap: 24,
    justifyContent: 'center',
    paddingBottom: 22,
    paddingHorizontal: 20,
    paddingTop: (NativeStatusBar.currentHeight ?? 0) + 20,
  },
  brandingBlock: {
    alignItems: 'center',
    gap: 4,
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 30,
    boxShadow: '0 8px 30px rgba(0, 80, 215, 0.22)',
    height: 96,
    justifyContent: 'center',
    marginBottom: 20,
    transform: [{ rotate: '3deg' }],
    width: 96,
  },
  appName: {
    color: colors.primary,
    fontFamily: fonts.displayBold,
    fontSize: 28,
    letterSpacing: -0.25,
    lineHeight: 36,
  },
  tagline: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  featurePanel: {
    backgroundColor: colors.surfaceContainer,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 24,
    borderWidth: 1,
    height: 320,
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  featureImage: {
    borderRadius: 24,
    opacity: 0.18,
  },
  panelTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(230, 238, 255, 0.60)',
  },
  floatingCards: {
    gap: 16,
    paddingHorizontal: 20,
  },
  featureCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderColor: 'rgba(255, 255, 255, 0.70)',
    borderRadius: 16,
    borderWidth: 1,
    boxShadow: '0 2px 8px rgba(16, 35, 59, 0.05)',
    flexDirection: 'row',
    gap: 16,
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardShiftedLeft: {
    marginRight: 16,
    transform: [{ translateX: -10 }],
  },
  cardShiftedRight: {
    marginLeft: 16,
    transform: [{ translateX: 10 }],
  },
  featureIcon: {
    alignItems: 'center',
    backgroundColor: colors.secondaryContainer,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  primaryFeatureIcon: {
    backgroundColor: colors.primaryFixed,
  },
  featureText: {
    gap: 1,
  },
  featureLabel: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  featureTitle: {
    color: colors.onSurface,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  actionBlock: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  googleButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.outlineVariant,
    borderRadius: 999,
    borderWidth: 1,
    boxShadow: '0 1px 2px rgba(16, 35, 59, 0.04)',
    flexDirection: 'row',
    gap: 14,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonPressed: {
    backgroundColor: colors.surfaceContainerLow,
    transform: [{ scale: 0.98 }],
  },
  googleLogo: {
    height: 22,
    width: 22,
  },
  googleButtonText: {
    color: colors.onSurface,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    letterSpacing: 0.28,
    lineHeight: 20,
  },
  cancelledMessage: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  errorMessage: {
    color: colors.error,
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  terms: {
    color: colors.outline,
    fontFamily: fonts.bodyRegular,
    fontSize: 11,
    letterSpacing: 0.45,
    lineHeight: 16,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    gap: 4,
    paddingTop: 28,
  },
  dot: {
    backgroundColor: colors.outlineVariant,
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
});
