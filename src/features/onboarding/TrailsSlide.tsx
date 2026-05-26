// mobile/src/features/onboarding/TrailsSlide.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { PaginationDots } from './PaginationDots';

type Props = {
  onStart: () => void;
};

export function TrailsSlide({ onStart }: Props) {
  return (
    <View style={styles.screen}>
      <ExpoStatusBar style="dark" />

      <View style={styles.illustrationArea}>
        <View style={styles.trophyCard}>
          <View style={styles.trophyIconCircle}>
            <MaterialIcons name="emoji-events" size={48} color={colors.onPrimary} />
          </View>
          <Text style={styles.levelText}>Nível 12</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.xpText}>750 / 1000 XP</Text>
        </View>

        <View style={styles.proBadge}>
          <MaterialIcons name="military-tech" size={18} color={colors.primary} />
          <Text style={styles.proBadgeText}>PRO</Text>
        </View>

        <View style={styles.masterBadge}>
          <View style={styles.masterIcon}>
            <MaterialIcons name="workspace-premium" size={16} color={colors.onSecondaryContainer} />
          </View>
          <Text style={styles.masterText}>Mestre das{'\n'}Trilhas</Text>
        </View>

        <View style={styles.xpBubble}>
          <Text style={styles.xpBubbleText}>+50</Text>
        </View>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.heading}>Evolua sua trilha</Text>
        <Text style={styles.body}>
          Suba de nível completando missões e desbloqueando conquistas exclusivas. Sua jornada rumo ao bem-estar começa agora!
        </Text>
      </View>

      <PaginationDots total={3} current={2} />

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel="Começar"
        >
          <Text style={styles.primaryButtonText}>Começar</Text>
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
  illustrationArea: {
    alignItems: 'center',
    height: 300,
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  trophyCard: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.outlineVariant,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 24,
    width: 200,
  },
  trophyIconCircle: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 4,
    width: 80,
  },
  levelText: {
    color: colors.onSurface,
    fontFamily: fonts.displayBold,
    fontSize: 18,
  },
  progressBar: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 6,
    height: 10,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    backgroundColor: colors.secondary,
    borderRadius: 6,
    height: '100%',
    width: '75%',
  },
  xpText: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },
  proBadge: {
    alignItems: 'center',
    backgroundColor: colors.primaryFixed,
    borderRadius: 12,
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'absolute',
    right: 16,
    top: 20,
  },
  proBadgeText: {
    color: colors.primary,
    fontFamily: fonts.displayBold,
    fontSize: 11,
  },
  masterBadge: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    borderWidth: 1,
    bottom: 20,
    flexDirection: 'row',
    gap: 6,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: 'absolute',
  },
  masterIcon: {
    alignItems: 'center',
    backgroundColor: colors.secondaryContainer,
    borderRadius: 10,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  masterText: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
  },
  xpBubble: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    height: 36,
    justifyContent: 'center',
    left: 20,
    position: 'absolute',
    top: 40,
    width: 36,
  },
  xpBubbleText: {
    color: colors.onPrimary,
    fontFamily: fonts.displayBold,
    fontSize: 11,
  },
  textBlock: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
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
