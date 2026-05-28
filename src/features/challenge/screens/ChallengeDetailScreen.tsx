import { useRef, useEffect, useLayoutEffect } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
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
  const navigation = useNavigation();
  const { detail, activities, isLoading, error, reload } = useChallengeDetail(
    token,
    challengeId
  );
  const shimmerAnim = useRef(new Animated.Value(0.4)).current;

  useLayoutEffect(() => {
    if (detail) {
      navigation.setOptions({ title: detail.title });
    }
  }, [navigation, detail]);

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
          <ChallengeCard data={detail} />

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
      <View style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={colors.onSurfaceVariant} />
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
      </View>
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
    <View style={styles.safeArea}>
      <FlatList
        data={!isLoading && detail ? activities : []}
        keyExtractor={(item) => item.id}
        renderItem={renderActivityItem}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={!isLoading && detail ? emptyActivities : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  listContent: {
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  retryButtonText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  registerButtonText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyActivities: {
    alignItems: 'center',
    padding: 24,
  },
  emptyActivitiesText: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
  },
  skeletonCardLarge: {
    height: 160,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerHigh,
    marginBottom: 12,
  },
  skeletonRow: {
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
    marginBottom: 8,
  },
});
