import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useChallengeHistory } from '../hooks/useChallengeHistory';
import { FriendChallengeCard } from '../components/FriendChallengeCard';
import { colors } from '../../../theme/colors';
import type { FriendChallenge } from '../types/challenge.types';

interface ChallengeHistoryScreenProps {
  token: string;
}

export function ChallengeHistoryScreen({ token }: ChallengeHistoryScreenProps) {
  const router = useRouter();
  const { items, isLoading, isLoadingMore, error, hasNext, loadMore, reload } =
    useChallengeHistory(token);

  const renderItem = useCallback(
    ({ item }: { item: FriendChallenge }) => (
      <Pressable
        onPress={() => router.push(`/(app)/challenges/friend/${item.id}`)}
        style={({ pressed }) => [styles.itemWrapper, pressed && styles.pressed]}
        accessibilityLabel={`Abrir desafio ${item.title}`}
        accessibilityRole="button"
      >
        <FriendChallengeCard data={item} />
      </Pressable>
    ),
    [router]
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isLoadingMore]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyState}>
        <MaterialIcons name="history" size={48} color={colors.outlineVariant} />
        <Text style={styles.emptyTitle}>Sem histórico ainda</Text>
        <Text style={styles.emptyText}>
          Desafios finalizados ou encerrados aparecerão aqui.
        </Text>
      </View>
    );
  }, [isLoading]);

  if (error && items.length === 0) {
    return (
      <View style={styles.safeArea}>
        <View style={styles.centered}>
          <MaterialIcons name="error-outline" size={48} color={colors.onSurfaceVariant} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            onPress={reload}
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  itemWrapper: {},
  pressed: { opacity: 0.75 },
  footerLoader: { paddingVertical: 20, alignItems: 'center' },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  errorText: { fontSize: 15, color: colors.error, textAlign: 'center' },
  retryButton: {
    height: 52,
    paddingHorizontal: 32,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonPressed: { backgroundColor: colors.primaryDark },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onPrimary,
  },
});
