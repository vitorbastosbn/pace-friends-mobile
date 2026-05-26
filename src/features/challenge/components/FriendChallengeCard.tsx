import { StyleSheet, Text, View } from 'react-native';
import type { ChallengeStatus, FriendChallenge } from '../types/challenge.types';
import { formatDate } from '../mappers/challengeMapper';
import { colors } from '../../../theme/colors';

interface FriendChallengeCardProps {
  data: FriendChallenge;
}

const STATUS_LABEL: Record<ChallengeStatus, string> = {
  ACTIVE: 'Ativo',
  AUDIT: 'Em auditoria',
  FINISHED: 'Finalizado',
  DELETED: 'Excluido',
  COMPLETED: 'Concluido',
  CANCELLED: 'Cancelado',
};

const STATUS_TONE: Record<ChallengeStatus, { backgroundColor: string; color: string }> = {
  ACTIVE: { backgroundColor: colors.secondaryContainer, color: colors.onSecondaryContainer },
  AUDIT: { backgroundColor: colors.tertiaryFixed, color: colors.tertiary },
  FINISHED: { backgroundColor: colors.surfaceContainerHigh, color: colors.onSurfaceVariant },
  DELETED: { backgroundColor: colors.errorContainer, color: colors.error },
  COMPLETED: { backgroundColor: colors.secondaryContainer, color: colors.onSecondaryContainer },
  CANCELLED: { backgroundColor: colors.surfaceContainerHigh, color: colors.onSurfaceVariant },
};

export function FriendChallengeCard({ data }: FriendChallengeCardProps) {
  const rankLabel = data.userRankPosition == null ? 'Sem posicao' : `${data.userRankPosition}º lugar`;
  const tone = STATUS_TONE[data.status];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text selectable style={styles.type}>Entre amigos</Text>
          <Text selectable numberOfLines={2} style={styles.title}>{data.title}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: tone.backgroundColor }]}>
          <Text selectable style={[styles.badgeText, { color: tone.color }]}>
            {STATUS_LABEL[data.status]}
          </Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Posicao</Text>
          <Text style={styles.metricValue}>{rankLabel}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Participantes</Text>
          <Text style={styles.metricValue}>{data.participantCount}</Text>
        </View>
      </View>

      <Text selectable style={styles.period}>
        {formatDate(data.startDate)} — {formatDate(data.endDate)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
    padding: 24,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.3)',
    shadowColor: colors.onSurface,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleGroup: {
    flex: 1,
    gap: 4,
  },
  type: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  title: {
    color: colors.onSurface,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  badge: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.05,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.05,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 28,
  },
  period: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '400',
  },
});
