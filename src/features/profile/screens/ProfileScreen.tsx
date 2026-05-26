import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { signOut } from '../../../services/authService';
import { useAuthNavigation } from '../../../context/auth-navigation-context';
import { useProfile } from '../hooks/useProfile';
import { ProfileCard } from '../components/ProfileCard';
import { StatRow } from '../components/StatRow';
import { OptionPicker } from '../components/OptionPicker';
import { InfoBanner } from '../components/InfoBanner';
import type { UserObjective, WeeklyFrequency } from '../types/profile.types';
import type { PickerOption } from '../components/OptionPicker';

const OBJECTIVE_OPTIONS: PickerOption<UserObjective>[] = [
  { label: 'Perder peso', value: 'LOSE_WEIGHT' },
  { label: 'Ganhar massa', value: 'GAIN_MUSCLE' },
  { label: 'Condicionamento', value: 'IMPROVE_FITNESS' },
  { label: 'Manutencao', value: 'MAINTAIN' },
];

const FREQUENCY_OPTIONS: PickerOption<WeeklyFrequency>[] = [
  { label: '3x por semana', value: 'THREE' },
  { label: '4x por semana', value: 'FOUR' },
  { label: '5x por semana', value: 'FIVE' },
];

interface ProfileScreenProps {
  userId: string;
  token: string;
}

