import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { StreakData } from '../types/streak.types';
import { WeekProgress } from './WeekProgress';
import { colors } from '../../../theme/colors';

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
    ? 'Voce esta em chamas!'
    : 'Semana completa! Continue assim!';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && onPress && styles.cardPressed]}
      onPress={onPress}
      accessibilityLabel={accessLabel}
      accessibilityRole={onPress ? 'button' : 'none'}
    >
      {/* Ambient background decoration */}
      <View style={styles.ambientCircle} pointerEvents="none" />

      {/* Centered content */}
      <View style={styles.centerContent}>
        {/* Fire icon with amber glow circle */}
        <View style={styles.fireIconContainer}>
          <MaterialIcons name="local-fire-department" size={64} color={colors.tertiary} />
        </View>

        {/* Streak headline + subtitle */}
        <View style={styles.textGroup}>
          <Text style={[styles.streakHeadline, isEmpty && styles.streakHeadlineEmpty]}>
            {isEmpty ? '0 semanas' : `${currentStreak} semana${currentStreak !== 1 ? 's' : ''}`}
          </Text>
          <Text style={styles.streakSubtitle}>{subtitleText}</Text>
        </View>

        {/* XP badge */}
        {xpProgress.potentialXp > 0 && (
          <View style={styles.xpBadge}>
            <MaterialIcons name="add-circle" size={18} color={colors.tertiary} />
            <Text style={styles.xpText}>+{xpProgress.potentialXp} XP Potencial</Text>
          </View>
        )}
      </View>

      {/* Week calendar section with top divider */}
      <View style={styles.calendarSection}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarTitle}>Semana Atual</Text>
          <Text style={styles.calendarSubtitle}>{daysCompletedThisWeek} de 7 dias</Text>
        </View>
        <WeekProgress
          daysCompleted={daysCompletedThisWeek}
          targetDays={targetFrequency}
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
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(208,166,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    alignItems: 'center',
    gap: 4,
  },
  streakHeadline: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
    lineHeight: 36,
    textAlign: 'center',
  },
  streakHeadlineEmpty: {
    color: colors.onSurfaceVariant,
  },
  streakSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.onSurfaceVariant,
    lineHeight: 24,
    textAlign: 'center',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.tertiaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.tertiary,
    letterSpacing: 0.02 * 14,
  },
  calendarSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(195,198,215,0.3)',
    gap: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    letterSpacing: 0.02 * 14,
  },
  calendarSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.05 * 12,
  },
  errorCard: {
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    fontWeight: '400',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  retryButtonPressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skeletonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerHigh,
  },
  skeletonCounter: {
    width: 64,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
  },
  skeletonBarWrap: {
    width: '100%',
  },
  skeletonBar: {
    width: '100%',
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerHigh,
  },
  skeletonXp: {
    width: 80,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
    alignSelf: 'center',
  },
});
