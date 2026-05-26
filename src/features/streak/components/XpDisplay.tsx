import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { XpProgress } from '../types/streak.types';
import { colors } from '../../../theme/colors';

interface XpDisplayProps {
  progress: XpProgress;
  completed: boolean;
  lastResult: 'MAINTAINED' | 'BROKEN' | null;
  targetFrequency: number;
  daysCompletedThisWeek: number;
}

export function XpDisplay({ progress, completed, lastResult, targetFrequency, daysCompletedThisWeek }: XpDisplayProps) {
  const progressRatio = targetFrequency > 0 ? Math.min(daysCompletedThisWeek / targetFrequency, 1) : 0;
  const progressPercent = Math.round(progressRatio * 100);

  const captionText = lastResult === 'BROKEN'
    ? 'Ofensiva quebrada na ultima semana. Esta semana e uma nova chance.'
    : completed
    ? 'Ofensiva mantida! XP garantido nesta semana.'
    : `So falta mais ${targetFrequency - daysCompletedThisWeek} dia${targetFrequency - daysCompletedThisWeek !== 1 ? 's' : ''} para bater sua meta!`;

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="flag" size={24} color={colors.secondary} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Meta Semanal</Text>
            <Text style={styles.subtitle}>{targetFrequency} dias por semana</Text>
          </View>
        </View>
        <Text style={styles.percentage}>{progressPercent}%</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` as `${number}%` }]} />
      </View>

      {/* Caption */}
      <Text style={styles.caption}>{captionText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.surfaceContainerLow,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(125,251,177,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    letterSpacing: 0.02 * 14,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },
  percentage: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 28,
  },
  progressTrack: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(195,198,215,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 6,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.05 * 12,
  },
});
