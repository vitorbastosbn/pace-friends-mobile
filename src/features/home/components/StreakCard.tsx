import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

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
      accessibilityLabel={`Ofensiva atual: ${currentStreak} semanas. Abrir detalhes.`}
    >
      <View style={styles.header}>
        <Text selectable style={styles.label}>OFENSIVA</Text>
        <MaterialIcons name="local-fire-department" size={20} color="#FF6D00" />
      </View>
      <View style={styles.body}>
        <View style={styles.valueRow}>
          <Text selectable style={styles.valueNumber}>{currentStreak}</Text>
          <Text selectable style={styles.valueUnit}>
            {currentStreak === 1 ? 'semana' : 'semanas'}
          </Text>
        </View>
        <Text selectable style={styles.message}>
          {currentStreak > 0 ? 'Foco total!' : 'Comece hoje!'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 148,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.20)',
    boxShadow: '0 4px 12px rgba(16, 35, 59, 0.06)',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.86,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 0.7,
  },
  body: {
    gap: 3,
  },
  valueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 4,
  },
  valueNumber: {
    color: colors.onSurface,
    fontFamily: fonts.displayBold,
    fontSize: 44,
    lineHeight: 52,
    fontVariant: ['tabular-nums'],
  },
  valueUnit: {
    color: colors.onSurface,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 24,
  },
  message: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 11,
    lineHeight: 16,
  },
});
