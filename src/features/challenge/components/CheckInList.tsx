import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CheckIn } from '../types/challenge.types';
import { formatDate } from '../mappers/challengeMapper';

interface CheckInListProps {
  checkIns: CheckIn[];
  canReject: boolean;
  onReject: (id: string) => void;
}

export function CheckInList({ checkIns, canReject, onReject }: CheckInListProps) {
  if (checkIns.length === 0) {
    return <Text selectable style={styles.empty}>Nenhum check-in registrado ainda.</Text>;
  }

  return (
    <View style={styles.list}>
      {checkIns.map((checkIn) => {
        const removed = checkIn.status === 'REMOVED_BY_CREATOR';
        return (
          <View key={checkIn.id} style={styles.row}>
            <View style={styles.info}>
              <Text selectable style={styles.name}>{checkIn.participantName}</Text>
              <Text selectable style={styles.meta}>
                {checkIn.distanceKm.toFixed(1)} km - {formatDate(checkIn.date)}
              </Text>
            </View>
            {removed ? (
              <Text selectable style={styles.removed}>Rejeitado</Text>
            ) : canReject ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Rejeitar check-in de ${checkIn.participantName}`}
                onPress={() => onReject(checkIn.id)}
                style={({ pressed }) => [styles.rejectButton, pressed ? styles.pressed : null]}
              >
                <Text style={styles.rejectLabel}>Rejeitar</Text>
              </Pressable>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#E7EDF5',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: '#15263B',
    fontSize: 14,
    fontWeight: '700',
  },
  meta: {
    color: '#718397',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: '#D44351',
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  rejectLabel: {
    color: '#B32632',
    fontSize: 12,
    fontWeight: '700',
  },
  removed: {
    color: '#B32632',
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  empty: {
    color: '#718397',
    fontSize: 14,
    lineHeight: 20,
  },
});
