import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';
import { WeekProgress } from '../../streak/components/WeekProgress';

const BADGE_BG = 'rgba(125, 251, 177, 0.30)';

interface WeeklyFrequencyCardProps {
  daysTrained: number;
  goal: number;
}

export function WeeklyFrequencyCard({ daysTrained, goal }: WeeklyFrequencyCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <Text selectable style={styles.title}>Frequência Semanal</Text>
        <View style={styles.badge}>
          <Text selectable style={styles.badgeText}>{daysTrained}/{goal} dias</Text>
        </View>
      </View>
      <WeekProgress daysCompleted={daysTrained} targetDays={goal} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.20)',
    boxShadow: '0 4px 12px rgba(16, 35, 59, 0.06)',
    gap: 16,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: colors.onSurface,
    fontFamily: fonts.displaySemiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  badge: {
    backgroundColor: BADGE_BG,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.secondary,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    fontVariant: ['tabular-nums'],
    lineHeight: 20,
  },
});
