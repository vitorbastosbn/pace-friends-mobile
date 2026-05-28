import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { colors } from '../../../theme/colors';
import { signOut } from '../../../services/authService';
import { useAuthNavigation } from '../../../context/auth-navigation-context';
import { deleteAccount } from '../services/profileService';
import { useProfile } from '../hooks/useProfile';
import { useAchievements } from '../../achievements/hooks/useAchievements';
import { OptionPicker } from '../components/OptionPicker';
import type { UserObjective, WeeklyFrequency } from '../types/profile.types';
import type { PickerOption } from '../components/OptionPicker';

const OBJECTIVE_OPTIONS: PickerOption<UserObjective>[] = [
  { label: 'Perder peso', value: 'LOSE_WEIGHT' },
  { label: 'Ganhar massa', value: 'GAIN_MUSCLE' },
  { label: 'Condicionamento', value: 'IMPROVE_FITNESS' },
  { label: 'Manutenção', value: 'MAINTAIN' },
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

const BADGE_COLORS = [
  { bg: '#DBE1FF', fg: '#0050D7' },
  { bg: '#7DFBB1', fg: '#006D40' },
  { bg: '#FFE08B', fg: '#745B00' },
  { bg: '#DDE9FF', fg: '#0050D7' },
];

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

interface ProfileScreenProps {
  userId: string;
  token: string;
}

export function ProfileScreen({ userId, token }: ProfileScreenProps) {
  const navigation = useNavigation();
  const { completeSignOut } = useAuthNavigation();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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

  const { achievements } = useAchievements(token);

  const shimmerAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (loadState === 'loading') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(shimmerAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      shimmerAnim.stopAnimation();
      shimmerAnim.setValue(1);
    }
  }, [loadState, shimmerAnim]);

  useEffect(() => {
    if (saveState === 'success') {
      setShowSettingsModal(false);
      Alert.alert('Alterações salvas!', 'Suas configurações foram atualizadas.');
    }
  }, [saveState]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => void handleSignOut()}
          style={profileHeaderStyles.iconButton}
          accessibilityLabel="Sair da conta"
          accessibilityRole="button"
          hitSlop={8}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color={colors.onSurfaceVariant} />
          ) : (
            <MaterialIcons name="logout" size={22} color={colors.onSurfaceVariant} />
          )}
        </Pressable>
      ),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, isSigningOut]);

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
      Alert.alert('Erro', 'Não foi possível excluir a conta. Tente novamente.');
    }
  }

  function handleCloseSettings() {
    if (isDirty) {
      Alert.alert(
        'Descartar mudanças?',
        'Suas alterações não salvas serão perdidas.',
        [
          { text: 'Não', style: 'cancel' },
          {
            text: 'Sim, descartar',
            style: 'destructive',
            onPress: () => {
              resetChanges();
              setShowSettingsModal(false);
            },
          },
        ]
      );
    } else {
      setShowSettingsModal(false);
    }
  }

  const isSubmitting = saveState === 'submitting';
  const isLoading = loadState === 'loading';
  const hasLoadError = loadState === 'error';
  const currentObjective = pendingObjective ?? profile?.objective ?? 'LOSE_WEIGHT';
  const currentFrequency = pendingFrequency ?? profile?.weeklyFrequency ?? 'THREE';
  const visibleAchievements = achievements.slice(0, 5);

  if (hasLoadError) {
    return (
      <View style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText} accessibilityRole="alert">
            {loadError}
          </Text>
          <Pressable
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
            onPress={reload}
            accessibilityLabel="Tentar novamente"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <Animated.View style={{ opacity: shimmerAnim }}>
            <SkeletonBlock height={88} style={styles.mb12} />
            <SkeletonBlock height={108} style={styles.mb16} />
            <SkeletonBlock height={100} style={styles.mb16} />
            <SkeletonBlock height={56} style={styles.mb12} />
            <SkeletonBlock height={56} />
          </Animated.View>
        ) : (
          <>
            {profile && (
              <View style={styles.identityCard}>
                <View style={styles.avatarWrapper}>
                  {profile.photoUrl ? (
                    <Image
                      source={{ uri: profile.photoUrl }}
                      style={styles.avatar}
                      accessibilityLabel={`Foto de ${profile.name}`}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarFallback]}>
                      <Text style={styles.avatarInitial}>
                        {profile.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.verifiedBadge}>
                    <MaterialIcons name="verified" size={14} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.identityInfo}>
                  <Text style={styles.userName}>{profile.name}</Text>
                  <Text style={styles.userEmail}>{profile.email}</Text>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>Estatísticas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <MaterialIcons name="stars" size={24} color="#745B00" />
                <Text style={styles.statValue}>{profile?.totalXp ?? 0}</Text>
                <Text style={styles.statLabel}>XP Total</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="local-fire-department" size={24} color="#006D40" />
                <Text style={styles.statValue}>{profile?.currentStreak ?? 0}</Text>
                <Text style={styles.statLabel}>Dias seguidos</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="emoji-events" size={24} color="#0050D7" />
                <Text style={styles.statValue}>{profile?.totalVictories ?? 0}</Text>
                <Text style={styles.statLabel}>Vitórias</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Conquistas</Text>
              <Text style={styles.achievementCount}>
                {profile?.achievementsUnlocked ?? 0}
                {achievements.length > 0 ? `/${achievements.length}` : ''}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementsScroll}
            >
              {visibleAchievements.length > 0 ? (
                visibleAchievements.map((achievement, index) => {
                  const color = BADGE_COLORS[index % BADGE_COLORS.length]!;
                  const iconName = ICON_MAP[achievement.iconKey] ?? 'star';
                  return (
                    <View
                      key={achievement.id}
                      style={styles.achievementItem}
                      accessible
                      accessibilityLabel={`${achievement.name}${achievement.unlocked ? ', desbloqueada' : ', bloqueada'}`}
                    >
                      {achievement.unlocked ? (
                        <View style={[styles.achievementCircle, { backgroundColor: color.bg }]}>
                          <MaterialIcons name={iconName} size={28} color={color.fg} />
                        </View>
                      ) : (
                        <View style={[styles.achievementCircle, styles.achievementLocked]}>
                          <MaterialIcons name={iconName} size={28} color="#C3C6D7" />
                        </View>
                      )}
                      <Text
                        style={[
                          styles.achievementName,
                          !achievement.unlocked && styles.achievementNameLocked,
                        ]}
                        numberOfLines={1}
                      >
                        {achievement.name}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.achievementsEmpty}>Nenhuma conquista ainda</Text>
              )}
            </ScrollView>

            <View style={styles.settingsSection}>
              <Pressable
                style={({ pressed }) => [
                  styles.settingsRow,
                  pressed && styles.settingsRowPressed,
                ]}
                onPress={() => setShowSettingsModal(true)}
                accessibilityLabel="Configurações de treino. Toque para editar."
                accessibilityRole="button"
              >
                <Text style={styles.settingsRowText}>Configurações de treino</Text>
                <MaterialIcons name="chevron-right" size={24} color="#434655" />
              </Pressable>
              <View style={styles.infoBanner}>
                <MaterialIcons name="info" size={18} color="#0050D7" style={styles.infoBannerIcon} />
                <Text style={styles.infoBannerText}>
                  Alterações nas configurações de objetivo e frequência serão aplicadas a partir da
                  próxima semana.
                </Text>
              </View>
            </View>

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
              <Text style={styles.deleteButtonText}>Excluir conta</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <Modal
        visible={showSettingsModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseSettings}
        accessibilityViewIsModal
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseSettings}>
          <View
            style={styles.settingsSheet}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.settingsSheetHeader}>
              <Text style={styles.settingsSheetTitle}>Configurações de treino</Text>
              <Pressable
                onPress={handleCloseSettings}
                style={styles.iconButton}
                hitSlop={8}
                accessibilityLabel="Fechar"
                accessibilityRole="button"
              >
                <MaterialIcons name="close" size={22} color="#434655" />
              </Pressable>
            </View>
            <ScrollView
              style={styles.settingsSheetContent}
              keyboardShouldPersistTaps="handled"
            >
              <OptionPicker<UserObjective>
                label="Objetivo Principal"
                options={OBJECTIVE_OPTIONS}
                selectedValue={currentObjective}
                onSelect={setObjective}
                disabled={isSubmitting}
              />
              <OptionPicker<WeeklyFrequency>
                label="Frequência Semanal"
                options={FREQUENCY_OPTIONS}
                selectedValue={currentFrequency}
                onSelect={setFrequency}
                disabled={isSubmitting}
              />
              {saveError && (
                <Text style={styles.saveErrorText} accessibilityRole="alert">
                  {saveError}
                </Text>
              )}
              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  (!isDirty || isSubmitting) && styles.saveButtonDisabled,
                  pressed && isDirty && !isSubmitting && styles.saveButtonPressed,
                ]}
                onPress={() => void saveProfile()}
                disabled={!isDirty || isSubmitting}
                accessibilityLabel="Salvar configurações"
                accessibilityRole="button"
                accessibilityState={{ disabled: !isDirty || isSubmitting, busy: isSubmitting }}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => !isDeletingAccount && setShowDeleteModal(false)}
        accessibilityViewIsModal
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalCard}>
            <Text style={styles.deleteModalTitle}>Excluir conta?</Text>
            <Text style={styles.deleteModalBody}>
              Todos os seus dados, desafios e conquistas serão removidos permanentemente. Esta ação
              não pode ser desfeita.
            </Text>
            <View style={styles.deleteModalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalCancelButton,
                  isDeletingAccount && styles.modalButtonDisabled,
                  pressed && !isDeletingAccount && styles.modalCancelButtonPressed,
                ]}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeletingAccount}
                accessibilityLabel="Cancelar exclusão"
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
                accessibilityLabel="Confirmar exclusão da conta"
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
    </View>
  );
}

