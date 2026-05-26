import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChallengeCard } from '../components/ChallengeCard';
import { JoinByCodeModal } from '../components/JoinByCodeModal';
import { useChallengeOverview } from '../hooks/useChallengeOverview';
import type { FriendChallenge } from '../types/challenge.types';

interface ChallengesScreenProps {
  token: string;
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.emptyCard}>
      <Text selectable style={styles.emptyText}>{message}</Text>
    </View>
  );
}

function FriendSection({
  title,
  emptyMessage,
  challenges,
  onOpen,
}: {
  title: string;
  emptyMessage: string;
  challenges: FriendChallenge[];
  onOpen: (id: string) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {challenges.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        challenges.map((challenge) => (
          <Pressable
            accessibilityLabel={`Abrir desafio ${challenge.title}`}
            accessibilityRole="button"
            key={challenge.id}
            onPress={() => onOpen(challenge.id)}
            style={({ pressed }) => pressed ? styles.pressed : null}
          >
            <ChallengeCard data={challenge} />
          </Pressable>
        ))
      )}
    </View>
  );
}

export function ChallengesScreen({ token }: ChallengesScreenProps) {
  const router = useRouter();
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const { individualChallenge, friendChallenges, isLoading, error, reload } =
    useChallengeOverview(token);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload])
  );

  const created = friendChallenges.filter((challenge) => challenge.userRole === 'CREATOR');
  const participating = friendChallenges.filter((challenge) => challenge.userRole === 'MEMBER');

  if (isLoading) {
    return (
      <ScrollView
        accessibilityLabel="Carregando desafios"
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.screen}
      >
        <View style={[styles.skeleton, styles.skeletonHeader]} />
        <View style={styles.skeleton} />
        <View style={styles.skeleton} />
        <View style={styles.skeleton} />
      </ScrollView>
    );
  }

  if (error) {
    return (
      <View style={styles.centerState}>
        <Text selectable style={styles.errorTitle}>Nao foi possivel carregar seus desafios</Text>
        <Text selectable style={styles.errorText}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => void reload()}
          style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.primaryButtonLabel}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.screen}
      >
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.title}>Desafios</Text>
            <Text selectable style={styles.subtitle}>
              Evolua sozinho ou dispute com seus amigos.
            </Text>
          </View>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/(app)/challenges/friend-create')}
              style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
            >
              <Text style={styles.primaryButtonLabel}>Criar desafio</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setIsJoinOpen(true)}
              style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}
            >
              <Text style={styles.secondaryButtonLabel}>Entrar por codigo</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Individual</Text>
            {!individualChallenge ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/(app)/challenges/create')}
              >
                <Text style={styles.inlineAction}>Criar</Text>
              </Pressable>
            ) : null}
          </View>
          {individualChallenge ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(`/(app)/challenges/${individualChallenge.id}`)}
              style={({ pressed }) => pressed ? styles.pressed : null}
            >
              <ChallengeCard data={individualChallenge} />
            </Pressable>
          ) : (
            <EmptyState message="Voce ainda nao possui um desafio individual ativo." />
          )}
        </View>

        <FriendSection
          challenges={created}
          emptyMessage="Nenhum desafio criado por voce."
          onOpen={(id) => router.push(`/(app)/challenges/friend/${id}`)}
          title="Criados por mim"
        />
        <FriendSection
          challenges={participating}
          emptyMessage="Voce ainda nao participa de desafios com amigos."
          onOpen={(id) => router.push(`/(app)/challenges/friend/${id}`)}
          title="Participo"
        />
      </ScrollView>

      <JoinByCodeModal
        onClose={() => setIsJoinOpen(false)}
        onJoined={() => void reload()}
        token={token}
        visible={isJoinOpen}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F8FD',
  },
  content: {
    gap: 26,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
  },
  hero: {
    gap: 20,
  },
  heroCopy: {
    gap: 6,
  },
  title: {
    color: '#10233B',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#60758B',
    fontSize: 15,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#1D4ED8',
  },
  primaryButtonLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#D6E0ED',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonLabel: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    gap: 12,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#586D84',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  inlineAction: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E9F3',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    color: '#718398',
    fontSize: 14,
    lineHeight: 20,
  },
  skeleton: {
    height: 126,
    borderRadius: 18,
    backgroundColor: '#E6EDF6',
  },
  skeletonHeader: {
    height: 88,
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
    textAlign: 'center',
  },
  errorText: {
    color: '#667A90',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingBottom: 6,
  },
  pressed: {
    opacity: 0.75,
  },
});
