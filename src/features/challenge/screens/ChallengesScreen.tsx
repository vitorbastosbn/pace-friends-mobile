import { useCallback, useLayoutEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { ChallengeCard } from '../components/ChallengeCard';
import { JoinByCodeModal } from '../components/JoinByCodeModal';
import { useChallengeOverview } from '../hooks/useChallengeOverview';
import { colors } from '../../../theme/colors';
import type { FriendChallenge, IndividualChallenge } from '../types/challenge.types';

interface ChallengesScreenProps {
  token: string;
}

export function ChallengesScreen({ token }: ChallengesScreenProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const { individualChallenge, friendChallenges, isLoading, error, reload } =
    useChallengeOverview(token);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={headerStyles.row}>
          <Pressable
            onPress={() => router.push('/(app)/challenges/history')}
            style={headerStyles.iconButton}
            accessibilityLabel="Histórico de desafios"
            accessibilityRole="button"
            hitSlop={8}
          >
            <MaterialIcons name="history" size={24} color={colors.onSurfaceVariant} />
          </Pressable>
          <Pressable
            onPress={() => setIsJoinOpen(true)}
            style={headerStyles.iconButton}
            accessibilityLabel="Entrar por código QR"
            accessibilityRole="button"
            hitSlop={8}
          >
            <MaterialIcons name="qr-code-scanner" size={24} color={colors.onSurfaceVariant} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, router, setIsJoinOpen]);

  const activeChallenges: (IndividualChallenge | FriendChallenge)[] = [
    ...(individualChallenge ? [individualChallenge] : []),
    ...friendChallenges.filter((c) => c.status === 'ACTIVE'),
  ];

  const hasAnyChallenges =
    individualChallenge !== null || friendChallenges.length > 0;

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <SkeletonBlock height={148} style={styles.mb12} />
          <SkeletonBlock height={180} style={styles.mb12} />
        </ScrollView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <MaterialIcons name="error-outline" size={48} color={colors.onSurfaceVariant} />
        <Text style={styles.errorTitle}>Não foi possível carregar</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => void reload()}
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Active challenges */}
        <View style={styles.section}>
          {activeChallenges.length > 0 ? (
            activeChallenges.map((challenge) => (
              <Pressable
                key={challenge.id}
                accessibilityLabel={`Abrir desafio ${challenge.title}`}
                accessibilityRole="button"
                onPress={() => {
                  if ('userRole' in challenge) {
                    router.push(`/(app)/challenges/friend/${challenge.id}`);
                  } else {
                    router.push(`/(app)/challenges/${challenge.id}`);
                  }
                }}
                style={({ pressed }) => pressed ? styles.pressed : null}
              >
                <ChallengeCard data={challenge} />
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <MaterialIcons
                name="emoji-events"
                size={40}
                color={colors.outlineVariant}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>Nenhum desafio ativo</Text>
              <Text style={styles.emptyText}>
                Crie um desafio entre amigos ou entre com um código para começar.
              </Text>
            </View>
          )}
        </View>

        {/* Archived section (non-active friend challenges) */}
        {hasAnyChallenges && friendChallenges.some((c) => c.status !== 'ACTIVE') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Arquivados</Text>
            {friendChallenges
              .filter((c) => c.status !== 'ACTIVE')
              .map((challenge) => (
                <Pressable
                  key={challenge.id}
                  accessibilityLabel={`Abrir desafio ${challenge.title}`}
                  accessibilityRole="button"
                  onPress={() => router.push(`/(app)/challenges/friend/${challenge.id}`)}
                  style={({ pressed }) => pressed ? styles.pressed : null}
                >
                  <ChallengeCard data={challenge} />
                </Pressable>
              ))}
          </View>
        )}

        {/* Bottom padding for FAB */}
        <View style={styles.fabSpacer} />
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push('/(app)/challenges/create')}
        accessibilityLabel="Criar novo desafio"
        accessibilityRole="button"
      >
        <MaterialIcons name="add" size={28} color={colors.onPrimary} />
      </Pressable>

      <JoinByCodeModal
        onClose={() => setIsJoinOpen(false)}
        onJoined={() => void reload()}
        token={token}
        visible={isJoinOpen}
      />
    </View>
  );
}

function SkeletonBlock({
  height,
  width = '100%',
  style,
}: {
  height: number;
  width?: number | string;
  style?: object;
}) {
  return (
    <View
      style={[
        { height, width: width as number, borderRadius: 12, backgroundColor: colors.surfaceContainerHigh },
        style,
      ]}
      accessible={false}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 24,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 28,
  },
  // Section
  section: {
    gap: 16,
  },
  // Empty state
  emptyCard: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10233B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  fabPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.95 }],
  },
  fabSpacer: {
    height: 56,
  },
  // Error
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    height: 52,
    paddingHorizontal: 32,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  pressed: {
    opacity: 0.75,
  },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
});

const headerStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
