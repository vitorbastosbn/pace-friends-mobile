import { StyleSheet, Text, View } from 'react-native';
import type { ActivityResponse } from '../types/challenge.types';
import { formatDate, formatPace } from '../mappers/challengeMapper';
import { colors } from '../../../theme/colors';

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
      <View style={styles.iconWrapper}>
        <Text style={styles.iconEmoji}>🏃</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.activityName} accessibilityLabel={`Corrida em ${date}`}>
            Corrida
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>DISTANCIA</Text>
            <Text style={styles.statValue}>{activity.distanceKm.toFixed(2)} km</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>PACE</Text>
            <Text style={styles.statValue}>{pace}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>TEMPO</Text>
            <Text style={styles.statValue}>{durationLabel}</Text>
          </View>
        </View>
        {activity.notes ? (
          <Text style={styles.notes} numberOfLines={2} accessibilityLabel={`Notas: ${activity.notes}`}>
            {activity.notes}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    shadowColor: colors.onSurface,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.1)',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(46, 106, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconEmoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    letterSpacing: 0.02,
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.05,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.05,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    letterSpacing: 0.02,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.outlineVariant,
  },
  notes: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
