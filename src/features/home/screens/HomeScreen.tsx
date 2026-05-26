import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme/colors';
import { HomeShortcuts } from '../components/HomeShortcuts';
import { StreakCard } from '../components/StreakCard';
import { TrainingPathCard } from '../components/TrainingPathCard';
import { WeeklyFrequencyCard } from '../components/WeeklyFrequencyCard';
import { XpLevelCard } from '../components/XpLevelCard';
import { useHomeSummary } from '../hooks/useHomeSummary';

interface HomeScreenProps {
  userId: string;
  userName: string;
  token: string;
}

export function HomeScreen({ userId, userName, token }: HomeScreenProps) {
  const router = useRouter();
  const { summary, loadState, error, reload } = useHomeSummary(userId, token);
  const firstName = userName.split(' ')[0] || 'corredor';

  if (loadState === 'loading') {
    return <HomeSkeleton />;
  }

  if (loadState === 'error' || !summary) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorTitle} accessibilityRole="header">
          Nao conseguimos carregar sua Home
        </Text>
        <Text style={styles.errorText} selectable accessibilityRole="alert">
          {error ?? 'Tente novamente em instantes.'}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryPressed]}
          onPress={reload}
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>PACE FRIENDS</Text>
        <Text style={styles.greeting} accessibilityRole="header">
          Ola, {firstName}
        </Text>
        <Text style={styles.subtitle}>Seu progresso esta ganhando ritmo.</Text>
      </View>

      <View style={styles.summaryRow}>
        <StreakCard
          currentStreak={summary.currentStreak}
          onPress={() => router.push('/(app)/streak')}
        />
        <XpLevelCard
          totalXp={summary.totalXp}
          currentLevel={summary.currentLevel}
          xpForNextLevel={summary.xpForNextLevel}
        />
      </View>

      <WeeklyFrequencyCard
        daysTrained={summary.daysTrained}
        goal={summary.weeklyGoal}
      />

      <TrainingPathCard
        trainingPath={summary.trainingPath}
        onPress={() => router.push('/(app)/trails')}
      />

      <HomeShortcuts
        onIndividualChallenge={() => router.push('/(app)/challenges/create')}
        onFriendChallenges={() => router.push('/(app)/challenges')}
      />
    </ScrollView>
  );
}

function HomeSkeleton() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      accessibilityLabel="Carregando Home"
    >
      <View style={[styles.skeleton, styles.skeletonHeading]} />
      <View style={[styles.skeleton, styles.skeletonSubtitle]} />
      <View style={styles.summaryRow}>
        <View style={[styles.skeleton, styles.skeletonHero]} />
        <View style={[styles.skeleton, styles.skeletonHero]} />
      </View>
      <View style={[styles.skeleton, styles.skeletonCard]} />
      <View style={[styles.skeleton, styles.skeletonCard]} />
      <View style={styles.summaryRow}>
        <View style={[styles.skeleton, styles.skeletonAction]} />
        <View style={[styles.skeleton, styles.skeletonAction]} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36,
    gap: 16,
  },
  hero: {
    paddingBottom: 5,
    gap: 5,
  },
  eyebrow: {
    color: colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  greeting: {
    color: colors.onSurface,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    fontSize: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stateContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 13,
  },
  errorTitle: {
    color: colors.onSurface,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 13,
    backgroundColor: colors.primary,
  },
  retryPressed: {
    backgroundColor: colors.primaryDark,
  },
  retryText: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  skeleton: {
    borderRadius: 14,
    backgroundColor: colors.outlineVariant,
  },
  skeletonHeading: {
    height: 34,
    width: '55%',
    marginTop: 12,
  },
  skeletonSubtitle: {
    height: 18,
    width: '78%',
    marginBottom: 7,
  },
  skeletonHero: {
    flex: 1,
    height: 140,
    borderRadius: 18,
  },
  skeletonCard: {
    height: 116,
    borderRadius: 18,
  },
  skeletonAction: {
    flex: 1,
    height: 108,
    borderRadius: 16,
  },
});
