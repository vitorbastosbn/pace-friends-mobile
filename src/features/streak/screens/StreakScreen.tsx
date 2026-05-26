import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StreakCard, StreakCardError } from '../components/StreakCard';
import { WeekProgress } from '../components/WeekProgress';
import { useStreak } from '../hooks/useStreak';

interface StreakScreenProps {
  token: string;
}

export function StreakScreen({ token }: StreakScreenProps) {
  const { streak, isLoading, error, reload } = useStreak(token);

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
              <View style={styles.xpContainer}>
                <Text style={styles.xpValue}>+{streak.potentialXp}</Text>
                <Text style={styles.xpUnit}>XP</Text>
              </View>
              {streak.remainingDays > 0 ? (
                <Text style={styles.xpHint}>
                  Complete mais {streak.remainingDays} dia{streak.remainingDays !== 1 ? 's' : ''} esta semana para ganhar {streak.potentialXp} XP.
                </Text>
              ) : (
                <Text style={[styles.xpHint, styles.xpHintSuccess]}>
                  Parabens! Voce atingiu sua meta semanal.
                </Text>
              )}
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
            </View>
          </>
        )}
      </ScrollView>
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
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  xpValue: {
    fontSize: 40,
    fontWeight: '700',
    color: '#0D47A1',
    lineHeight: 44,
  },
  xpUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D47A1',
  },
  xpHint: {
    fontSize: 13,
    color: '#78909C',
    fontWeight: '400',
    lineHeight: 18,
  },
  xpHintSuccess: {
    color: '#2E7D32',
    fontWeight: '600',
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
});
