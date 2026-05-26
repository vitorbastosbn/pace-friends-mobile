import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';

interface XpLevelCardProps {
  totalXp: number;
  currentLevel: number;
  xpForNextLevel: number | null;
}

export function XpLevelCard({ totalXp, currentLevel, xpForNextLevel }: XpLevelCardProps) {
  const nextLevelCopy = xpForNextLevel
    ? `${Math.max(0, xpForNextLevel - totalXp)} XP para evoluir`
    : 'Nivel maximo alcancado';

  return (
    <View style={styles.card} accessibilityLabel={`Nivel ${currentLevel}, ${totalXp} XP`}>
      <Text style={styles.label}>NIVEL</Text>
      <Text style={styles.level} selectable>
        {currentLevel}
      </Text>
      <Text style={styles.xp} selectable>
        {totalXp.toLocaleString('pt-BR')} XP
      </Text>
      <Text style={styles.next}>{nextLevelCopy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.primaryFixed,
    borderWidth: 1,
    borderColor: colors.primaryFixedDim,
    gap: 5,
  },
  label: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  level: {
    color: colors.primaryDark,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  xp: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  next: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '500',
  },
});
