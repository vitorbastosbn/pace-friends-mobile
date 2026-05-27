import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { StreakData } from '../types/streak.types';
import { WeekProgress } from './WeekProgress';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

interface StreakCardProps {
  data: StreakData;
  onPress?: () => void;
}

interface StreakCardSkeletonProps {
  onPress?: () => void;
}

interface StreakCardErrorProps {
  message: string;
  onRetry: () => void;
}

export function StreakCardSkeleton({ onPress }: StreakCardSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityLabel="Carregando ofensiva"
      accessibilityRole="button"
      disabled
    >
      <Animated.View style={[styles.skeletonRow, { opacity }]}>
        <View style={styles.skeletonIcon} />
        <View style={styles.skeletonCounter} />
      </Animated.View>
      <Animated.View style={[styles.skeletonBarWrap, { opacity }]}>
        <View style={styles.skeletonBar} />
      </Animated.View>
      <Animated.View style={[styles.skeletonXp, { opacity }]} />
    </Pressable>
  );
}

export function StreakCardError({ message, onRetry }: StreakCardErrorProps) {
  return (
    <View
      style={[styles.card, styles.errorCard]}
      accessibilityRole="none"
    >
      <Text style={styles.errorText}>{message}</Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [
          styles.retryButton,
          pressed && styles.retryButtonPressed,
        ]}
        accessibilityLabel="Tentar novamente"
        accessibilityRole="button"
      >
        <Text style={styles.retryText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

export function StreakCard({ data, onPress }: StreakCardProps) {
  const { currentStreak, targetFrequency, daysCompletedThisWeek, remainingDays, xpProgress } =
    data;
  const isEmpty = currentStreak === 0;
  const accessLabel = isEmpty
    ? 'Ofensiva zerada. Comece hoje!'
    : `Ofensiva de ${currentStreak} semana${currentStreak !== 1 ? 's' : ''}. ${daysCompletedThisWeek} de ${targetFrequency} dias esta semana.`;

  const subtitleText = isEmpty
    ? 'Comece hoje e inicie sua ofensiva!'
    : remainingDays > 0
    ? 'Você está em chamas!'
    : 'Semana completa! Continue assim!';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && onPress && styles.cardPressed]}
      onPress={onPress}
      accessibilityLabel={accessLabel}
      accessibilityRole={onPress ? 'button' : 'none'}
    >
      <View style={styles.ambientCircle} pointerEvents="none" />

      <View style={styles.centerContent}>
        <View style={styles.fireIconContainer}>
          <MaterialIcons name="local-fire-department" size={64} color={colors.tertiary} />
        </View>

        <View style={styles.textGroup}>
          <Text style={[styles.streakHeadline, isEmpty && styles.streakHeadlineEmpty]}>
            {isEmpty ? '0 semanas' : `${currentStreak} semana${currentStreak !== 1 ? 's' : ''}`}
          </Text>
          <Text style={styles.streakSubtitle}>{subtitleText}</Text>
        </View>

        {xpProgress.potentialXp > 0 && (
          <View style={styles.xpBadge}>
            <MaterialIcons name="add-circle" size={18} color={colors.tertiary} />
            <Text style={styles.xpText}>+{xpProgress.potentialXp} XP Potencial</Text>
          </View>
        )}
      </View>

      <View style={styles.calendarSection}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarTitle}>Semana Atual</Text>
          <Text style={styles.calendarSubtitle}>{daysCompletedThisWeek} de 7 dias</Text>
        </View>
        <WeekProgress
          daysCompleted={daysCompletedThisWeek}
          targetDays={targetFrequency}
          filledColor={colors.primary}
          labelPosition="top"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 24,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.surfaceContainerLow,
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
  ambientCircle: {
    position: 'absolute',
    right: -32,
    top: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.tertiaryFixed,
    opacity: 0.1,
  },
  centerContent: {
    alignItems: 'center',
    gap: 16,
  },
  fireIconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(208,166,0,0.10)',
    borderRadius: 48,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  textGroup: {
    alignItems: 'center',
    gap: 4,
  },
  streakHeadline: {
    color: colors.onSurface,
    fontFamily: fonts.displayBold,
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center',
  },
  streakHeadlineEmpty: {
    color: colors.onSurfaceVariant,
  },
  streakSubtitle: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  xpBadge: {
    alignItems: 'center',
    backgroundColor: colors.tertiaryFixed,
    borderRadius: 9999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  xpText: {
    color: colors.tertiary,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    letterSpacing: 0.28,
  },
  calendarSection: {
    borderTopColor: 'rgba(195,198,215,0.3)',
    borderTopWidth: 1,
    gap: 16,
    marginTop: 32,
    paddingTop: 24,
  },
  calendarHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarTitle: {
    color: colors.onSurface,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    letterSpacing: 0.28,
  },
  calendarSubtitle: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  errorCard: {
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    color: colors.error,
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryButtonPressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
  retryText: {
    color: colors.primary,
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  skeletonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  skeletonIcon: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  skeletonCounter: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 8,
    height: 32,
    width: 64,
  },
  skeletonBarWrap: {
    width: '100%',
  },
  skeletonBar: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 14,
    height: 28,
    width: '100%',
  },
  skeletonXp: {
    alignSelf: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 8,
    height: 16,
    width: 80,
  },
});
