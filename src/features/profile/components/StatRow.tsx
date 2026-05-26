import { StyleSheet, Text, View } from 'react-native';

interface StatRowProps {
  label: string;
  value: string | number;
  accessibilityLabel?: string;
}

export function StatRow({ label, value, accessibilityLabel }: StatRowProps) {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={accessibilityLabel ?? `${label}: ${String(value)}`}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{String(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#546E7A',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D47A1',
  },
});
