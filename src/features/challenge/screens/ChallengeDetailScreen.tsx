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
          <Text style={styles.sectionTitle}>Atividades</Text>
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
    backgroundColor: '#F8FAFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF5',
    backgroundColor: '#F8FAFF',
  },
  backButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 28,
    color: '#0D47A1',
    fontWeight: '400',
    lineHeight: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#0D47A1',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    minWidth: 48,
  },
  listContent: {
    paddingBottom: 32,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  registerButton: {
    height: 52,
    backgroundColor: '#0D47A1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonPressed: {
    backgroundColor: '#0A3880',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.25,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#546E7A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  skeletonCardLarge: {
    height: 140,
    backgroundColor: '#E0E8F0',
    borderRadius: 14,
    marginBottom: 16,
  },
  skeletonRow: {
    height: 56,
    backgroundColor: '#E8EDF5',
    borderRadius: 8,
    marginBottom: 8,
  },
  emptyActivities: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyActivitiesText: {
    fontSize: 14,
    color: '#78909C',
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
