import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChallengeCard } from '../components/ChallengeCard';
import { JoinByCodeModal } from '../components/JoinByCodeModal';
import { useChallengeOverview } from '../hooks/useChallengeOverview';
import type { FriendChallenge } from '../types/challenge.types';
import { colors } from '../../../theme/colors';

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
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.seeAll}>Ver todos</Text>
      </View>
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
        {/* Header */}
        <View style={styles.hero}>
          <Text style={styles.title}>Desafios</Text>
          <Text selectable style={styles.subtitle}>
            Evolua sozinho ou dispute com seus amigos.
          </Text>
        </View>

        {/* Action buttons */}
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

        {/* Individual section */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Individual</Text>
            {!individualChallenge ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/(app)/challenges/create')}
              >
                <Text style={styles.seeAll}>Criar</Text>
              </Pressable>
            ) : (
              <Text style={styles.seeAll}>Ver todos</Text>
            )}
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

        {/* Social sections */}
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
    backgroundColor: colors.background,
  },
  content: {
    gap: 32,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  hero: {
    gap: 12,
  },
  title: {
    color: colors.onSurface,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    minHeight: 56,
  },
  primaryButtonLabel: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.02,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLowest,
    minHeight: 56,
  },
  secondaryButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.02,
  },
  section: {
    gap: 16,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.onSurface,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  seeAll: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.05,
  },
  emptyCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceContainerLow,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLowest,
  },
  emptyText: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
  skeleton: {
    height: 126,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerHigh,
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
    backgroundColor: colors.background,
  },
  errorTitle: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingBottom: 6,
  },
  pressed: {
    opacity: 0.75,
  },
});
