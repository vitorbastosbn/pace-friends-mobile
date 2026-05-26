import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { CheckInList } from '../components/CheckInList';
import { RankingList } from '../components/RankingList';
import { ChallengeServiceError, friendChallengeService } from '../services/challengeService';
import type { ChallengeDetail, ChallengeStatus, ChallengeType } from '../types/challenge.types';
import { formatDate } from '../mappers/challengeMapper';

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
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backButton, pressed ? styles.pressed : null]}
      >
        <Text style={styles.backLabel}>Voltar</Text>
      </Pressable>

      <View style={styles.heading}>
        <Text style={styles.title}>{detail.title}</Text>
        <View style={styles.status}>
          <Text selectable style={styles.statusLabel}>{STATUS_LABEL[detail.status]}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Informacoes</Text>
        <View style={styles.infoRow}>
          <Text selectable style={styles.infoLabel}>Tipo</Text>
          <Text selectable style={styles.infoValue}>{TYPE_LABEL[detail.challengeType]}</Text>
        </View>
        {detail.goalValue != null ? (
          <View style={styles.infoRow}>
            <Text selectable style={styles.infoLabel}>Meta</Text>
            <Text selectable style={styles.infoValue}>{detail.goalValue}</Text>
          </View>
        ) : null}
        <View style={styles.infoRow}>
          <Text selectable style={styles.infoLabel}>Periodo</Text>
          <Text selectable style={styles.infoValue}>
            {formatDate(detail.startDate)} - {formatDate(detail.endDate)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text selectable style={styles.infoLabel}>Participantes</Text>
          <Text selectable style={styles.infoValue}>
            {detail.participantCount}/{detail.maxParticipants}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {detail.permissions.canCheckIn ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/(app)/challenges/friend/${id}/register-check-in`)}
            style={({ pressed }) => [styles.successButton, pressed ? styles.pressed : null]}
          >
            <Text style={styles.successButtonLabel}>Registrar check-in</Text>
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
        {isActing ? <ActivityIndicator color="#1D4ED8" /> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ranking</Text>
        <RankingList challengeType={detail.challengeType} entries={detail.ranking} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Check-ins</Text>
        <CheckInList
          canReject={detail.permissions.canRejectCheckIns}
          checkIns={detail.checkIns}
          onReject={confirmReject}
        />
      </View>

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
    backgroundColor: '#F5F8FD',
  },
  content: {
    gap: 20,
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  backLabel: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '700',
  },
  heading: {
    gap: 12,
  },
  title: {
    color: '#112238',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  status: {
    alignSelf: 'flex-start',
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: '#EDF3FF',
    borderRadius: 999,
  },
  statusLabel: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5ECF5',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoLabel: {
    color: '#6B7E94',
    fontSize: 13,
  },
  infoValue: {
    color: '#15263B',
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  actions: {
    gap: 10,
  },
  successButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#128252',
  },
  successButtonLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  dangerOutline: {
    alignItems: 'center',
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#D74955',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  dangerLabel: {
    color: '#B32632',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#586D84',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  invite: {
    alignItems: 'center',
    gap: 8,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFF7E6',
  },
  inviteLabel: {
    color: '#786341',
    fontSize: 12,
    fontWeight: '700',
  },
  inviteCode: {
    color: '#9A6500',
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: 4,
  },
  skeleton: {
    borderRadius: 18,
    backgroundColor: '#E6EDF6',
  },
  skeletonTitle: {
    height: 64,
  },
  skeletonCard: {
    height: 148,
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
    backgroundColor: '#F5F8FD',
  },
  errorTitle: {
    color: '#15263B',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: '#667A90',
    fontSize: 14,
    textAlign: 'center',
  },
  primaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#1D4ED8',
  },
  primaryButtonLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.76,
  },
});
