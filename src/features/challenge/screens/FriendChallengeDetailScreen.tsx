import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ChallengeServiceError,
  deleteFriendChallenge,
  getChallengeRanking,
  getCheckIns,
  getFriendChallengeDetail,
  leaveFriendChallenge,
  rejectCheckIn,
} from '../services/challengeService';
import type {
  CheckInWithUserNameResponse,
  ChallengeType,
  FriendChallengeResponse,
  ParticipantResponse,
  RankingEntry,
  RankingResponse,
} from '../types/challenge.types';

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

function formatDateBR(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

function formatJoinedAt(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  } catch {
    return isoStr;
  }
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await Share.share({ message: text, title: 'Codigo de convite' });
  } catch {
    Alert.alert('Codigo', text);
  }
}

function formatScore(challengeType: ChallengeType, score: number): string {
  switch (challengeType) {
    case 'DISTANCE':
      return `${score.toFixed(1)} km`;
    case 'ACTIVITY_TIME': {
      const totalMin = Math.round(score / 60);
      if (totalMin < 60) return `${totalMin}min`;
      const hours = Math.floor(totalMin / 60);
      const mins = totalMin % 60;
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    case 'PACE': {
      const totalSec = Math.round(score);
      const min = Math.floor(totalSec / 60);
      const sec = totalSec % 60;
      return `${min}:${sec.toString().padStart(2, '0')}/km`;
    }
    case 'CHECK_IN':
      return `${Math.round(score)} dia${score !== 1 ? 's' : ''}`;
  }
}

const MEDAL_COLOR: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

export function FriendChallengeDetailScreen({ id, token }: FriendChallengeDetailScreenProps) {
  const router = useRouter();
  const [challenge, setChallenge] = useState<FriendChallengeResponse | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'success' | 'error'>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [ranking, setRanking] = useState<RankingResponse | null>(null);
  const [rankingState, setRankingState] = useState<'loading' | 'success' | 'error' | 'empty'>('loading');
  const [checkIns, setCheckIns] = useState<CheckInWithUserNameResponse[]>([]);
  const [checkInsState, setCheckInsState] = useState<'loading' | 'success' | 'error' | 'empty'>('loading');
  const [destructiveActionPending, setDestructiveActionPending] = useState(false);

  const load = useCallback(async () => {
    setLoadState('loading');
    setLoadError(null);
    setRankingState('loading');
    setCheckInsState('loading');
    try {
      const [data, rankingData] = await Promise.all([
        getFriendChallengeDetail(token, id),
        getChallengeRanking(token, id).catch(() => null),
      ]);
      setChallenge(data);
      setLoadState('success');
      if (rankingData) {
        setRanking(rankingData);
        setRankingState(rankingData.entries.length === 0 ? 'empty' : 'success');
      } else {
        setRankingState('error');
      }
      if (data.status === 'AUDIT' && data.myRole === 'CREATOR') {
        try {
          const checkInsData = await getCheckIns(token, id);
          setCheckIns(checkInsData);
          setCheckInsState(checkInsData.length === 0 ? 'empty' : 'success');
        } catch {
          setCheckInsState('error');
        }
      } else {
        setCheckInsState('empty');
      }
    } catch (err) {
      const message =
        err instanceof ChallengeServiceError
          ? err.message
          : 'Erro ao carregar desafio.';
      setLoadError(message);
      setLoadState('error');
      setRankingState('error');
      setCheckInsState('error');
    }
  }, [token, id]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  if (loadState === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
            <Text style={styles.backText}>{'<'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Desafio</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0D47A1" accessibilityLabel="Carregando desafio" />
        </View>
      </SafeAreaView>
    );
  }

  if (loadState === 'error' || !challenge) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
            <Text style={styles.backText}>{'<'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Desafio</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.center}>
          <Text style={styles.errorText}>{loadError}</Text>
          <Pressable style={styles.retryButton} onPress={() => void load()}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const { title, challengeType, goalValue, startDate, endDate, status, inviteCode, participantCount, maxParticipants, participants, myRole } = challenge;

  async function runDestructiveAction(action: 'leave' | 'delete') {
    setDestructiveActionPending(true);
    try {
      if (action === 'leave') {
        await leaveFriendChallenge(token, id);
      } else {
        await deleteFriendChallenge(token, id);
      }
      router.back();
    } catch (err) {
      const message =
        err instanceof ChallengeServiceError
          ? err.message
          : 'Nao foi possivel concluir esta acao.';
      Alert.alert('Erro', message);
      void load();
    } finally {
      setDestructiveActionPending(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text style={styles.backText}>{'<'}</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Check-in button */}
        {status === 'ACTIVE' && (
          <Pressable
            style={({ pressed }) => [styles.checkInButton, pressed && styles.checkInButtonPressed]}
            onPress={() => router.push(`/(app)/challenges/friend/${id}/register-check-in`)}
            accessibilityLabel="Registrar check-in"
            accessibilityRole="button"
          >
            <Text style={styles.checkInButtonText}>Registrar check-in</Text>
          </Pressable>
        )}

        {/* Info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo</Text>
            <Text style={styles.infoValue}>{TYPE_LABEL[challengeType]}</Text>
          </View>
          {goalValue != null && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Meta</Text>
              <Text style={styles.infoValue}>{goalValue}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Periodo</Text>
            <Text style={styles.infoValue}>
              {formatDateBR(startDate)} - {formatDateBR(endDate)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[
              styles.infoValue,
              status === 'ACTIVE' ? styles.statusActive :
              status === 'AUDIT' ? styles.statusAudit :
              status === 'DELETED' ? styles.statusDeleted :
              styles.statusInactive,
            ]}>
              {status === 'ACTIVE' ? 'Ativo' :
               status === 'AUDIT' ? 'Em auditoria' :
               status === 'DELETED' ? 'Excluido' : 'Finalizado'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Participantes</Text>
            <Text style={styles.infoValue}>{participantCount}/{maxParticipants}</Text>
          </View>
        </View>

        {status === 'ACTIVE' && myRole === 'MEMBER' && (
          <Pressable
            style={({ pressed }) => [styles.leaveButton, pressed && styles.destructiveButtonPressed]}
            disabled={destructiveActionPending}
            accessibilityRole="button"
            accessibilityLabel="Sair do desafio"
            onPress={() => {
              Alert.alert(
                'Sair do desafio',
                'Seus check-ins deixarao de contar no ranking. Se entrar novamente, voce comecara do zero.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Sair', style: 'destructive', onPress: () => void runDestructiveAction('leave') },
                ]
              );
            }}
          >
            <Text style={styles.leaveButtonText}>Sair do desafio</Text>
          </Pressable>
        )}

        {myRole === 'CREATOR' && status !== 'DELETED' && (
          <Pressable
            style={({ pressed }) => [styles.deleteButton, pressed && styles.destructiveButtonPressed]}
            disabled={destructiveActionPending}
            accessibilityRole="button"
            accessibilityLabel="Excluir desafio"
            onPress={() => {
              Alert.alert(
                'Excluir desafio',
                'Este desafio desaparecera para todos e nao podera ser recuperado.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Excluir', style: 'destructive', onPress: () => void runDestructiveAction('delete') },
                ]
              );
            }}
          >
            <Text style={styles.deleteButtonText}>Excluir desafio</Text>
          </Pressable>
        )}

        {/* Ranking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ranking</Text>
          {rankingState === 'loading' && (
            <View style={styles.rankingCenter}>
              <ActivityIndicator size="small" color="#3a73ff" accessibilityLabel="Carregando ranking" />
            </View>
          )}
          {rankingState === 'error' && (
            <View style={styles.rankingCenter}>
              <Text style={styles.rankingErrorText}>Nao foi possivel carregar o ranking.</Text>
            </View>
          )}
          {rankingState === 'empty' && (
            <View style={styles.rankingCenter}>
              <Text style={styles.rankingEmptyText}>Nenhum check-in registrado ainda.</Text>
            </View>
          )}
          {rankingState === 'success' && ranking && ranking.entries.map((entry: RankingEntry) => {
            const medalColor = MEDAL_COLOR[entry.position];
            const isTopThree = entry.position <= 3;
            return (
              <View
                key={entry.userId}
                style={[
                  styles.rankingRow,
                  isTopThree && styles.rankingRowTopThree,
                  isTopThree && { borderLeftColor: medalColor },
                ]}
              >
                <View style={[styles.rankingPosition, isTopThree && { backgroundColor: medalColor }]}>
                  <Text style={[styles.rankingPositionText, isTopThree && styles.rankingPositionTextTopThree]}>
                    {entry.position}
                  </Text>
                </View>
                <View style={styles.rankingInfo}>
                  <Text style={styles.rankingName}>{entry.name}</Text>
                  <Text style={styles.rankingCheckIns}>{entry.checkInCount} check-in{entry.checkInCount !== 1 ? 's' : ''}</Text>
                </View>
                <Text style={[styles.rankingScore, isTopThree && { color: '#16a766' }]}>
                  {formatScore(challengeType, entry.score)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Audit section */}
        {status === 'AUDIT' && myRole === 'CREATOR' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Auditoria</Text>
            {checkInsState === 'loading' && (
              <View style={styles.rankingCenter}>
                <ActivityIndicator size="small" color="#3a73ff" accessibilityLabel="Carregando check-ins" />
              </View>
            )}
            {checkInsState === 'error' && (
              <View style={styles.rankingCenter}>
                <Text style={styles.rankingErrorText}>Nao foi possivel carregar os check-ins.</Text>
              </View>
            )}
            {checkInsState === 'empty' && (
              <View style={styles.rankingCenter}>
                <Text style={styles.rankingEmptyText}>Nenhum check-in para auditar.</Text>
              </View>
            )}
            {checkInsState === 'success' && checkIns.map((checkIn: CheckInWithUserNameResponse) => (
              <View key={checkIn.id} style={styles.auditRow}>
                <View style={styles.auditInfo}>
                  <Text style={styles.auditUserName}>{checkIn.userName}</Text>
                  <Text style={styles.auditMeta}>
                    {formatDateBR(checkIn.checkInDate)} · {formatScore('DISTANCE', checkIn.distanceKm)}
                  </Text>
                </View>
                {checkIn.status === 'REJECTED' ? (
                  <View style={styles.rejectedTag}>
                    <Text style={styles.rejectedTagText}>Rejeitado</Text>
                  </View>
                ) : (
                  <Pressable
                    style={({ pressed }) => [styles.rejectButton, pressed && styles.rejectButtonPressed]}
                    accessibilityLabel={`Rejeitar check-in de ${checkIn.userName}`}
                    accessibilityRole="button"
                    onPress={() => {
                      Alert.alert(
                        'Rejeitar check-in',
                        `Tem certeza que deseja rejeitar este check-in de ${checkIn.userName}?`,
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          {
                            text: 'Rejeitar',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                const updated = await rejectCheckIn(token, id, checkIn.id);
                                setCheckIns((prev) =>
                                  prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
                                );
                                setRankingState('loading');
                                try {
                                  const updatedRanking = await getChallengeRanking(token, id);
                                  setRanking(updatedRanking);
                                  setRankingState(updatedRanking.entries.length === 0 ? 'empty' : 'success');
                                } catch {
                                  setRankingState('error');
                                }
                              } catch (err) {
                                const msg =
                                  err instanceof ChallengeServiceError
                                    ? err.message
                                    : 'Erro ao rejeitar check-in.';
                                Alert.alert('Erro', msg);
                              }
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.rejectButtonText}>Rejeitar</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Invite code */}
        <View style={styles.inviteCard}>
          <Text style={styles.inviteCardLabel}>Codigo de convite</Text>
          <Text style={styles.inviteCodeText}>{inviteCode}</Text>
          <Pressable
            style={({ pressed }) => [styles.copyButton, pressed && styles.copyButtonPressed]}
            onPress={() => void copyToClipboard(inviteCode)}
            accessibilityLabel="Copiar codigo de convite"
            accessibilityRole="button"
          >
            <Text style={styles.copyButtonText}>Compartilhar codigo</Text>
          </Pressable>
        </View>

        {/* Participants */}
        {participants && participants.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Participantes</Text>
            {participants.map((p: ParticipantResponse) => (
              <View key={p.userId} style={styles.participantRow}>
                <View style={styles.participantInfo}>
                  <Text style={styles.participantName}>{p.name}</Text>
                  <Text style={styles.participantRole}>
                    {p.role === 'CREATOR' ? 'Criador' : 'Membro'}
                  </Text>
                </View>
                <Text style={styles.participantDate}>{formatJoinedAt(p.joinedAt)}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF5',
    backgroundColor: '#F8FAFF',
  },
  backButton: { minWidth: 48, minHeight: 48, alignItems: 'flex-start', justifyContent: 'center' },
  backText: { fontSize: 22, color: '#0D47A1', fontWeight: '600' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: '#0D47A1' },
  headerSpacer: { minWidth: 48 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8EDF5',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: { fontSize: 13, color: '#78909C', fontWeight: '600' },
  infoValue: { fontSize: 14, color: '#263238', fontWeight: '700' },
  statusActive: { color: '#16a766' },
  statusAudit: { color: '#F59E0B' },
  statusDeleted: { color: '#C62828' },
  statusInactive: { color: '#9E9E9E' },
  inviteCard: {
    backgroundColor: '#FFFDE7',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF176',
  },
  inviteCardLabel: { fontSize: 12, color: '#78909C', fontWeight: '600', marginBottom: 8 },
  inviteCodeText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 6,
    marginBottom: 16,
    fontVariant: ['tabular-nums'],
  },
  copyButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  copyButtonPressed: { backgroundColor: '#D97706' },
  copyButtonText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78909C',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  participantRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E8EDF5',
  },
  participantInfo: { flex: 1 },
  participantName: { fontSize: 14, fontWeight: '700', color: '#263238' },
  participantRole: { fontSize: 12, color: '#78909C', marginTop: 2 },
  participantDate: { fontSize: 12, color: '#B0BEC5' },
  errorText: { fontSize: 15, color: '#D32F2F', textAlign: 'center', marginBottom: 16 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#0D47A1', borderRadius: 10 },
  retryText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  checkInButton: {
    backgroundColor: '#16a766',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  checkInButtonPressed: { backgroundColor: '#128a53' },
  checkInButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  leaveButton: {
    borderWidth: 1,
    borderColor: '#C62828',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 16,
  },
  leaveButtonText: { fontSize: 14, fontWeight: '700', color: '#C62828' },
  deleteButton: {
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#C62828',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteButtonText: { fontSize: 14, fontWeight: '700', color: '#C62828' },
  destructiveButtonPressed: { opacity: 0.7 },
  rankingRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EDF5',
    borderLeftWidth: 1,
  },
  rankingRowTopThree: {
    borderLeftWidth: 4,
  },
  rankingPosition: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8EDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankingPositionText: { fontSize: 13, fontWeight: '700', color: '#546E7A' },
  rankingPositionTextTopThree: { color: '#FFFFFF' },
  rankingInfo: { flex: 1 },
  rankingName: { fontSize: 14, fontWeight: '700', color: '#263238' },
  rankingCheckIns: { fontSize: 12, color: '#78909C', marginTop: 2 },
  rankingScore: { fontSize: 14, fontWeight: '800', color: '#3a73ff' },
  rankingCenter: { alignItems: 'center', paddingVertical: 16 },
  rankingErrorText: { fontSize: 13, color: '#D32F2F' },
  rankingEmptyText: { fontSize: 13, color: '#78909C' },
  auditRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8EDF5',
  },
  auditInfo: { flex: 1 },
  auditUserName: { fontSize: 14, fontWeight: '700', color: '#263238' },
  auditMeta: { fontSize: 12, color: '#78909C', marginTop: 2 },
  rejectedTag: {
    backgroundColor: '#FDECEC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rejectedTagText: { fontSize: 12, color: '#C62828', fontWeight: '700' },
  rejectButton: {
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rejectButtonPressed: { backgroundColor: '#FDECEC' },
  rejectButtonText: { fontSize: 12, color: '#C62828', fontWeight: '700' },
});
