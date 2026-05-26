import { StyleSheet, Text, View } from 'react-native';
import type { ChallengeStatus, FriendChallenge } from '../types/challenge.types';
import { formatDate } from '../mappers/challengeMapper';

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
  ACTIVE: { backgroundColor: '#E3F9EF', color: '#137A4D' },
  AUDIT: { backgroundColor: '#FFF3D6', color: '#A56600' },
  FINISHED: { backgroundColor: '#EEF2F6', color: '#5D6D7A' },
  DELETED: { backgroundColor: '#FDEBEC', color: '#B32632' },
  COMPLETED: { backgroundColor: '#E3F9EF', color: '#137A4D' },
  CANCELLED: { backgroundColor: '#EEF2F6', color: '#5D6D7A' },
};

export function FriendChallengeCard({ data }: FriendChallengeCardProps) {
  const rankLabel = data.userRankPosition == null ? 'Sem posicao' : `${data.userRankPosition}o lugar`;
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

      <Text selectable style={styles.period}>
        {formatDate(data.startDate)} - {formatDate(data.endDate)}
      </Text>

      <View style={styles.metrics}>
        <Text selectable style={styles.metric}>{data.participantCount} participantes</Text>
        <Text selectable style={styles.metric}>{rankLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#E6ECF5',
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
    color: '#4768D8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    color: '#15263B',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  period: {
    color: '#64768A',
    fontSize: 13,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',
  },
  metric: {
    color: '#34475D',
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
