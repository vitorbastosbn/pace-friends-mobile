import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { CheckInList } from '../components/CheckInList';
import { RankingList } from '../components/RankingList';
import { ChallengeServiceError, friendChallengeService } from '../services/challengeService';
import type { ChallengeDetail, ChallengeStatus, ChallengeType } from '../types/challenge.types';
import { formatDate } from '../mappers/challengeMapper';
import { colors } from '../../../theme/colors';

interface FriendChallengeDetailScreenProps {
  id: string;
  token: string;
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
  FINISHED: 'Finalizado',
  DELETED: 'Excluido',
  COMPLETED: 'Concluido',
  CANCELLED: 'Cancelado',
};

const STATUS_BADGE: Record<ChallengeStatus, { backgroundColor: string; color: string }> = {
  ACTIVE: { backgroundColor: colors.secondaryContainer, color: colors.onSecondaryContainer },
  AUDIT: { backgroundColor: colors.tertiaryFixed, color: colors.tertiary },
  FINISHED: { backgroundColor: colors.surfaceContainerHigh, color: colors.onSurfaceVariant },
  DELETED: { backgroundColor: colors.errorContainer, color: colors.error },
  COMPLETED: { backgroundColor: colors.secondaryContainer, color: colors.onSecondaryContainer },
  CANCELLED: { backgroundColor: colors.surfaceContainerHigh, color: colors.onSurfaceVariant },
};

function DetailSkeleton() {
  return (
    <ScrollView
      accessibilityLabel="Carregando detalhe do desafio"
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
    >
      <View style={[styles.skeleton, styles.skeletonTitle]} />
      <View style={[styles.skeleton, styles.skeletonCard]} />
      <View style={[styles.skeleton, styles.skeletonSection]} />
      <View style={[styles.skeleton, styles.skeletonSection]} />
    </ScrollView>
  );
}

