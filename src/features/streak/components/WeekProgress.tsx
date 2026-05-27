import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

interface WeekProgressProps {
  daysCompleted: number;
  targetDays: number;
  filledColor?: string;
  labelPosition?: 'top' | 'bottom';
}

const DAY_LABELS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

export function WeekProgress({
  daysCompleted,
  targetDays,
  filledColor = colors.secondary,
  labelPosition = 'bottom',
}: WeekProgressProps) {
  return (
    <View style={styles.container} accessibilityRole="none">
      {DAY_LABELS.map((dayLabel, index) => {
        const filled = index < daysCompleted;
        return (
          <View key={index} style={styles.dayColumn}>
            {labelPosition === 'top' && (
              <Text style={styles.dayLabel}>{dayLabel}</Text>
            )}
            <View
              style={[
                styles.dayCircle,
                filled ? styles.dayCircleFilled : styles.dayCircleEmpty,
                filled ? { backgroundColor: filledColor } : undefined,
              ]}
              accessibilityLabel={`Dia ${index + 1}: ${filled ? 'completo' : 'pendente'}`}
            >
              {filled && (
                <MaterialIcons name="check" size={20} color={colors.onPrimary} />
              )}
            </View>
            {labelPosition === 'bottom' && (
              <Text style={styles.dayLabel}>{dayLabel}</Text>
            )}
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
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.6,
  },
  dayCircle: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  dayCircleFilled: {
    backgroundColor: colors.secondary,
    elevation: 2,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dayCircleEmpty: {
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: colors.outlineVariant,
    borderWidth: 2,
  },
});
