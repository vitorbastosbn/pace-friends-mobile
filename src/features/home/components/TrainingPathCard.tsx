import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { HomeSummary } from '../types/home.types';
import { colors } from '../../../theme/colors';

interface TrainingPathCardProps {
  trainingPath: HomeSummary['trainingPath'];
  onPress: () => void;
}

export function TrainingPathCard({ trainingPath, onPress }: TrainingPathCardProps) {
  if (!trainingPath.available) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, styles.emptyCard, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Comece sua trilha"
      >
        <Text style={styles.label}>TRILHA</Text>
        <Text style={styles.title}>Comece sua trilha!</Text>
        <Text style={styles.description}>
          Descubra desafios para evoluir no seu ritmo.
        </Text>
      </Pressable>
    );
  }

  const progressPercent = trainingPath.progressPercent ?? 0;
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir trilha, ${progressPercent} por cento concluida`}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>TRILHA ATUAL</Text>
          <Text style={styles.title}>{trainingPath.currentLevel}</Text>
        </View>
        <Text style={styles.percent} selectable>
          {progressPercent}%
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progressPercent}%` }]} />
      </View>
      <Text style={styles.description}>Toque para ver seus proximos passos.</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondaryContainerLight,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.secondaryContainerLight,
    gap: 13,
  },
  emptyCard: {
    backgroundColor: colors.surfaceContainer,
    borderColor: colors.outlineVariant,
  },
  pressed: {
    opacity: 0.86,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 5,
  },
  title: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: '700',
  },
  percent: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.secondaryContainerLight,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: colors.secondary,
  },
  description: {
    color: colors.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 18,
  },
});
