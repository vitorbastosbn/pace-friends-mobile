import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ChallengeStatus, FriendChallenge } from '../types/challenge.types';
import { colors } from '../../../theme/colors';

interface FriendChallengeCardProps {
  data: FriendChallenge;
}

const STATUS_LABEL: Record<ChallengeStatus, string> = {
  ACTIVE: 'Ativo',
  AUDIT: 'Em auditoria',
  FINISHED: 'Finalizado',
  DELETED: 'Excluído',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

const STATUS_TONE: Record<ChallengeStatus, { bg: string; text: string }> = {
  ACTIVE: { bg: colors.secondaryContainer, text: colors.onSecondaryContainer },
  AUDIT: { bg: colors.tertiaryFixed, text: colors.tertiary },
  FINISHED: { bg: colors.surfaceContainerHigh, text: colors.onSurfaceVariant },
  DELETED: { bg: colors.errorContainer, text: colors.error },
  COMPLETED: { bg: colors.secondaryContainer, text: colors.onSecondaryContainer },
  CANCELLED: { bg: colors.surfaceContainerHigh, text: colors.onSurfaceVariant },
};

const RANK_ICON_COLOR: Record<number, string> = {
  1: '#D0A600',
  2: '#9E9E9E',
  3: '#CD7F32',
};

function RankLabel({ position }: { position: number | null }) {
  if (position === null) {
    return <Text style={styles.metricValue}>—</Text>;
  }
  const iconColor = RANK_ICON_COLOR[position] ?? colors.onSurfaceVariant;
  return (
    <View style={styles.rankRow}>
      {position <= 3 && (
        <MaterialIcons name="workspace-premium" size={20} color={iconColor} />
      )}
      <Text style={styles.metricValue}>{position}º lugar</Text>
    </View>
  );
}

function ParticipantDots({ count }: { count: number }) {
  const visible = Math.min(count, 3);
  const extra = count - visible;
  const dotColors = [colors.primaryContainer, colors.secondaryContainer, colors.tertiaryFixed];

  return (
    <View style={styles.avatarStack}>
      {Array.from({ length: visible }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.avatarDot,
            { backgroundColor: dotColors[i % dotColors.length], marginLeft: i === 0 ? 0 : -8 },
          ]}
        />
      ))}
      {extra > 0 && (
        <View style={[styles.avatarDot, styles.avatarDotExtra, { marginLeft: -8 }]}>
          <Text style={styles.avatarDotExtraText}>+{extra}</Text>
        </View>
      )}
    </View>
  );
}

export function FriendChallengeCard({ data }: FriendChallengeCardProps) {
  const tone = STATUS_TONE[data.status];

  return (
    <View style={styles.card}>
      {/* Status badge absolute */}
      <View style={styles.badge}>
        <Text style={[styles.badgeText, { backgroundColor: tone.bg, color: tone.text }]}>
          {STATUS_LABEL[data.status]}
        </Text>
      </View>

      {/* Type row + title */}
      <View style={styles.topSection}>
        <View style={styles.typeRow}>
          <MaterialIcons name="group" size={14} color={colors.primary} />
          <Text style={styles.typeText}>ENTRE AMIGOS</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {data.title}
        </Text>
      </View>

      {/* Stats grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Posição</Text>
          <RankLabel position={data.userRankPosition} />
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Participantes</Text>
          <Text style={styles.metricValue}>
            {data.participantCount}/{data.maxParticipants}
          </Text>
        </View>
      </View>

      {/* Footer: avatar dots + ver ranking */}
      <View style={styles.footer}>
        <ParticipantDots count={data.participantCount} />
        <View style={styles.rankingLink}>
          <Text style={styles.rankingLinkText}>Ver Ranking</Text>
          <MaterialIcons name="chevron-right" size={18} color={colors.primary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#10233B',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.3)',
    gap: 16,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.05,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  topSection: {
    gap: 4,
    paddingRight: 72,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 28,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 8,
    padding: 12,
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
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
  },
  avatarDotExtra: {
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDotExtraText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
  },
  rankingLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rankingLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.02,
  },
});
