import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar as NativeStatusBar,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts as usePlusJakartaSans, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts as useBeVietnamPro, BeVietnamPro_400Regular, BeVietnamPro_500Medium, BeVietnamPro_600SemiBold, BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro';
import { useRouter } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';
import { HomeShortcuts } from '../components/HomeShortcuts';
import { StreakCard } from '../components/StreakCard';
import { TrainingPathCard } from '../components/TrainingPathCard';
import { WeeklyFrequencyCard } from '../components/WeeklyFrequencyCard';
import { XpLevelCard } from '../components/XpLevelCard';
import { useHomeSummary } from '../hooks/useHomeSummary';

interface HomeScreenProps {
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  token: string;
}

const REFERENCE_PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDHM-YGUUXCiz4e4enlt3GNM7I7RhEdpckhzQGuB1QoFQVgz2cmRgrUmYY6ycw733xTwmWZNKR3ELkz0zq9Vk1GvFJMP7ZPDJFzMTvG9SrnJTQrvpD8uZvrpPyo4Bp-rgAixZWhO3tPvLyq_NmVqEvFrzDl3mtS5wJGTxE-rMzcC61vVE0tHzqHXBMvtUePnSKKQL7N61BW0FLS3bg13IcVykmKL9zlPS2KCBLRnlNz7qPxm5VVykY_j3Byl2jC50lwOsOHd828h31R';

export function HomeScreen({ userId, userName, userPhotoUrl, token }: HomeScreenProps) {
  const router = useRouter();
  const [displayFontsLoaded] = usePlusJakartaSans({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const [bodyFontsLoaded] = useBeVietnamPro({
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
  });
  const { summary, loadState, error, reload } = useHomeSummary(userId, token);
  const firstName = userName.split(' ')[0] || 'corredor';

  if (!displayFontsLoaded || !bodyFontsLoaded || loadState === 'loading') {
    return (
      <>
        <ExpoStatusBar style="dark" />
        <HomeSkeleton />
      </>
    );
  }

  if (loadState === 'error' || !summary) {
    return (
      <>
        <ExpoStatusBar style="dark" />
        <View style={styles.stateContainer}>
          <Text style={styles.errorTitle} accessibilityRole="header">
            Não conseguimos carregar sua Home
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
      </>
    );
  }

  return (
    <>
      <ExpoStatusBar style="dark" />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={styles.appBar}>
            <View style={styles.brand}>
              <Image
                accessibilityLabel={`Foto de ${userName}`}
                source={{ uri: userPhotoUrl ?? REFERENCE_PROFILE_IMAGE }}
                style={styles.avatar}
              />
              <Text selectable style={styles.brandName}>Pace Friends</Text>
            </View>
            <MaterialIcons name="notifications-none" size={25} color={colors.primary} />
          </View>

          <View style={styles.hero}>
            <Text selectable style={styles.greeting} accessibilityRole="header">
              Olá, {firstName}
            </Text>
            <Text selectable style={styles.subtitle}>Seu progresso está ganhando ritmo.</Text>
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
        <Pressable
          accessibilityLabel="Iniciar atividade"
          accessibilityRole="button"
          onPress={() => router.push('/(app)/challenges')}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        >
          <MaterialIcons name="directions-run" size={28} color={colors.onPrimary} />
        </Pressable>
      </View>
    </>
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
      <View style={styles.skeletonBar}>
        <View style={[styles.skeleton, styles.skeletonAvatar]} />
        <View style={[styles.skeleton, styles.skeletonBrand]} />
      </View>
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
    paddingTop: (NativeStatusBar.currentHeight ?? 0) + 10,
    paddingBottom: 96,
    gap: 20,
  },
  appBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 2,
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  avatar: {
    borderColor: 'rgba(0, 80, 215, 0.10)',
    borderRadius: 20,
    borderWidth: 2,
    height: 40,
    width: 40,
  },
  brandName: {
    color: colors.primary,
    fontFamily: fonts.displayBold,
    fontSize: 23,
    letterSpacing: -0.2,
  },
  hero: {
    gap: 3,
  },
  greeting: {
    color: colors.onSurface,
    fontFamily: fonts.displayBold,
    fontSize: 28,
    letterSpacing: -0.3,
    lineHeight: 36,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
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
    fontFamily: fonts.displayBold,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
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
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    fontWeight: '700',
  },
  skeleton: {
    borderRadius: 12,
    backgroundColor: colors.outlineVariant,
  },
  skeletonBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
  },
  skeletonAvatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  skeletonBrand: {
    height: 24,
    width: 130,
  },
  skeletonHeading: {
    height: 30,
    width: '55%',
  },
  skeletonSubtitle: {
    height: 18,
    width: '78%',
    marginBottom: 7,
  },
  skeletonHero: {
    flex: 1,
    height: 136,
  },
  skeletonCard: {
    height: 124,
  },
  skeletonAction: {
    flex: 1,
    height: 108,
  },
  fab: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 28,
    bottom: 22,
    boxShadow: '0 8px 18px rgba(0, 80, 215, 0.28)',
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    width: 56,
  },
  fabPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.96 }],
  },
});
