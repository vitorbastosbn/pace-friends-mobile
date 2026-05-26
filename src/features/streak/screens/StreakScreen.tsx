import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StreakCard, StreakCardError } from '../components/StreakCard';
import { WeekProgress } from '../components/WeekProgress';
import { XpDisplay } from '../components/XpDisplay';
import { useStreak } from '../hooks/useStreak';
import { UpdateFrequencyModal } from './UpdateFrequencyModal';
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
        <Text style={styles.headerTitle} accessibilityRole="header">
          Ofensiva
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0D47A1" accessibilityLabel="Carregando ofensiva" />
          </View>
        )}

        {!isLoading && error && (
          <StreakCardError message={error} onRetry={reload} />
        )}

        {!isLoading && !error && streak && (
          <>
            <StreakCard data={streak} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Progresso da Semana</Text>
              <View style={styles.weekProgressContainer}>
                <WeekProgress
                  daysCompleted={streak.daysCompletedThisWeek}
                  targetDays={streak.targetFrequency}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>XP Potencial</Text>
              <XpDisplay
                progress={streak.xpProgress}
                completed={streak.remainingDays === 0}
                lastResult={streak.lastResult}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumo</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{streak.currentStreak}</Text>
                  <Text style={styles.summaryLabel}>Ofensiva atual</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{streak.targetFrequency}x</Text>
                  <Text style={styles.summaryLabel}>Meta semanal</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{streak.daysCompletedThisWeek}</Text>
                  <Text style={styles.summaryLabel}>Dias feitos</Text>
                </View>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.frequencyButton,
                  pressed && styles.frequencyButtonPressed,
                ]}
                onPress={() => setShowFrequencyModal(true)}
                accessibilityRole="button"
                accessibilityLabel="Alterar frequencia semanal"
              >
                <Text style={styles.frequencyButtonText}>Alterar frequencia</Text>
              </Pressable>
              {frequencyFeedback ? (
                <Text style={styles.feedbackText}>{frequencyFeedback}</Text>
              ) : null}
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
    backgroundColor: '#F8FAFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF5',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0D47A1',
    letterSpacing: 0.3,
  },
  content: {
    padding: 24,
    gap: 8,
  },
  loadingContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    shadowColor: '#0D47A1',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#37474F',
    letterSpacing: 0.2,
  },
  weekProgressContainer: {
    paddingVertical: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0D47A1',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#78909C',
    fontWeight: '400',
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E8EDF5',
  },
  frequencyButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0D47A1',
  },
  frequencyButtonPressed: {
    backgroundColor: '#E3F2FD',
  },
  frequencyButtonText: {
    fontWeight: '600',
    color: '#0D47A1',
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#2E7D32',
  },
});
