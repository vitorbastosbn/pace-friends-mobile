import { useRef, useEffect } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import type { ActivityResponse } from '../types/challenge.types';
import { useChallengeDetail } from '../hooks/useChallengeDetail';
import { ChallengeCard } from '../components/ChallengeCard';
import { ActivityItem } from '../components/ActivityItem';
import { colors } from '../../../theme/colors';

interface ChallengeDetailScreenProps {
  token: string;
  challengeId: string;
}

export function ChallengeDetailScreen({
  token,
  challengeId,
}: ChallengeDetailScreenProps) {
  const router = useRouter();
  const { detail, activities, isLoading, error, reload } = useChallengeDetail(
    token,
    challengeId
  );
  const shimmerAnim = useRef(new Animated.Value(0.4)).current;

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

  function renderActivityItem({ item }: { item: ActivityResponse }) {
    return <ActivityItem activity={item} />;
  }

  const headerComponent = (
    <>
      {/* Back header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text style={styles.backText}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Detalhe
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.scrollContent}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[i === 0 ? styles.skeletonCardLarge : styles.skeletonRow, { opacity: shimmerAnim }]}
              accessible={false}
            />
          ))}
        </View>
      ) : detail ? (
        <View style={styles.scrollContent}>
          {/* Challenge card expanded */}
          <ChallengeCard data={detail} />

          {/* Register activity button */}
          {detail.status === 'ACTIVE' && (
            <Pressable
              style={({ pressed }) => [
                styles.registerButton,
                pressed && styles.registerButtonPressed,
              ]}
              onPress={() =>
                router.push(
                  `/(app)/challenges/${challengeId}/register-activity`
                )
              }
              accessibilityLabel="Registrar nova atividade"
              accessibilityRole="button"
            >
              <Text style={styles.registerButtonText}>
                Registrar Atividade
              </Text>
            </Pressable>
          )}

          {/* Activities section title */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atividades</Text>
            <Text style={styles.seeAll}>Ver Todas</Text>
          </View>
        </View>
      ) : null}
    </>
  );

  if (error) {
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
            <Text style={styles.backText}>{'‹'}</Text>
          </Pressable>
          <Text style={styles.headerTitle} accessibilityRole="header">
            Detalhe
          </Text>
          <View style={styles.headerSpacer} />
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

  const emptyActivities = (
    <View style={styles.emptyActivities}>
      <Text style={styles.emptyActivitiesText}>
        Nenhuma atividade registrada ainda.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={!isLoading && detail ? activities : []}
        keyExtractor={(item) => item.id}
        renderItem={renderActivityItem}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={!isLoading && detail ? emptyActivities : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 56,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '400',
    lineHeight: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    paddingBottom: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 16,
  },
  registerButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  registerButtonPressed: {
    opacity: 0.85,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
    letterSpacing: 0.02,
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.02,
  },
  skeletonCardLarge: {
    height: 160,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 12,
  },
  skeletonRow: {
    height: 72,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
  },
  emptyActivities: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyActivitiesText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
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
    color: colors.error,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onPrimary,
  },
});
