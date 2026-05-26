import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';

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
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: `rgba(195, 198, 215, 0.3)`,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.02 * 14,
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  track: {
    height: 12,
    backgroundColor: `rgba(195, 198, 215, 0.3)`,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.secondaryFixedDim,
    borderRadius: 6,
    shadowColor: 'rgba(95, 222, 151, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
});