export function FriendChallengeDetailScreen({ id, token }: FriendChallengeDetailScreenProps) {
  const router = useRouter();
  const [detail, setDetail] = useState<ChallengeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setDetail(await friendChallengeService.getDetail(token, id));
    } catch (cause) {
      setError(
        cause instanceof ChallengeServiceError
          ? cause.message
          : 'Nao foi possivel carregar este desafio.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  async function performExit(action: 'leave' | 'delete') {
    setIsActing(true);
    try {
      if (action === 'leave') {
        await friendChallengeService.leave(token, id);
      } else {
        await friendChallengeService.delete(token, id);
      }
      router.replace('/(app)/challenges');
    } catch (cause) {
      Alert.alert(
        'Nao foi possivel concluir',
        cause instanceof ChallengeServiceError ? cause.message : 'Tente novamente.'
      );
    } finally {
      setIsActing(false);
    }
  }

  function confirmExit(action: 'leave' | 'delete') {
    const isDelete = action === 'delete';
    Alert.alert(
      isDelete ? 'Excluir desafio?' : 'Sair do desafio?',
      isDelete
        ? 'Esta acao remove o desafio para todos os participantes.'
        : 'Seus check-ins deixam de contar no ranking.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: isDelete ? 'Excluir' : 'Sair',
          style: 'destructive',
          onPress: () => void performExit(action),
        },
      ]
    );
  }

  function confirmReject(checkInId: string) {
    Alert.alert(
      'Rejeitar check-in?',
      'A contribuicao sera removida do ranking.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rejeitar',
          style: 'destructive',
          onPress: async () => {
            try {
              await friendChallengeService.rejectCheckIn(token, id, checkInId);
              await load();
            } catch (cause) {
              Alert.alert(
                'Nao foi possivel rejeitar',
                cause instanceof ChallengeServiceError ? cause.message : 'Tente novamente.'
              );
            }
          },
        },
      ]
    );
  }

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !detail) {
    return (
      <View style={styles.centerState}>
        <Text selectable style={styles.errorTitle}>Erro ao carregar detalhe</Text>
        <Text selectable style={styles.errorText}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => void load()}
          style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.primaryButtonLabel}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed ? styles.pressed : null]}
          hitSlop={8}
        >
          <Text style={styles.backText}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{detail.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_BADGE[detail.status].backgroundColor }]}>
          <Text style={[styles.statusLabel, { color: STATUS_BADGE[detail.status].color }]}>
            {STATUS_LABEL[detail.status]}
          </Text>
        </View>
      </View>

      {/* Hero card */}
      <View style={styles.heroCard}>
        <View style={styles.heroGrid}>
          <View style={styles.heroCell}>
            <Text style={styles.heroCellLabel}>Tipo</Text>
            <Text style={styles.heroCellValue}>{TYPE_LABEL[detail.challengeType]}</Text>
          </View>
          <View style={[styles.heroCell, styles.heroCellRight]}>
            <Text style={styles.heroCellLabel}>Periodo</Text>
            <Text style={styles.heroCellValue}>
              {formatDate(detail.startDate)} — {formatDate(detail.endDate)}
            </Text>
          </View>
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.participantsRow}>
          <Text style={styles.participantsLabel}>Participantes</Text>
          <Text style={styles.participantsValue}>
            {detail.participantCount}
            <Text style={styles.participantsMax}>/{detail.maxParticipants}</Text>
          </Text>
        </View>
        {detail.goalValue != null ? (
          <View style={styles.participantsRow}>
            <Text style={styles.participantsLabel}>Meta</Text>
            <Text style={styles.participantsValue}>{detail.goalValue}</Text>
          </View>
        ) : null}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {detail.permissions.canCheckIn ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/(app)/challenges/friend/${id}/register-check-in`)}
            style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
          >
            <Text style={styles.primaryButtonLabel}>Registrar check-in</Text>
          </Pressable>
        ) : null}
        {detail.permissions.canLeave ? (
          <Pressable
            accessibilityRole="button"
            disabled={isActing}
            onPress={() => confirmExit('leave')}
            style={({ pressed }) => [styles.dangerOutline, pressed ? styles.pressed : null]}
          >
            <Text style={styles.dangerLabel}>Sair do desafio</Text>
          </Pressable>
        ) : null}
        {detail.permissions.canDelete ? (
          <Pressable
            accessibilityRole="button"
            disabled={isActing}
            onPress={() => confirmExit('delete')}
            style={({ pressed }) => [styles.dangerOutline, pressed ? styles.pressed : null]}
          >
            <Text style={styles.dangerLabel}>Excluir desafio</Text>
          </Pressable>
        ) : null}
        {isActing ? <ActivityIndicator color={colors.primary} /> : null}
      </View>

      {/* Ranking */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Classificacao</Text>
          <Text style={styles.seeAll}>Ver todos</Text>
        </View>
        <RankingList challengeType={detail.challengeType} entries={detail.ranking} />
      </View>

      {/* Check-ins */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Check-ins Recentes</Text>
        <CheckInList
          canReject={detail.permissions.canRejectCheckIns}
          checkIns={detail.checkIns}
          onReject={confirmReject}
        />
      </View>

      {/* Invite code */}
      {detail.userRole === 'CREATOR' ? (
        <View style={styles.invite}>
          <Text style={styles.inviteLabel}>Codigo para convidar amigos</Text>
          <Text selectable style={styles.inviteCode}>{detail.inviteCode}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: 24,
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  backText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '400',
    lineHeight: 32,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 32,
  },
  statusBadge: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexShrink: 0,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.05,
  },
  heroCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 24,
    shadowColor: colors.onSurface,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 16,
  },
  heroGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  heroCell: {
    flex: 1,
    gap: 4,
  },
  heroCellRight: {
    alignItems: 'flex-end',
  },
  heroCellLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.05,
  },
  heroCellValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    letterSpacing: 0.02,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(195, 198, 215, 0.3)',
  },
  participantsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    letterSpacing: 0.02,
  },
  participantsValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 28,
  },
  participantsMax: {
    color: colors.onSurfaceVariant,
    fontWeight: '400',
    fontSize: 16,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  primaryButtonLabel: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.02,
  },
  dangerOutline: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: colors.error,
    borderRadius: 12,
  },
  dangerLabel: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.02,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 28,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    letterSpacing: 0.05,
  },
  invite: {
    alignItems: 'center',
    gap: 8,
    padding: 24,
    borderRadius: 12,
    backgroundColor: colors.tertiaryFixed,
  },
  inviteLabel: {
    color: colors.tertiary,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.05,
  },
  inviteCode: {
    color: colors.tertiary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 6,
  },
  skeleton: {
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerHigh,
  },
  skeletonTitle: {
    height: 64,
  },
  skeletonCard: {
    height: 160,
  },
  skeletonSection: {
    height: 128,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 28,
    backgroundColor: colors.background,
  },
  errorTitle: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.76,
  },
});
