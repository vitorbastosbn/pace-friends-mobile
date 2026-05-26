import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';

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
    backgroundColor: colors.tertiaryFixed,
    borderWidth: 1,
    borderColor: colors.tertiaryFixed,
    gap: 6,
  },
  pressed: {
    opacity: 0.86,
  },
  label: {
    color: colors.tertiary,
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
    color: colors.tertiary,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    color: colors.tertiary,
    fontSize: 15,
    fontWeight: '600',
  },
  message: {
    color: colors.tertiary,
    fontSize: 13,
    fontWeight: '500',
  },
});
