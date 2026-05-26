import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TrailProgressBarProps {
  completedItems: number;
  totalItems: number;
}

export function TrailProgressBar({ completedItems, totalItems }: TrailProgressBarProps) {
  const pct = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Progresso da trilha</Text>
        <Text style={styles.count}>
          {completedItems}/{totalItems} itens
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#546E7A',
    letterSpacing: 0.5,
  },
  count: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D47A1',
  },
  track: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#16a766',
    borderRadius: 5,
  },
});
