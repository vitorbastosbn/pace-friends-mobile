import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

interface WeekProgressProps {
  daysCompleted: number;
  targetDays: number;
}

const DAY_LABELS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

export function WeekProgress({ daysCompleted, targetDays }: WeekProgressProps) {
  return (
    <View style={styles.container} accessibilityRole="none">
      {DAY_LABELS.map((label, index) => {
        const filled = index < daysCompleted;
        return (
          <View key={index} style={styles.dayColumn}>
            <Text style={styles.dayLabel}>{label}</Text>
            <View
              style={[styles.dayCircle, filled ? styles.dayCircleFilled : styles.dayCircleEmpty]}
              accessibilityLabel={`Dia ${index + 1}: ${filled ? 'completo' : 'pendente'}`}
            >
              {filled && (
                <MaterialIcons name="check" size={20} color={colors.onPrimary} />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.05 * 12,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleFilled: {
    backgroundColor: colors.primary,
    shadowColor: '#081C34',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayCircleEmpty: {
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
  },
});
