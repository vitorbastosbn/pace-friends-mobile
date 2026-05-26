import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StreakCard, StreakCardError } from '../components/StreakCard';
import { XpDisplay } from '../components/XpDisplay';
import { useStreak } from '../hooks/useStreak';
import { UpdateFrequencyModal } from './UpdateFrequencyModal';
import { colors } from '../../../theme/colors';
import type { UpdateFrequencyResponse } from '../../profile/types/profile.types';

interface StreakScreenProps {
  token: string;
}

export function StreakScreen({ token }: StreakScreenProps) {
  const { streak, isLoading, error, reload } = useStreak(token);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [frequencyFeedback, setFrequencyFeedback] = useState<string | null>(null);

  function handleFrequencySaved(response: UpdateFrequencyResponse) {
    const date = new Date(`${response.effectiveFrom}T00:00:00`);
    const effectiveDate = date.toLocaleDateString('pt-BR');
    setFrequencyFeedback(
      `Nova frequencia: ${response.weeklyFrequency} dias por semana a partir de ${effectiveDate}.`
    );
    Alert.alert(
      'Frequencia atualizada',
      `Sua nova meta vale a partir de ${effectiveDate}.`
    );
    setShowFrequencyModal(false);
    reload();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="local-fire-department" size={24} color={colors.primary} />
          <Text style={styles.headerTitle} accessibilityRole="header">
            Ofensiva
          </Text>
        </View>
        <View style={styles.headerRight}>
          <MaterialIcons name="notifications-none" size={24} color={colors.onSurfaceVariant} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Carregando ofensiva" />
          </View>
        )}

        {!isLoading && error && (
          <StreakCardError message={error} onRetry={reload} />
        )}

        {!isLoading && !error && streak && (
          <>
            <StreakCard data={streak} />

            <XpDisplay
              progress={streak.xpProgress}
              completed={streak.remainingDays === 0}
              lastResult={streak.lastResult}
              targetFrequency={streak.targetFrequency}
              daysCompletedThisWeek={streak.daysCompletedThisWeek}
            />

            <Pressable
              style={({ pressed }) => [
                styles.frequencyButton,
                pressed && styles.frequencyButtonPressed,
              ]}
              onPress={() => setShowFrequencyModal(true)}
              accessibilityRole="button"
              accessibilityLabel="Alterar frequencia semanal"
            >
              <MaterialIcons name="settings" size={20} color={colors.primary} />
              <Text style={styles.frequencyButtonText}>Alterar frequencia</Text>
            </Pressable>

            {frequencyFeedback ? (
              <Text style={styles.feedbackText}>{frequencyFeedback}</Text>
            ) : null}

            <View style={styles.bentoGrid}>
              <View style={styles.bentoItemPrimary}>
                <MaterialIcons name="bolt" size={24} color={colors.primary} />
                <Text style={styles.bentoLabelPrimary}>Proximo Marco</Text>
                <Text style={styles.bentoValuePrimary}>30 Dias</Text>
              </View>
              <View style={styles.bentoItemSecondary}>
                <MaterialIcons name="military-tech" size={24} color={colors.secondary} />
                <Text style={styles.bentoLabelSecondary}>Conquistas</Text>
                <Text style={styles.bentoValue}>{streak.currentStreak} semanas</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      {streak ? (
        <UpdateFrequencyModal
          token={token}
          visible={showFrequencyModal}
          currentFrequency={streak.targetFrequency}
          onClose={() => setShowFrequencyModal(false)}
          onSaved={handleFrequencySaved}
        />
      ) : null}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 32,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 16,
  },
  loadingContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  frequencyButton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
  },
  frequencyButtonPressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.02 * 14,
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.secondary,
    textAlign: 'center',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  bentoItemPrimary: {
    flex: 1,
    backgroundColor: 'rgba(219,225,255,0.4)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(219,225,255,0.6)',
    gap: 4,
  },
  bentoItemSecondary: {
    flex: 1,
    backgroundColor: 'rgba(125,251,177,0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(125,251,177,0.2)',
    gap: 4,
  },
  bentoLabelPrimary: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    letterSpacing: 0.05 * 12,
  },
  bentoLabelSecondary: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.secondary,
    letterSpacing: 0.05 * 12,
  },
  bentoValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 28,
  },
  bentoValuePrimary: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 28,
  },
});