function SkeletonBlock({
  height,
  width = '100%',
  borderRadius = 12,
  style,
}: {
  height: number;
  width?: number | string;
  borderRadius?: number;
  style?: object;
}) {
  return (
    <View
      style={[{ height, width: width as number, borderRadius, backgroundColor: '#E6EEFF' }, style]}
      accessible={false}
    />
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16,
  },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  // Identity card
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#10233B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#DBE1FF',
    backgroundColor: '#E6EEFF',
  },
  avatarFallback: {
    backgroundColor: '#0050D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#006D40',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  identityInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#081C34',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '400',
    color: '#434655',
    lineHeight: 20,
  },
  // Stats grid
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#081C34',
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  achievementCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0050D7',
    letterSpacing: 0.02,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#E6EEFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#081C34',
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#434655',
    textAlign: 'center',
    letterSpacing: 0.05,
  },
  // Achievements
  achievementsScroll: {
    paddingHorizontal: 4,
    gap: 12,
  },
  achievementItem: {
    width: 72,
    alignItems: 'center',
    gap: 6,
  },
  achievementCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10233B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementLocked: {
    backgroundColor: '#DDE9FF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#C3C6D7',
    opacity: 0.5,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#081C34',
    textAlign: 'center',
    letterSpacing: 0.05,
  },
  achievementNameLocked: {
    color: '#737686',
  },
  achievementsEmpty: {
    fontSize: 14,
    color: '#737686',
    paddingVertical: 8,
  },
  // Settings
  settingsSection: {
    gap: 12,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C3C6D7',
  },
  settingsRowPressed: {
    backgroundColor: '#E6EEFF',
  },
  settingsRowText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#081C34',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#DDE9FF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoBannerIcon: {
    marginTop: 1,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#434655',
    lineHeight: 18,
    letterSpacing: 0.05,
  },
  // Delete button
  deleteButton: {
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BA1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonDisabled: {
    opacity: 0.4,
  },
  deleteButtonPressed: {
    backgroundColor: '#FFDAD6',
  },
  deleteButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#BA1A1A',
  },
  // Settings modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8,28,52,0.42)',
    justifyContent: 'flex-end',
  },
  settingsSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
  },
  settingsSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EEFF',
  },
  settingsSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#081C34',
  },
  settingsSheetContent: {
    padding: 20,
  },
  saveErrorText: {
    fontSize: 14,
    color: '#BA1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  saveButton: {
    height: 56,
    backgroundColor: '#0050D7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonPressed: {
    backgroundColor: '#003DA9',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.02,
  },
  // Delete modal
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8,28,52,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  deleteModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#081C34',
    marginBottom: 12,
  },
  deleteModalBody: {
    fontSize: 14,
    color: '#434655',
    lineHeight: 20,
    marginBottom: 24,
  },
  deleteModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#737686',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonPressed: {
    backgroundColor: '#E6EEFF',
  },
  modalCancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#434655',
  },
  modalDeleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#BA1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteButtonPressed: {
    backgroundColor: '#93000A',
  },
  modalDeleteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  // Error state
  errorText: {
    fontSize: 15,
    color: '#BA1A1A',
    textAlign: 'center',
  },
  retryButton: {
    height: 52,
    paddingHorizontal: 32,
    backgroundColor: '#0050D7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonPressed: {
    backgroundColor: '#003DA9',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

const profileHeaderStyles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
});
