import { useRef, useEffect, useCallback } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import type { FriendChallengeResponse } from '../types/challenge.types';
import { useFriendChallenges } from '../hooks/useFriendChallenges';
import { FriendChallengeCard } from '../components/FriendChallengeCard';

interface ChallengesScreenProps {
  token: string;
  userId?: string;
}

export function ChallengesScreen({ token }: ChallengesScreenProps) {
  const router = useRouter();
  const { challenges, loadState, loadError, reload } = useFriendChallenges(token);
  const isLoading = loadState === 'loading';
  const error = loadError;
  const shimmerAnim = useRef(new Animated.Value(0.4)).current;

  useFocusEffect(
    useCallback(() => {
      if (token) reload();
    }, [token, reload])
  );

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      shimmerAnim.stopAnimation();
      shimmerAnim.setValue(1);
    }
  }, [isLoading, shimmerAnim]);

  function renderHeader() {
    return (
      <View style={styles.listHeader}>
        <Text style={styles.sectionLabel}>
          {challenges.length > 0
            ? `${challenges.length} desafio${challenges.length !== 1 ? 's' : ''}`
            : ''}
        </Text>
      </View>
    );
  }

  function renderItem({ item }: { item: FriendChallengeResponse }) {
    return (
      <Pressable
        onPress={() => router.push(`/(app)/challenges/friend/${item.id}`)}
        accessibilityRole="button"
        accessibilityLabel={`Abrir desafio: ${item.title}`}
      >
        <FriendChallengeCard data={item} />
      </Pressable>
    );
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nenhum desafio com amigos</Text>
        <Text style={styles.emptySubtitle}>
          Crie um desafio ou entre por codigo!
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.emptyButton,
            pressed && styles.emptyButtonPressed,
          ]}
          onPress={() => router.push('/(app)/challenges/friend-create')}
          accessibilityLabel="Criar desafio com amigos"
          accessibilityRole="button"
        >
          <Text style={styles.emptyButtonText}>Criar desafio</Text>
        </Pressable>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle} accessibilityRole="header">
            Desafios
          </Text>
          <View style={styles.headerActions}>
            <Pressable
              style={({ pressed }) => [
                styles.newButton,
                pressed && styles.newButtonPressed,
              ]}
              onPress={() => router.push('/(app)/challenges/friend-create')}
              accessibilityLabel="Novo desafio"
              accessibilityRole="button"
            >
              <Text style={styles.newButtonText}>+ Novo</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.joinButton,
                pressed && styles.joinButtonPressed,
              ]}
              onPress={() => router.push('/(app)/challenges/join')}
              accessibilityLabel="Entrar em desafio"
              accessibilityRole="button"
            >
              <Text style={styles.joinButtonText}>Entrar</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text
            style={styles.errorText}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {error}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.retryButtonPressed,
            ]}
            onPress={reload}
            accessibilityLabel="Tentar novamente"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle} accessibilityRole="header">
            Desafios
          </Text>
        </View>
        <View style={styles.scrollContent}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[styles.skeletonCard, { opacity: shimmerAnim }]}
              accessible={false}
            />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Desafios
        </Text>
        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              styles.newButton,
              pressed && styles.newButtonPressed,
            ]}
            onPress={() => router.push('/(app)/challenges/friend-create')}
            accessibilityLabel="Novo desafio"
            accessibilityRole="button"
          >
            <Text style={styles.newButtonText}>+ Novo</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.joinButton,
              pressed && styles.joinButtonPressed,
            ]}
            onPress={() => router.push('/(app)/challenges/join')}
            accessibilityLabel="Entrar em desafio"
            accessibilityRole="button"
          >
            <Text style={styles.joinButtonText}>Entrar</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.scrollContent,
          challenges.length === 0 && styles.scrollContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF5',
    backgroundColor: '#F8FAFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D47A1',
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  newButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#0D47A1',
    borderRadius: 20,
  },
  newButtonPressed: {
    backgroundColor: '#0A3880',
  },
  newButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  joinButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#3a73ff',
    borderRadius: 20,
  },
  joinButtonPressed: {
    backgroundColor: '#2a60e0',
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listHeader: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78909C',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  scrollContentEmpty: {
    flex: 1,
  },
  skeletonCard: {
    height: 120,
    backgroundColor: '#E0E8F0',
    borderRadius: 14,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#37474F',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#78909C',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: '#0D47A1',
    borderRadius: 12,
  },
  emptyButtonPressed: {
    backgroundColor: '#0A3880',
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  errorText: {
    fontSize: 15,
    color: '#D32F2F',
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#0D47A1',
    borderRadius: 12,
  },
  retryButtonPressed: {
    backgroundColor: '#0A3880',
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
