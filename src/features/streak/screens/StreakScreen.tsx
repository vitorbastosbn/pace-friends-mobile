import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { StreakCard, StreakCardError } from '../components/StreakCard';
import { XpDisplay } from '../components/XpDisplay';
import { useStreak } from '../hooks/useStreak';
import { UpdateFrequencyModal } from './UpdateFrequencyModal';
import { getUserAchievements } from '../../achievements/services/achievementsService';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';
import type { UpdateFrequencyResponse } from '../../profile/types/profile.types';

interface StreakScreenProps {
  token: string;
}

export function StreakScreen({ token }: StreakScreenProps) {
  const navigation = useNavigation();
  const { streak, isLoading, error, reload } = useStreak(token);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [badgeCount, setBadgeCount] = useState<number | null>(null);

  useEffect(() => {
    getUserAchievements(token)
      .then((achievements) => setBadgeCount(achievements.filter((a) => a.unlocked).length))
      .catch(() => {});
  }, [token]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => streak && setShowFrequencyModal(true)}
          style={styles.iconButton}
          accessibilityLabel="Configurar frequência"
          accessibilityRole="button"
        >
          <MaterialIcons name="settings" size={24} color={colors.primary} />
        </Pressable>
      ),
    });
  }, [navigation, streak]);

  function handleFrequencySaved(response: UpdateFrequencyResponse) {
    const date = new Date(`${response.effectiveFrom}T00:00:00`);
    const effectiveDate = date.toLocaleDateString('pt-BR');
    Alert.alert(
      'Frequência atualizada',
      `Sua nova meta de ${response.weeklyFrequency} dias vale a partir de ${effectiveDate}.`
    );
    setShowFrequencyModal(false);
    reload();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
              accessibilityLabel="Carregando ofensiva"
            />
          </View>
        )}

        {!isLoading && error && <StreakCardError message={error} onRetry={reload} />}

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

            <View style={styles.bentoGrid}>
              <View style={styles.bentoItemPrimary}>
                <MaterialIcons name="bolt" size={24} color={colors.primary} />
                <Text style={styles.bentoLabelPrimary}>Próximo Marco</Text>
                <Text style={styles.bentoValue}>30 Dias</Text>
              </View>
              <View style={styles.bentoItemSecondary}>
                <MaterialIcons name="military-tech" size={24} color={colors.secondary} />
                <Text style={styles.bentoLabelSecondary}>Conquistas</Text>
                <Text style={styles.bentoValue}>
                  {badgeCount === null ? '–' : `${badgeCount} conquistas`}
                </Text>
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
    backgroundColor: colors.background,
    flex: 1,
  },
  iconButton: {
    borderRadius: 20,
    padding: 8,
  },
  iconButtonPressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
  content: {
    gap: 16,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  bentoItemPrimary: {
    backgroundColor: 'rgba(219,225,255,0.4)',
    borderColor: 'rgba(219,225,255,0.6)',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    padding: 16,
  },
  bentoItemSecondary: {
    backgroundColor: 'rgba(125,251,177,0.10)',
    borderColor: 'rgba(125,251,177,0.20)',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    padding: 16,
  },
  bentoLabelPrimary: {
    color: colors.primary,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  bentoLabelSecondary: {
    color: colors.secondary,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  bentoValue: {
    color: colors.onSurface,
    fontFamily: fonts.displaySemiBold,
    fontSize: 20,
    lineHeight: 28,
  },
});
