import React, { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Carregando trilha" />
      </View>
    );
  }

  if (loadState === 'error') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{loadError ?? 'Erro ao carregar trilha.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={reload} activeOpacity={0.85}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!trail) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Nenhuma trilha encontrada.</Text>
      </View>
    );
  }

  const xpPct = trail.nextLevelRequirements.xpRequired > 0
    ? trail.nextLevelRequirements.xpCurrent / trail.nextLevelRequirements.xpRequired
    : 0;
  const xpRemaining = trail.nextLevelRequirements.xpRequired - trail.nextLevelRequirements.xpCurrent;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Trail Header */}
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>Trilhas</Text>
        <Text style={styles.levelTitle}>
          Nível {trail.currentLevel} — {trail.currentLevelName}
        </Text>
        <TrailProgressBar
          completedItems={trail.path.completedItems}
          totalItems={trail.path.totalItems}
        />
      </View>

      {/* Bonus XP badge */}
      {trail.path.bonusXpAwarded && (
        <View style={styles.bonusBadge}>
          <Text style={styles.bonusText}>★ Bônus de 100 XP conquistado!</Text>
        </View>
      )}

      {/* Level up success */}
      {levelUpState === 'success' && levelUpResult && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>
            Parabéns! Você avançou para o Nível {levelUpResult.newLevel} — {levelUpResult.newLevelName}!
          </Text>
        </View>
      )}

      {/* Level up error */}
      {levelUpState === 'error' && levelUpError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{levelUpError}</Text>
        </View>
      )}

      {/* Level up banner */}
      {trail.canLevelUp && levelUpState !== 'success' && (
        <LevelUpBanner
          isLoading={levelUpState === 'submitting'}
          onLevelUp={() => { void executeLevelUp(); }}
        />
      )}

      {/* Mission List — vertical connector line behind circles */}
      <View style={styles.missionSection}>
        {/* Vertical connector line */}
        <View style={styles.connectorLine} />

        {trail.path.items.map((item) => (
          <View key={item.position} style={styles.missionItem}>
            <TrailItemCard item={item} />
          </View>
        ))}
      </View>

      {/* Next level requirements */}
      {!trail.canLevelUp && trail.currentLevel < 11 && (
        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>Para evoluir de nível</Text>

          {/* Path completed */}
          <RequirementRow
            icon="check_box_outline_blank"
            label="Trilha completa"
            met={trail.nextLevelRequirements.pathCompleted}
            rightContent={
              <Text style={styles.reqValue}>
                {trail.path.completedItems}/{trail.path.totalItems}
              </Text>
            }
          />

          {/* Streak weeks */}
          <RequirementRow
            icon="calendar_today"
            label="Ofensiva"
            met={trail.nextLevelRequirements.streakWeeksCompleted >= trail.nextLevelRequirements.streakWeeksRequired}
            rightContent={
              <View style={styles.reqRightGroup}>
                <Text style={styles.reqValue}>
                  {trail.nextLevelRequirements.streakWeeksCompleted}/{trail.nextLevelRequirements.streakWeeksRequired}
                </Text>
                <Text style={styles.reqUnit}> semanas</Text>
              </View>
            }
          />

          {/* XP */}
          <RequirementRow
            icon="military_tech"
            label="Experiência"
            met={trail.nextLevelRequirements.xpCurrent >= trail.nextLevelRequirements.xpRequired}
            rightContent={
              <View style={styles.xpRow}>
                <View style={styles.xpTrack}>
                  <View style={[styles.xpFill, { width: `${Math.min(xpPct * 100, 100)}%` }]} />
                </View>
                <Text style={styles.reqValue}>
                  {trail.nextLevelRequirements.xpCurrent}/{trail.nextLevelRequirements.xpRequired}
                </Text>
              </View>
            }
          />

          {/* Footer tip */}
          <View style={styles.reqFooter}>
            <View style={styles.reqFooterIcon}>
              <Text style={styles.reqFooterIconText}>↑</Text>
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
          <Text style={styles.maxLevelText}>★ Nível máximo atingido!</Text>
        </View>
      )}
    </ScrollView>
  );
}

function RequirementRow({
  label,
  met,
  rightContent,
}: {
  icon: string;
  label: string;
  met: boolean;
  rightContent?: React.ReactNode;
}) {
  return (
    <View style={styles.requirementRow}>
      <View style={styles.requirementLeft}>
        <Text style={[styles.requirementDot, met && styles.requirementDotMet]}>
          {met ? '✓' : '○'}
        </Text>
        <Text style={styles.requirementLabel}>{label}</Text>
      </View>
      {rightContent && <View style={styles.requirementRight}>{rightContent}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 16,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  // Header
  headerSection: {
    gap: 12,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.onSurface,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },

  // Alerts
  errorText: {
    fontSize: 15,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 15,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },

  bonusBadge: {
    backgroundColor: colors.tertiaryFixed,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.tertiaryFixedDim,
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
  },

  successBanner: {
    backgroundColor: colors.secondaryContainerLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.secondaryFixedDim,
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    textAlign: 'center',
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
  missionItem: {
    // each item is managed by TrailItemCard row layout
  },

  // Next level requirements card
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
  requirementDot: {
    fontSize: 18,
    color: colors.outlineVariant,
    width: 20,
    textAlign: 'center',
  },
  requirementDotMet: {
    color: colors.secondaryFixedDim,
  },
  requirementLabel: {
    fontSize: 16,
    color: colors.inverseOnSurface,
    lineHeight: 24,
  },
  requirementRight: {
    alignItems: 'flex-end',
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
  },
  reqFooterIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `rgba(212, 227, 255, 0.2)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqFooterIconText: {
    fontSize: 16,
    color: colors.secondaryFixedDim,
    fontWeight: '700',
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
    backgroundColor: colors.tertiaryFixed,
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.tertiaryFixedDim,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  maxLevelText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.onSurface,
  },
});
