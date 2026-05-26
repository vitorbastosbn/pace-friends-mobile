import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';
import { WeekProgress } from '../../streak/components/WeekProgress';

interface WeeklyFrequencyCardProps {
  daysTrained: number;
  goal: number;
}

export function WeeklyFrequencyCard({ daysTrained, goal }: WeeklyFrequencyCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <Text selectable style={styles.title}>Semana Atual</Text>
        <Text selectable style={styles.subtitle}>{daysTrained} de 7 dias</Text>
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
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    letterSpacing: 0.28,
    lineHeight: 20,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    fontVariant: ['tabular-nums'],
  },
});
