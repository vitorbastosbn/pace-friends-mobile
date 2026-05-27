import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { XpProgress } from '../types/streak.types';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

interface XpDisplayProps {
  progress: XpProgress;
  completed: boolean;
  lastResult: 'MAINTAINED' | 'BROKEN' | null;
  targetFrequency: number;
  daysCompletedThisWeek: number;
}

export function XpDisplay({
  progress,
  completed,
  lastResult,
  targetFrequency,
  daysCompletedThisWeek,
}: XpDisplayProps) {
  const progressRatio =
    targetFrequency > 0 ? Math.min(daysCompletedThisWeek / targetFrequency, 1) : 0;
  const progressPercent = Math.round(progressRatio * 100);

  const captionText =
    lastResult === 'BROKEN'
      ? 'Ofensiva quebrada na última semana. Esta semana é uma nova chance.'
      : completed
      ? 'Ofensiva mantida! XP garantido nesta semana.'
      : `Só falta mais ${targetFrequency - daysCompletedThisWeek} dia${
          targetFrequency - daysCompletedThisWeek !== 1 ? 's' : ''
        } para bater sua meta!`;

  return (
    <View style={styles.card}>
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

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` as `${number}%` }]} />
      </View>

      <Text style={styles.caption}>{captionText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    gap: 12,
    padding: 24,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(125,251,177,0.2)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerText: {
    gap: 2,
  },
  title: {
    color: colors.onSurface,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    letterSpacing: 0.28,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  percentage: {
    color: colors.onSurface,
    fontFamily: fonts.displaySemiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  progressTrack: {
    backgroundColor: 'rgba(195,198,215,0.3)',
    borderRadius: 6,
    height: 12,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    backgroundColor: colors.secondary,
    borderRadius: 6,
    height: '100%',
  },
  caption: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.6,
  },
});
