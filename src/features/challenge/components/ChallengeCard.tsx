import { StyleSheet, Text, View } from 'react-native';
import type { ChallengeProgressResponse, ChallengeStatus } from '../types/challenge.types';
import { daysRemaining, formatDate } from '../mappers/challengeMapper';

interface ChallengeCardProps {
  data: ChallengeProgressResponse;
}

const STATUS_LABEL: Record<ChallengeStatus, string> = {
  ACTIVE: 'Ativo',
  AUDIT: 'Em auditoria',
  FINISHED: 'Finalizado',
  COMPLETED: 'Concluido',
  CANCELLED: 'Cancelado',
};

const BADGE_BG: Record<ChallengeStatus, string> = {
  ACTIVE: '#E3F2FD',
  AUDIT: '#FFF7E6',
  FINISHED: '#F5F5F5',
  COMPLETED: '#E8F5E9',
  CANCELLED: '#F5F5F5',
};

const BADGE_TEXT_COLOR: Record<ChallengeStatus, string> = {
  ACTIVE: '#0D47A1',
  AUDIT: '#F59E0B',
  FINISHED: '#9E9E9E',
  COMPLETED: '#2E7D32',
  CANCELLED: '#9E9E9E',
};

export function ChallengeCard({ data }: ChallengeCardProps) {
  const { title, status, deadline, goalDistanceKm, progressKm, progressPct } = data;
  const days = daysRemaining(deadline);
  const clampedPct = Math.min(100, Math.max(0, progressPct));
  const progressWidth = `${clampedPct}%` as `${number}%`;

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text
          style={styles.title}
          numberOfLines={2}
          accessibilityRole="text"
        >
          {title}
        </Text>
        <StatusBadge status={status} />
      </View>

      {/* Progress bar */}
      <View
        style={styles.progressTrack}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: clampedPct }}
      >
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      {/* Progress label */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {progressKm.toFixed(1)} / {goalDistanceKm.toFixed(1)} km
        </Text>
        <Text style={styles.progressPct}>{clampedPct.toFixed(0)}%</Text>
      </View>

      {/* Deadline */}
      <Text style={styles.deadlineText}>
        {status === 'ACTIVE'
          ? days === 0
            ? 'Prazo: hoje'
            : `${days} dia${days !== 1 ? 's' : ''} restante${days !== 1 ? 's' : ''}`
          : `Prazo: ${formatDate(deadline)}`}
      </Text>
    </View>
  );
}

function StatusBadge({ status }: { status: ChallengeStatus }) {
  return (
    <View
      style={[styles.badge, { backgroundColor: BADGE_BG[status] }]}
      accessibilityLabel={`Status: ${STATUS_LABEL[status]}`}
    >
      <Text style={[styles.badgeText, { color: BADGE_TEXT_COLOR[status] }]}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0D47A1',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EDF5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1A237E',
    lineHeight: 22,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E8EDF5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0D47A1',
    borderRadius: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#37474F',
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D47A1',
  },
  deadlineText: {
    fontSize: 12,
    color: '#78909C',
    fontWeight: '400',
  },
});
