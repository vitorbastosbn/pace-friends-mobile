import { useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useAchievements } from '../hooks/useAchievements';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';
import type { Achievement } from '../types/achievement.types';

const ICON_MAP: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  footsteps: 'directions-walk',
  flag: 'flag',
  groups: 'groups',
  trophy: 'emoji-events',
  runner: 'directions-run',
  fire: 'local-fire-department',
  flame: 'local-fire-department',
  arrow_upward: 'arrow-upward',
  map: 'map',
};

function getIconName(iconKey: string): keyof typeof MaterialIcons.glyphMap {
  return ICON_MAP[iconKey] ?? 'star';
}

function getRankName(unlocked: number, total: number): string {
  if (total === 0 || unlocked === 0) return 'Iniciante';
  const pct = unlocked / total;
  if (pct < 0.25) return 'Novato em Progresso';
  if (pct < 0.5) return 'Corredor em Progresso';
  if (pct < 0.75) return 'Mestre em Progresso';
  if (pct < 1) return 'Veterano em Progresso';
  return 'Mestre das Conquistas';
}

interface AchievementsScreenProps {
  token: string;
}

export function AchievementsScreen({ token }: AchievementsScreenProps) {
  const navigation = useNavigation();
  const router = useRouter();
  const { achievements, isLoading, error, reload } = useAchievements(token);

  const unlocked = achievements.filter((a) => a.unlocked);
  const inProgress = achievements.filter((a) => !a.unlocked);
  const total = achievements.length;
  const rankName = getRankName(unlocked.length, total);
  const progressPct = total > 0 ? unlocked.length / total : 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={headerStyles.shareBtn}
          accessibilityLabel="Compartilhar conquistas"
          accessibilityRole="button"
          hitSlop={8}
        >
          <MaterialIcons name="share" size={22} color={colors.primary} />
        </Pressable>
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Carregando conquistas" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={48} color={colors.onSurfaceVariant} />
        <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>
        <Pressable
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
          onPress={reload}
          accessibilityLabel="Tentar novamente"
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryDecorCircle} />
          <View style={styles.trophyCircle}>
            <MaterialIcons name="emoji-events" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.rankName}>{rankName}</Text>
          <Text style={styles.rankSubtitle}>
            {unlocked.length} de {total} conquistas desbloqueadas
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPct * 100}%` as `${number}%` }]} />
          </View>
        </View>

        {/* Unlocked section */}
        {unlocked.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>DESBLOQUEADAS</Text>
              <Text style={styles.sectionAction}>Ver todas</Text>
            </View>
            {unlocked.map((a) => (
              <UnlockedCard key={a.id} achievement={a} />
            ))}
          </View>
        )}

        {/* In-progress section */}
        {inProgress.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>EM ANDAMENTO</Text>
            </View>
            {inProgress.map((a) => (
              <InProgressCard key={a.id} achievement={a} />
            ))}
          </View>
        )}

        {/* Empty state */}
        {achievements.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="emoji-events" size={64} color={colors.outlineVariant} />
            <Text style={styles.emptyTitle}>Sua jornada começa aqui!</Text>
            <Text style={styles.emptyMessage}>
              Complete desafios e registre atividades para conquistar suas primeiras medalhas.
            </Text>
          </View>
        )}

        {/* Explore trails */}
        <Pressable
          style={({ pressed }) => [styles.exploreButton, pressed && styles.exploreButtonPressed]}
          onPress={() => router.push('/(app)/trails')}
          accessibilityRole="button"
          accessibilityLabel="Explorar novas trilhas"
        >
          <Text style={styles.exploreButtonText}>Explorar Novas Trilhas</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function UnlockedCard({ achievement }: { achievement: Achievement }) {
  const iconName = getIconName(achievement.iconKey);
  return (
    <View style={styles.card}>
      <View style={styles.unlockedIconBox}>
        <MaterialIcons name={iconName} size={32} color={colors.secondary} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{achievement.name}</Text>
        <Text style={styles.cardDescription}>{achievement.description}</Text>
      </View>
      <View style={styles.checkCircle}>
        <MaterialIcons name="check" size={20} color={colors.secondary} />
      </View>
    </View>
  );
}

function InProgressCard({ achievement }: { achievement: Achievement }) {
  const iconName = getIconName(achievement.iconKey);
  const progress = achievement.progress;
  const pct = progress ? Math.min(progress.current / progress.total, 1) : 0;

  return (
    <View style={[styles.card, styles.cardColumn]}>
      <View style={styles.cardRow}>
        <View style={styles.lockedIconBox}>
          <MaterialIcons name={iconName} size={32} color={colors.outline} />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardName}>{achievement.name}</Text>
          <Text style={styles.cardDescription}>{achievement.description}</Text>
        </View>
      </View>
      {progress !== null && (
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Progresso</Text>
            <Text style={[styles.progressCount, pct > 0 && styles.progressCountActive]}>
              {progress.current}/{progress.total}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                pct > 0 ? styles.progressFillActive : styles.progressFillZero,
                { width: `${pct * 100}%` as `${number}%` },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: '#10233B',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 1,
} as const;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 28,
    backgroundColor: colors.background,
  },
  // Summary card
  summaryCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryDecorCircle: {
    position: 'absolute',
    top: -48,
    right: -48,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  trophyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  rankName: {
    color: '#FFFFFF',
    fontFamily: fonts.displaySemiBold,
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 4,
  },
  rankSubtitle: {
    color: 'rgba(255, 255, 255, 0.90)',
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderRadius: 6,
    marginTop: 24,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondaryContainer,
    borderRadius: 6,
  },
  // Sections
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionLabel: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionAction: {
    color: colors.primary,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.05,
  },
  // Cards
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.20)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...CARD_SHADOW,
  },
  cardColumn: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  unlockedIconBox: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 109, 64, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  lockedIconBox: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardName: {
    color: colors.onSurface,
    fontFamily: fonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 28,
  },
  cardDescription: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 109, 64, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  // Progress (in-progress cards)
  progressSection: {
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.05,
  },
  progressCount: {
    color: colors.onSurface,
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  progressCountActive: {
    color: colors.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFillActive: {
    backgroundColor: colors.primary,
  },
  progressFillZero: {
    backgroundColor: 'rgba(0, 80, 215, 0.30)',
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyTitle: {
    color: colors.onSurface,
    fontFamily: fonts.displayBold,
    fontSize: 18,
    textAlign: 'center',
  },
  emptyMessage: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  // Error
  errorText: {
    color: colors.error,
    fontFamily: fonts.bodyRegular,
    fontSize: 15,
    textAlign: 'center',
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
    color: colors.onPrimary,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  // Explore button
  exploreButton: {
    alignSelf: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  exploreButtonPressed: {
    backgroundColor: colors.surfaceContainer,
  },
  exploreButtonText: {
    color: colors.primary,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    letterSpacing: 0.02,
  },
});

const headerStyles = StyleSheet.create({
  shareBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
});
