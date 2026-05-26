import { Pressable, StyleSheet, Text, View } from 'react-native';

interface StreakCardProps {
  currentStreak: number;
  onPress: () => void;
}

export function StreakCard({ currentStreak, onPress }: StreakCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ofensiva atual: ${currentStreak} dias. Abrir detalhes.`}
    >
      <Text style={styles.label}>OFENSIVA</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value} selectable>
          {currentStreak}
        </Text>
        <Text style={styles.unit}>dias</Text>
      </View>
      <Text style={styles.message}>
        {currentStreak > 0 ? 'Continue firme!' : 'Comece hoje!'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFF4E5',
    borderWidth: 1,
    borderColor: '#FFD8A8',
    gap: 6,
  },
  pressed: {
    opacity: 0.86,
  },
  label: {
    color: '#C05621',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  value: {
    color: '#9A3412',
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    color: '#C05621',
    fontSize: 15,
    fontWeight: '600',
  },
  message: {
    color: '#9A3412',
    fontSize: 13,
    fontWeight: '500',
  },
});
