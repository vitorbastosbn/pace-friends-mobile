import { StyleSheet, Text, View } from 'react-native';
import type {
  ChallengeProgressResponse,
  ChallengeStatus,
  FriendChallenge,
  IndividualChallenge,
} from '../types/challenge.types';
import { daysRemaining, formatDate } from '../mappers/challengeMapper';
import { FriendChallengeCard } from './FriendChallengeCard';
import { colors } from '../../../theme/colors';

interface ChallengeCardProps {
  data: ChallengeProgressResponse | IndividualChallenge | FriendChallenge;
}

const STATUS_LABEL: Record<ChallengeStatus, string> = {
  ACTIVE: 'Ativo',
  AUDIT: 'Em auditoria',
  FINISHED: 'Finalizado',
  DELETED: 'Excluido',
  COMPLETED: 'Concluido',
  CANCELLED: 'Cancelado',
};

const BADGE_BG: Record<ChallengeStatus, string> = {
  ACTIVE: colors.secondaryContainer,
  AUDIT: colors.tertiaryFixed,
  FINISHED: colors.surfaceContainerHigh,
  DELETED: colors.errorContainer,
  COMPLETED: colors.secondaryContainer,
  CANCELLED: colors.surfaceContainerHigh,
};

const BADGE_TEXT_COLOR: Record<ChallengeStatus, string> = {
  ACTIVE: colors.onSecondaryContainer,
  AUDIT: colors.tertiary,
  FINISHED: colors.onSurfaceVariant,
  DELETED: colors.error,
  COMPLETED: colors.onSecondaryContainer,
  CANCELLED: colors.onSurfaceVariant,
};

export function ChallengeCard({ data }: ChallengeCardProps) {
  if ('userRole' in data) {
    return <FriendChallengeCard data={data} />;
  }

  const { title, status, deadline, goalDistanceKm, progressKm, progressPct } = data;
  const days = daysRemaining(deadline);
  const clampedPct = Math.min(100, Math.max(0, progressPct));
  const progressWidth = `${clampedPct}%` as `${number}%`;

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.iconWrapper}>
          <Text style={styles.iconEmoji}>🏃</Text>
        </View>
        <View style={styles.titleGroup}>
          <Text style={styles.title} numberOfLines={2} accessibilityRole="text">
            {title}
          </Text>
          <Text style={styles.subtitle}>Meta individual de quilometragem</Text>
        </View>
        <StatusBadge status={status} />
      </View>

      {/* Progress info */}
      <View style={styles.progressHeader}>
        <Text style={styles.progressPct}>{clampedPct.toFixed(0)}% completo</Text>
        <Text style={styles.progressText}>
          {progressKm.toFixed(1)} / {goalDistanceKm.toFixed(1)} km
        </Text>
      </View>

      {/* Progress bar */}
      <View
        style={styles.progressTrack}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: clampedPct }}
      >
        <View style={[styles.progressFill, { width: progressWidth }]} />
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
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 24,
    shadowColor: colors.onSurface,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.3)',
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconEmoji: {
    fontSize: 24,
  },
  titleGroup: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.05,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.05,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  progressPct: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.02,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.05,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  deadlineText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontWeight: '400',
  },
});
