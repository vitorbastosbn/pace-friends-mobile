import { StyleSheet, Text, View } from 'react-native';

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
    backgroundColor: '#E8F1FF',
    borderWidth: 1,
    borderColor: '#C7D9FF',
    gap: 5,
  },
  label: {
    color: '#3159B8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  level: {
    color: '#123B8D',
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  xp: {
    color: '#123B8D',
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  next: {
    color: '#526A98',
    fontSize: 12,
    fontWeight: '500',
  },
});
