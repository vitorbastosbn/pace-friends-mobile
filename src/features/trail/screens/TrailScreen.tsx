import { useCallback, useLayoutEffect, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from 'expo-router';
import { colors } from '../../../theme/colors';
import { LevelUpBanner } from '../components/LevelUpBanner';
import { TrailItemCard } from '../components/TrailItemCard';
import { TrailProgressBar } from '../components/TrailProgressBar';
import { useTrail } from '../hooks/useTrail';

interface TrailScreenProps {
  userId: string;
  token: string;
}

export function TrailScreen({ userId, token }: TrailScreenProps) {
  const { trail, loadState, loadError, levelUpState, levelUpError, levelUpResult, executeLevelUp, reload } =
    useTrail(userId, token);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Trilhas' });
  }, [navigation]);

  const hasMounted = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (hasMounted.current) {
        reload();
      } else {
        hasMounted.current = true;
      }
    }, [reload])
  );

  if (loadState === 'loading' || loadState === 'idle') {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <SkeletonBlock height={32} width={200} style={styles.mb8} />
          <SkeletonBlock height={72} style={styles.mb8} />
          <SkeletonBlock height={80} style={styles.mb8} />
          <SkeletonBlock height={80} style={styles.mb8} />
          <SkeletonBlock height={80} style={styles.mb16} />
          <SkeletonBlock height={200} />
        </ScrollView>
      </View>
    );
  }

  if (loadState === 'error') {
    return (
      <View style={[styles.screen, styles.centered]}>
        <MaterialIcons name="error-outline" size={48} color={colors.onSurfaceVariant} />
        <Text style={styles.errorTitle}>Não foi possível carregar</Text>
        <Text style={styles.errorText}>{loadError ?? 'Erro ao carregar trilha.'}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={reload}
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (!trail) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <MaterialIcons name="map" size={48} color={colors.outlineVariant} />
        <Text style={styles.errorTitle}>Nenhuma trilha encontrada</Text>
      </View>
    );
  }

  const xpPct = trail.nextLevelRequirements.xpRequired > 0
    ? trail.nextLevelRequirements.xpCurrent / trail.nextLevelRequirements.xpRequired
    : 0;
  const xpRemaining = trail.nextLevelRequirements.xpRequired - trail.nextLevelRequirements.xpCurrent;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Level heading */}
        <Text style={styles.levelHeading}>
          Nível {trail.currentLevel} – {trail.currentLevelName}
        </Text>

        {/* Progress card */}
        <TrailProgressBar
          completedItems={trail.path.completedItems}
          totalItems={trail.path.totalItems}
        />

        {/* Bonus XP badge */}
        {trail.path.bonusXpAwarded && (
          <View style={styles.bonusBadge}>
            <MaterialIcons name="star" size={16} color={colors.tertiary} />
            <Text style={styles.bonusText}>Bônus de 100 XP conquistado!</Text>
          </View>
        )}

        {/* Level up success */}
        {levelUpState === 'success' && levelUpResult && (
          <View style={styles.successBanner}>
            <MaterialIcons name="emoji-events" size={20} color={colors.secondary} />
            <Text style={styles.successText}>
              Parabéns! Você avançou para o Nível {levelUpResult.newLevel} – {levelUpResult.newLevelName}!
            </Text>
          </View>
        )}

        {/* Level up error */}
        {levelUpState === 'error' && levelUpError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{levelUpError}</Text>
          </View>
        )}

        {/* Level up CTA (can advance) */}
        {trail.canLevelUp && levelUpState !== 'success' && (
          <LevelUpBanner
            isLoading={levelUpState === 'submitting'}
            onLevelUp={() => { void executeLevelUp(); }}
          />
        )}

        {/* Mission list */}
        <View style={styles.missionSection}>
          <View style={styles.connectorLine} />
          {trail.path.items.map((item) => (
            <TrailItemCard key={item.position} item={item} />
          ))}
        </View>

        {/* Next level requirements */}
        {!trail.canLevelUp && trail.currentLevel < 11 && (
          <View style={styles.requirementsCard}>
            <View style={styles.decorBlob} />

            <Text style={styles.requirementsTitle}>Para evoluir de nível</Text>

            {/* Path completed */}
            <View style={styles.requirementRow}>
              <View style={styles.requirementLeft}>
                <MaterialIcons
                  name={trail.nextLevelRequirements.pathCompleted ? 'check-box' : 'check-box-outline-blank'}
                  size={20}
                  color={trail.nextLevelRequirements.pathCompleted ? colors.secondaryFixedDim : colors.outlineVariant}
                />
                <Text style={styles.requirementLabel}>Trilha completa</Text>
              </View>
              <Text style={styles.reqValue}>
                {Math.round((trail.path.completedItems / (trail.path.totalItems || 1)) * 100)}%
              </Text>
            </View>

            {/* Streak weeks */}
            <View style={styles.requirementRow}>
              <View style={styles.requirementLeft}>
                <MaterialIcons name="calendar-today" size={20} color={colors.outlineVariant} />
                <Text style={styles.requirementLabel}>Ofensiva</Text>
              </View>
              <View style={styles.reqRightGroup}>
                <Text style={styles.reqValue}>
                  {trail.nextLevelRequirements.streakWeeksCompleted}/{trail.nextLevelRequirements.streakWeeksRequired}
                </Text>
                <Text style={styles.reqUnit}> semanas</Text>
              </View>
            </View>

            {/* XP */}
            <View style={styles.requirementRow}>
              <View style={styles.requirementLeft}>
                <MaterialIcons name="military-tech" size={20} color={colors.outlineVariant} />
                <Text style={styles.requirementLabel}>Experiência</Text>
              </View>
              <View style={styles.xpRow}>
                <View style={styles.xpTrack}>
                  <View style={[styles.xpFill, { width: `${Math.min(xpPct * 100, 100)}%` }]} />
                </View>
                <Text style={styles.reqValue}>
                  {trail.nextLevelRequirements.xpCurrent}/{trail.nextLevelRequirements.xpRequired}
                </Text>
              </View>
            </View>

            {/* Footer tip */}
            <View style={styles.reqFooter}>
              <View style={styles.reqFooterIcon}>
                <MaterialIcons name="trending-up" size={18} color={colors.secondaryFixedDim} />
              </View>
              <Text style={styles.reqFooterText}>
                Continue assim! Você está a{' '}
                <Text style={styles.reqFooterHighlight}>{xpRemaining} XP</Text>
                {' '}do Nível {trail.currentLevel + 1}.
              </Text>
            </View>
          </View>
        )}

        {trail.currentLevel >= 11 && (
          <View style={styles.maxLevelBadge}>
            <MaterialIcons name="star" size={20} color={colors.tertiary} />
            <Text style={styles.maxLevelText}>Nível máximo atingido!</Text>
          </View>
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 16,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 28,
  },

  levelHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
    lineHeight: 30,
    letterSpacing: -0.1,
    marginTop: -4,
  },

  // Alerts
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

  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.tertiaryFixed,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.tertiaryFixedDim,
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
  },

  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondaryContainerLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.secondaryFixedDim,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },

  errorBanner: {
    backgroundColor: colors.errorContainer,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorBannerText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },

  // Mission list
  missionSection: {
    position: 'relative',
    gap: 16,
  },
  connectorLine: {
    position: 'absolute',
    left: 23,
    top: 24,
    bottom: 24,
    width: 2,
    backgroundColor: `rgba(195, 198, 215, 0.4)`,
    zIndex: -1,
  },

  // Requirements card (dark)
  requirementsCard: {
    backgroundColor: colors.inverseSurface,
    borderRadius: 16,
    padding: 24,
    overflow: 'hidden',
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    gap: 16,
  },
  decorBlob: {
    position: 'absolute',
    right: -32,
    top: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: `rgba(0, 80, 215, 0.2)`,
  },
  requirementsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.inverseOnSurface,
    lineHeight: 28,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  requirementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  requirementLabel: {
    fontSize: 16,
    color: colors.inverseOnSurface,
    lineHeight: 24,
  },
  reqValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondaryFixedDim,
  },
  reqRightGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  reqUnit: {
    fontSize: 12,
    color: colors.outlineVariant,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xpTrack: {
    width: 80,
    height: 6,
    backgroundColor: `rgba(115, 118, 134, 0.3)`,
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: colors.tertiaryFixedDim,
    borderRadius: 3,
  },
  reqFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: `rgba(195, 198, 215, 0.2)`,
    paddingTop: 16,
    marginTop: -4,
  },
  reqFooterIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `rgba(212, 227, 255, 0.2)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqFooterText: {
    flex: 1,
    fontSize: 14,
    color: colors.outlineVariant,
    lineHeight: 20,
  },
  reqFooterHighlight: {
    color: colors.inverseOnSurface,
    fontWeight: '700',
  },

  maxLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.tertiaryFixed,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.tertiaryFixedDim,
  },
  maxLevelText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.onSurface,
  },

  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
});
