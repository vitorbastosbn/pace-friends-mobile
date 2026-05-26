import { StyleSheet, Text, View } from 'react-native';
import type { ActivityResponse } from '../types/challenge.types';
import { formatDate, formatPace } from '../mappers/challengeMapper';

interface ActivityItemProps {
  activity: ActivityResponse;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const pace = formatPace(activity.paceSecondsPerKm);
  const date = formatDate(activity.activityDate);
  const durationMin = Math.floor(activity.durationSeconds / 60);
  const durationSec = activity.durationSeconds % 60;
  const durationLabel = `${durationMin}:${durationSec.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.date} accessibilityLabel={`Data: ${date}`}>
            {date}
          </Text>
          {activity.notes ? (
            <Text
              style={styles.notes}
              numberOfLines={2}
              accessibilityLabel={`Notas: ${activity.notes}`}
            >
              {activity.notes}
            </Text>
          ) : null}
        </View>
        <View style={styles.right}>
          <Text style={styles.distance}>
            {activity.distanceKm.toFixed(2)} km
          </Text>
          <Text style={styles.pace}>{pace}</Text>
          <Text style={styles.duration}>{durationLabel} min</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  left: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 2,
  },
  notes: {
    fontSize: 12,
    color: '#78909C',
    fontStyle: 'italic',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  distance: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D47A1',
  },
  pace: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
    marginTop: 2,
  },
  duration: {
    fontSize: 12,
    color: '#78909C',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F4F8',
    marginHorizontal: 16,
  },
});
