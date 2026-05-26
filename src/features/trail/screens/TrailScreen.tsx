import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

  if (loadState === 'loading' || loadState === 'idle') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3a73ff" accessibilityLabel="Carregando trilha" />
      </View>
    );
  }

  if (loadState === 'error') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{loadError ?? 'Erro ao carregar trilha.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={reload}>
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>Trilha</Text>
        <Text style={styles.levelTitle}>
          Nivel {trail.currentLevel} — {trail.currentLevelName}
        </Text>
      </View>

      {/* Progress Bar */}
      <TrailProgressBar
        completedItems={trail.path.completedItems}
        totalItems={trail.path.totalItems}
      />

      {/* Bonus XP badge */}
      {trail.path.bonusXpAwarded && (
        <View style={styles.bonusBadge}>
          <Text style={styles.bonusText}>★ Bonus de 100 XP conquistado!</Text>
        </View>
      )}

      {/* Level up success */}
      {levelUpState === 'success' && levelUpResult && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>
            Parabens! Voce avancou para o nivel {levelUpResult.newLevel} — {levelUpResult.newLevelName}!
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

      {/* Items */}
      <Text style={styles.sectionLabel}>Itens da trilha</Text>
      {trail.path.items.map((item) => (
        <TrailItemCard key={item.position} item={item} />
      ))}

      {/* Next level requirements */}
      {!trail.canLevelUp && trail.currentLevel < 11 && (
        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>Para evoluir de nivel</Text>
          <RequirementRow
            label="Trilha completa"
            met={trail.nextLevelRequirements.pathCompleted}
          />
          <RequirementRow
            label={`Semanas de ofensiva: ${trail.nextLevelRequirements.streakWeeksCompleted}/${trail.nextLevelRequirements.streakWeeksRequired}`}
            met={trail.nextLevelRequirements.streakWeeksCompleted >= trail.nextLevelRequirements.streakWeeksRequired}
          />
          <RequirementRow
            label={`XP: ${trail.nextLevelRequirements.xpCurrent}/${trail.nextLevelRequirements.xpRequired}`}
            met={trail.nextLevelRequirements.xpCurrent >= trail.nextLevelRequirements.xpRequired}
          />
        </View>
      )}

      {trail.currentLevel >= 11 && (
        <View style={styles.maxLevelBadge}>
          <Text style={styles.maxLevelText}>★ Nivel maximo atingido!</Text>
        </View>
      )}
    </ScrollView>
  );
}

function RequirementRow({ label, met }: { label: string; met: boolean }) {
  return (
    <View style={styles.requirementRow}>
      <Text style={[styles.requirementIcon, { color: met ? '#16a766' : '#9E9E9E' }]}>
        {met ? '✓' : '○'}
      </Text>
      <Text style={[styles.requirementLabel, !met && styles.requirementLabelUnmet]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#546E7A',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D47A1',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 15,
    color: '#ff4d8d',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3a73ff',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 15,
    color: '#546E7A',
    textAlign: 'center',
  },
  bonusBadge: {
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcc00',
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D47A1',
  },
  successBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#16a766',
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a766',
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#FDECEA',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ff4d8d',
  },
  errorBannerText: {
    fontSize: 14,
    color: '#ff4d8d',
    textAlign: 'center',
  },
  requirementsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#546E7A',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  requirementIcon: {
    fontSize: 16,
    fontWeight: '700',
    width: 20,
    textAlign: 'center',
  },
  requirementLabel: {
    fontSize: 14,
    color: '#0D47A1',
    fontWeight: '500',
  },
  requirementLabelUnmet: {
    color: '#9E9E9E',
  },
  maxLevelBadge: {
    backgroundColor: '#FFF9C4',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ffcc00',
  },
  maxLevelText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D47A1',
  },
});
