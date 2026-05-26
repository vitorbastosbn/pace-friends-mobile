import { StyleSheet, Text, View } from 'react-native';

interface WeekProgressProps {
  daysCompleted: number;
  targetDays: number;
}

export function WeekProgress({ daysCompleted, targetDays }: WeekProgressProps) {
  const isComplete = daysCompleted >= targetDays;

  return (
    <View style={styles.container} accessibilityRole="none">
      <View style={styles.bubblesRow}>
        {Array.from({ length: targetDays }).map((_, index) => {
          const filled = index < daysCompleted;
          const bubbleColor = filled
            ? isComplete
              ? '#2E7D32'
              : '#0D47A1'
            : '#FDE8E8';

          return (
            <View
              key={index}
              style={[styles.bubble, { backgroundColor: bubbleColor }]}
              accessibilityLabel={`Dia ${index + 1}: ${filled ? 'completo' : 'pendente'}`}
            />
          );
        })}
      </View>
      <Text style={[styles.label, !isComplete && styles.labelRisk, isComplete && styles.labelComplete]}>
        {daysCompleted}/{targetDays} dias
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  bubblesRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D47A1',
  },
  labelComplete: {
    color: '#2E7D32',
  },
  labelRisk: {
    color: '#C62828',
  },
});
