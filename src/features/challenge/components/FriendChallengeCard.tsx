import { StyleSheet, Text, View } from 'react-native';
import type { ChallengeStatus, ChallengeType, FriendChallengeResponse, ParticipantRole } from '../types/challenge.types';

interface FriendChallengeCardProps {
  data: FriendChallengeResponse;
}

const TYPE_LABEL: Record<ChallengeType, string> = {
  DISTANCE: 'Distancia',
  ACTIVITY_TIME: 'Tempo',
  PACE: 'Pace',
  CHECK_IN: 'Check-ins',
};

const STATUS_LABEL: Record<ChallengeStatus, string> = {
  ACTIVE: 'Ativo',
  AUDIT: 'Em auditoria',
  FINISHED: 'Encerrado',
  COMPLETED: 'Encerrado',
  CANCELLED: 'Cancelado',
};

const STATUS_BG: Record<ChallengeStatus, string> = {
  ACTIVE: '#E3F9EF',
  AUDIT: '#FFF7E6',
  FINISHED: '#F5F5F5',
  COMPLETED: '#F5F5F5',
  CANCELLED: '#F5F5F5',
};

const STATUS_TEXT_COLOR: Record<ChallengeStatus, string> = {
  ACTIVE: '#16a766',
  AUDIT: '#F59E0B',
  FINISHED: '#9E9E9E',
  COMPLETED: '#9E9E9E',
  CANCELLED: '#9E9E9E',
};

function formatDateBR(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function FriendChallengeCard({ data }: FriendChallengeCardProps) {
  const {
    title,
    challengeType,
    participantCount,
    maxParticipants,
    endDate,
    status,
    myRole,
    inviteCode,
  } = data;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={[styles.badge, { backgroundColor: STATUS_BG[status] }]}>
          <Text style={[styles.badgeText, { color: STATUS_TEXT_COLOR[status] }]}>
            {STATUS_LABEL[status]}
          </Text>
        </View>
      </View>

      <Text style={styles.typeLabel}>{TYPE_LABEL[challengeType]}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {participantCount}/{maxParticipants} participantes
        </Text>
        <Text style={styles.metaText}>ate {formatDateBR(endDate)}</Text>
      </View>

      {myRole === 'CREATOR' && (
        <View style={styles.inviteRow}>
          <Text style={styles.inviteLabel}>Codigo de convite</Text>
          <Text style={styles.inviteCode}>{inviteCode}</Text>
        </View>
      )}
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
    marginBottom: 6,
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
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3a73ff',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#78909C',
    fontWeight: '500',
  },
  inviteRow: {
    marginTop: 10,
    backgroundColor: '#FFFDE7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inviteLabel: {
    fontSize: 11,
    color: '#78909C',
    fontWeight: '600',
  },
  inviteCode: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
});
