// mobile/src/features/onboarding/StreakSlide.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { PaginationDots } from './PaginationDots';

type Props = {
  onNext: () => void;
  onSkip: () => void;
};

export function StreakSlide({ onNext, onSkip }: Props) {
  return (
    <View style={styles.screen}>
      <ExpoStatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.logoRow}>
          <MaterialIcons name="directions-run" size={20} color={colors.primary} />
          <Text style={styles.logoText}>Pace Friends</Text>
        </View>
        <Pressable onPress={onSkip} hitSlop={12} accessibilityRole="button" accessibilityLabel="Pular onboarding">
          <Text style={styles.skipText}>Pular</Text>
        </Pressable>
      </View>

      <View style={styles.illustrationArea}>
        <View style={styles.flameCircle}>
          <MaterialIcons name="local-fire-department" size={80} color={colors.primary} />
        </View>
        <View style={styles.ofensivaBadge}>
          <MaterialIcons name="bolt" size={14} color={colors.primary} />
          <Text style={styles.badgeText}>Ofensiva</Text>
        </View>
        <View style={styles.xpChip}>
          <MaterialIcons name="trending-up" size={14} color={colors.secondary} />
          <Text style={styles.xpText}>XP Bônus +250 XP</Text>
        </View>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.heading}>Mantenha o ritmo</Text>
        <Text style={styles.body}>
          Escolha sua frequência semanal e ganhe XP a cada treino concluído.{' '}
          <Text style={styles.bodyBold}>Não deixe a chama apagar!</Text>
        </Text>
      </View>

      <PaginationDots total={3} current={0} />

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel="Próximo"
        >
          <Text style={styles.primaryButtonText}>Próximo</Text>
          <MaterialIcons name="arrow-forward" size={20} color={colors.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 48,
  },
  logoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  logoText: {
    color: colors.primary,
    fontFamily: fonts.displayBold,
    fontSize: 16,
  },
  skipText: {
    color: colors.primary,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
  illustrationArea: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  flameCircle: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 128,
    height: 200,
    justifyContent: 'center',
    width: 200,
  },
  ofensivaBadge: {
    alignItems: 'center',
    backgroundColor: colors.primaryFixed,
    borderRadius: 20,
    bottom: -14,
    flexDirection: 'row',
    gap: 4,
    left: '50%',
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'absolute',
    transform: [{ translateX: -44 }],
  },
  badgeText: {
    color: colors.primary,
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  xpChip: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'absolute',
    right: 16,
    top: 16,
  },
  xpText: {
    color: colors.secondary,
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
  },
  textBlock: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
    marginTop: 24,
  },
  heading: {
    color: colors.onSurface,
    fontFamily: fonts.displayBold,
    fontSize: 28,
    letterSpacing: -0.25,
    lineHeight: 36,
    textAlign: 'center',
  },
  body: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  bodyBold: {
    color: colors.primary,
    fontFamily: fonts.bodySemiBold,
  },
  footer: {
    marginTop: 'auto',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    height: 56,
    justifyContent: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    color: colors.onPrimary,
    fontFamily: fonts.displayBold,
    fontSize: 16,
  },
});
