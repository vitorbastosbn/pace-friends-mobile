import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { StreakData } from '../types/streak.types';
import { WeekProgress } from './WeekProgress';

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

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && onPress && styles.cardPressed]}
      onPress={onPress}
      accessibilityLabel={accessLabel}
      accessibilityRole={onPress ? 'button' : 'none'}
    >
      <View style={styles.headerRow}>
        <View style={styles.streakBlock}>
          <Text style={styles.fireEmoji}>{isEmpty ? '🔥' : '🔥'}</Text>
          <Text style={[styles.streakCount, isEmpty && styles.streakCountEmpty]}>
            {currentStreak}
          </Text>
          <Text style={styles.streakLabel}>
            {currentStreak === 1 ? 'semana' : 'semanas'}
          </Text>
        </View>

        {xpProgress.potentialXp > 0 && (
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{xpProgress.potentialXp} XP</Text>
          </View>
        )}
      </View>

      <WeekProgress
        daysCompleted={daysCompletedThisWeek}
        targetDays={targetFrequency}
      />

      {isEmpty ? (
        <Text style={styles.emptyHint}>Comece hoje e inicie sua ofensiva!</Text>
      ) : remainingDays > 0 ? (
        <Text style={styles.remainingText}>
          Faltam {remainingDays} dia{remainingDays !== 1 ? 's' : ''} para completar a semana
        </Text>
      ) : (
        <Text style={styles.completedText}>Semana completa! Continue assim!</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0D47A1',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    gap: 12,
  },
  cardPressed: {
    backgroundColor: '#F0F4FF',
  },
  errorCard: {
    alignItems: 'center',
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  fireEmoji: {
    fontSize: 24,
    lineHeight: 28,
  },
  streakCount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0D47A1',
    lineHeight: 36,
  },
  streakCountEmpty: {
    color: '#78909C',
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#78909C',
  },
  xpBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D47A1',
    letterSpacing: 0.3,
  },
  emptyHint: {
    fontSize: 13,
    color: '#78909C',
    textAlign: 'center',
    fontWeight: '400',
  },
  remainingText: {
    fontSize: 13,
    color: '#546E7A',
    textAlign: 'center',
    fontWeight: '400',
  },
  completedText: {
    fontSize: 13,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
    fontWeight: '400',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0D47A1',
  },
  retryButtonPressed: {
    backgroundColor: '#E3F2FD',
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D47A1',
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
    backgroundColor: '#E8EDF5',
  },
  skeletonCounter: {
    width: 64,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E8EDF5',
  },
  skeletonBarWrap: {
    width: '100%',
  },
  skeletonBar: {
    width: '100%',
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8EDF5',
  },
  skeletonXp: {
    width: 80,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E8EDF5',
    alignSelf: 'center',
  },
});