export function ProfileScreen({ userId, token }: ProfileScreenProps) {
  const { completeSignOut } = useAuthNavigation();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const {
    profile,
    loadState,
    saveState,
    loadError,
    saveError,
    pendingObjective,
    pendingFrequency,
    isDirty,
    setObjective,
    setFrequency,
    saveProfile,
    resetChanges,
    reload,
  } = useProfile(userId, token);

  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loadState === 'loading') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      shimmerAnim.stopAnimation();
      shimmerAnim.setValue(1);
    }
  }, [loadState, shimmerAnim]);

  useEffect(() => {
    if (saveState === 'success') {
      Alert.alert('Alteracoes salvas!', 'Suas configuracoes foram atualizadas.', [
        { text: 'OK', style: 'default' },
      ]);
    }
  }, [saveState]);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      completeSignOut();
    }
  }

  function handleCancel() {
    if (isDirty) {
      Alert.alert(
        'Descartar mudancas?',
        'Suas alteracoes nao salvas serao perdidas.',
        [
          { text: 'Nao', style: 'cancel' },
          { text: 'Sim, descartar', style: 'destructive', onPress: resetChanges },
        ]
      );
    }
  }

  const isSubmitting = saveState === 'submitting';
  const isLoading = loadState === 'loading';
  const hasLoadError = loadState === 'error';

  const currentObjective = pendingObjective ?? profile?.objective ?? 'LOSE_WEIGHT';
  const currentFrequency = pendingFrequency ?? profile?.weeklyFrequency ?? 'THREE';

  if (hasLoadError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Perfil</Text>
          <Pressable
            onPress={() => void handleSignOut()}
            style={styles.logoutButton}
            accessibilityLabel="Sair da conta"
            accessibilityRole="button"
            hitSlop={8}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator size="small" color="#D32F2F" />
            ) : (
              <MaterialIcons name="logout" size={22} color="#D32F2F" />
            )}
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Text
            style={styles.errorText}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            {loadError}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.retryButtonPressed,
            ]}
            onPress={reload}
            accessibilityLabel="Tentar novamente"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle} accessibilityRole="header">
          Perfil
        </Text>
        <Pressable
          onPress={() => void handleSignOut()}
          style={styles.logoutButton}
          accessibilityLabel="Sair da conta"
          accessibilityRole="button"
          hitSlop={8}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color="#D32F2F" />
          ) : (
            <MaterialIcons name="logout" size={22} color="#D32F2F" />
          )}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <Animated.View style={{ opacity: shimmerAnim }}>
            <SkeletonBlock height={80} width={80} borderRadius={40} style={styles.skeletonCenter} />
            <SkeletonBlock height={20} width={160} style={styles.skeletonCenter} />
            <SkeletonBlock height={16} width={200} style={[styles.skeletonCenter, { marginBottom: 24 }]} />
            <SkeletonBlock height={48} />
            <SkeletonBlock height={48} />
            <SkeletonBlock height={48} style={{ marginBottom: 24 }} />
            <SkeletonBlock height={52} />
            <SkeletonBlock height={52} />
          </Animated.View>
        ) : (
          <>
            {profile && (
              <ProfileCard
                name={profile.name}
                email={profile.email}
                photoUrl={profile.photoUrl}
              />
            )}

            {/* Stats */}
            <Text style={styles.sectionTitle}>Estatisticas</Text>
            <StatRow
              label="XP Total"
              value={profile?.totalXp ?? 0}
              accessibilityLabel={`XP Total: ${String(profile?.totalXp ?? 0)}`}
            />
            <StatRow
              label="Sequencia atual"
              value={
                (profile?.currentStreak ?? 0) === 1
                  ? '1 dia'
                  : `${String(profile?.currentStreak ?? 0)} dias`
              }
              accessibilityLabel={`Sequencia atual: ${String(profile?.currentStreak ?? 0)} dias`}
            />
            <StatRow
              label="Conquistas"
              value={profile?.achievementsUnlocked ?? 0}
              accessibilityLabel={`Conquistas desbloqueadas: ${String(profile?.achievementsUnlocked ?? 0)}`}
            />

            {/* Settings */}
            <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
              Configuracoes de Treino
            </Text>

            <OptionPicker<UserObjective>
              label="Objetivo Principal"
              options={OBJECTIVE_OPTIONS}
              selectedValue={currentObjective}
              onSelect={setObjective}
              disabled={isSubmitting}
            />

            <OptionPicker<WeeklyFrequency>
              label="Frequencia Semanal"
              options={FREQUENCY_OPTIONS}
              selectedValue={currentFrequency}
              onSelect={setFrequency}
              disabled={isSubmitting}
            />

            <InfoBanner message="Mudancas tem efeito a partir da proxima segunda-feira." />

            {saveError && (
              <Text
                style={styles.saveErrorText}
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
              >
                {saveError}
              </Text>
            )}
          </>
        )}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actionBlock}>
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            (!isDirty || isLoading) && styles.saveButtonDisabled,
            isSubmitting && styles.saveButtonDisabled,
            pressed && isDirty && !isSubmitting && styles.saveButtonPressed,
          ]}
          onPress={() => void saveProfile()}
          disabled={!isDirty || isLoading || isSubmitting}
          accessibilityLabel="Salvar alteracoes"
          accessibilityRole="button"
          accessibilityState={{
            disabled: !isDirty || isLoading || isSubmitting,
            busy: isSubmitting,
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
              accessibilityLabel="Salvando alteracoes"
            />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </Pressable>

        {isDirty && (
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              isSubmitting && styles.cancelButtonDisabled,
              pressed && !isSubmitting && styles.cancelButtonPressed,
            ]}
            onPress={handleCancel}
            disabled={isSubmitting}
            accessibilityLabel="Cancelar e descartar mudancas"
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
          >
            <Text
              style={[
                styles.cancelButtonText,
                isSubmitting && styles.cancelButtonTextDisabled,
              ]}
            >
              Cancelar
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

interface SkeletonBlockProps {
  height: number;
  width?: number | string;
  borderRadius?: number;
  style?: object;
}

function SkeletonBlock({
  height,
  width = '100%',
  borderRadius = 8,
  style,
}: SkeletonBlockProps) {
  return (
    <View
      style={[
        {
          height,
          width: width as number,
          borderRadius,
          backgroundColor: '#E0E0E0',
          marginBottom: 12,
        },
        style,
      ]}
      accessible={false}
    />
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF5',
    backgroundColor: '#F8FAFF',
  },
  logoutButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#0D47A1',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    minWidth: 48,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  skeletonCenter: {
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#546E7A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  sectionTitleSpaced: {
    marginTop: 24,
  },
  saveErrorText: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 8,
  },
  actionBlock: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: '#F8FAFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EDF5',
    gap: 12,
  },
  saveButton: {
    height: 52,
    backgroundColor: '#0D47A1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonPressed: {
    backgroundColor: '#0A3880',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.25,
  },
  cancelButton: {
    height: 52,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#546E7A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonDisabled: {
    opacity: 0.4,
  },
  cancelButtonPressed: {
    backgroundColor: '#EEF2FF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#546E7A',
    letterSpacing: 0.25,
  },
  cancelButtonTextDisabled: {
    color: '#9E9E9E',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  errorText: {
    fontSize: 15,
    color: '#D32F2F',
    textAlign: 'center',
  },
  retryButton: {
    height: 52,
    paddingHorizontal: 32,
    backgroundColor: '#0D47A1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonPressed: {
    backgroundColor: '#0A3880',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
