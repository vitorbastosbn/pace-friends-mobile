import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CheckIn } from '../types/challenge.types';
import { formatDate } from '../mappers/challengeMapper';
import { colors } from '../../../theme/colors';

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
            <View style={styles.avatarWrapper}>
              <Text style={styles.avatarEmoji}>🏃</Text>
            </View>
            <View style={styles.info}>
              <Text selectable style={styles.name}>{checkIn.participantName}</Text>
              <Text selectable style={styles.meta}>
                {checkIn.distanceKm.toFixed(1)} km · {formatDate(checkIn.date)}
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
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    shadowColor: colors.onSurface,
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.02,
  },
  meta: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.05,
  },
  rejectButton: {
    borderWidth: 1.5,
    borderColor: colors.error,
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  rejectLabel: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.02,
  },
  removed: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  empty: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
});
