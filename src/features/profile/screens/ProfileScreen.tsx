import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from '../../../services/authService';
import { useAuthNavigation } from '../../../context/auth-navigation-context';
import { deleteAccount } from '../services/profileService';
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
  { label: '1x por semana', value: 'ONE' },
  { label: '2x por semana', value: 'TWO' },
  { label: '3x por semana', value: 'THREE' },
  { label: '4x por semana', value: 'FOUR' },
  { label: '5x por semana', value: 'FIVE' },
  { label: '6x por semana', value: 'SIX' },
  { label: '7x por semana', value: 'SEVEN' },
];

interface ProfileScreenProps {
  userId: string;
  token: string;
}

export function ProfileScreen({ userId, token }: ProfileScreenProps) {
  const { completeSignOut } = useAuthNavigation();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
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

  async function handleDeleteAccount() {
    setIsDeletingAccount(true);
    try {
      await deleteAccount(userId, token);
      await signOut();
      completeSignOut();
    } catch {
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
      Alert.alert('Erro', 'Nao foi possivel excluir a conta. Tente novamente.');
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
              label="Vitorias"
              value={profile?.totalVictories ?? 0}
              accessibilityLabel={`Vitorias em desafios: ${String(profile?.totalVictories ?? 0)}`}
            />
            <Pressable
              onPress={() => router.push('/(app)/achievements')}
              accessibilityLabel={`Conquistas desbloqueadas: ${String(profile?.achievementsUnlocked ?? 0)}. Toque para ver todas`}
              accessibilityRole="button"
              style={({ pressed }) => [styles.achievementsRow, pressed && styles.achievementsRowPressed]}
            >
              <View style={styles.achievementsLabel}>
                <Text style={styles.achievementsLabelText}>Conquistas</Text>
                <Text style={styles.achievementsValue}>{profile?.achievementsUnlocked ?? 0}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#546E7A" />
            </Pressable>

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

        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            (isLoading || isSubmitting) && styles.deleteButtonDisabled,
            pressed && !isLoading && !isSubmitting && styles.deleteButtonPressed,
          ]}
          onPress={() => setShowDeleteModal(true)}
          disabled={isLoading || isSubmitting}
          accessibilityLabel="Excluir conta"
          accessibilityRole="button"
          accessibilityState={{ disabled: isLoading || isSubmitting }}
        >
          <Text style={[styles.deleteButtonText, (isLoading || isSubmitting) && styles.deleteButtonTextDisabled]}>
            Excluir conta
          </Text>
        </Pressable>
      </View>

      {/* Delete account confirmation modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => !isDeletingAccount && setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Excluir conta?</Text>
            <Text style={styles.modalBody}>
              Todos os seus dados, desafios e conquistas serao removidos permanentemente. Esta acao nao pode ser desfeita.
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalCancelButton,
                  isDeletingAccount && styles.modalButtonDisabled,
                  pressed && !isDeletingAccount && styles.modalCancelButtonPressed,
                ]}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeletingAccount}
                accessibilityLabel="Cancelar exclusao"
                accessibilityRole="button"
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.modalDeleteButton,
                  isDeletingAccount && styles.modalButtonDisabled,
                  pressed && !isDeletingAccount && styles.modalDeleteButtonPressed,
                ]}
                onPress={() => void handleDeleteAccount()}
                disabled={isDeletingAccount}
                accessibilityLabel="Confirmar exclusao da conta"
                accessibilityRole="button"
                accessibilityState={{ busy: isDeletingAccount }}
              >
                {isDeletingAccount ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalDeleteButtonText}>Excluir conta</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  achievementsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF5',
    marginBottom: 4,
  },
  achievementsRowPressed: {
    opacity: 0.7,
  },
  achievementsLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  achievementsLabelText: {
    fontSize: 15,
    color: '#546E7A',
    fontWeight: '500',
  },
  achievementsValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D47A1',
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
  deleteButton: {
    height: 48,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  deleteButtonDisabled: {
    opacity: 0.4,
  },
  deleteButtonPressed: {
    backgroundColor: '#FFEBEE',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D32F2F',
    letterSpacing: 0.2,
  },
  deleteButtonTextDisabled: {
    color: '#E57373',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D1B2A',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 14,
    color: '#546E7A',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#546E7A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonPressed: {
    backgroundColor: '#EEF2FF',
  },
  modalCancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#546E7A',
  },
  modalDeleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteButtonPressed: {
    backgroundColor: '#B71C1C',
  },
  modalDeleteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
});
