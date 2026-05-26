import { StyleSheet, Text, View } from 'react-native';

interface WeeklyFrequencyCardProps {
  daysTrained: number;
  goal: number;
}

export function WeeklyFrequencyCard({ daysTrained, goal }: WeeklyFrequencyCardProps) {
  const progress = goal > 0 ? Math.min(100, Math.round((daysTrained / goal) * 100)) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.label}>FREQUENCIA SEMANAL</Text>
          <Text style={styles.title}>Sua meta desta semana</Text>
        </View>
        <Text style={styles.counter} selectable>
          {daysTrained}/{goal} dias
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.hint}>
        {daysTrained >= goal
          ? 'Meta concluida. Excelente semana!'
          : `Faltam ${goal - daysTrained} treino(s) para sua meta.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6ECF5',
    gap: 14,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 5,
  },
  title: {
    color: '#172554',
    fontSize: 16,
    fontWeight: '700',
  },
  counter: {
    color: '#0D47A1',
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#E8EEF9',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#16A766',
    borderRadius: 6,
  },
  hint: {
    color: '#526273',
    fontSize: 13,
  },
});
