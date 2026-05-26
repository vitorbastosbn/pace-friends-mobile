import { StyleSheet, Text, View } from 'react-native';
import type { XpProgress } from '../types/streak.types';

interface XpDisplayProps {
  progress: XpProgress;
  completed: boolean;
  lastResult: 'MAINTAINED' | 'BROKEN' | null;
}

export function XpDisplay({ progress, completed, lastResult }: XpDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.value, completed && styles.valueComplete]}>
        +{progress.potentialXp} XP
      </Text>
      <Text style={styles.caption}>
        {lastResult === 'BROKEN'
          ? 'Ofensiva quebrada na ultima semana. Esta semana e uma nova chance.'
          : completed
          ? 'Ofensiva mantida! XP garantido nesta semana.'
          : `Potencial da semana. Se a meta nao for atingida: ${progress.potentialXpIfBroken} XP.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  value: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
    color: '#0D47A1',
  },
  valueComplete: {
    color: '#2E7D32',
  },
  caption: {
    fontSize: 13,
    lineHeight: 19,
    color: '#607D8B',
  },
});
