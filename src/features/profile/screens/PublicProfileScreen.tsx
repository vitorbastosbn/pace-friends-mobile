import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { ProfileServiceError, getPublicProfile } from '../services/profileService';
import type { PublicProfileData } from '../services/profileService';

interface PublicProfileScreenProps {
  userId: string;
}

export function PublicProfileScreen({ userId }: PublicProfileScreenProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [userId])
  );

  async function loadProfile() {
    setLoadState('loading');
    setErrorMessage(null);
    try {
      const data = await getPublicProfile(userId);
      setProfile(data);
      setLoadState('success');
    } catch (err) {
      const message =
        err instanceof ProfileServiceError
          ? err.message
          : 'Erro inesperado ao carregar perfil.';
      setErrorMessage(message);
      setLoadState('error');
    }
  }

  function handleFollow() {
    setIsFollowing((prev) => !prev);
  }

  function handleMessage() {
    Alert.alert('Em breve', 'Mensagens diretas estarão disponíveis em breve.');
  }

  function handleShare() {
    Alert.alert('Compartilhar', 'Compartilhamento de perfil estará disponível em breve.');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          hitSlop={8}
        >
          <MaterialIcons name="arrow-back" size={24} color="#0050D7" />
        </Pressable>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Perfil
        </Text>
        <Pressable
          onPress={handleShare}
          style={styles.iconButton}
          accessibilityLabel="Compartilhar perfil"
          accessibilityRole="button"
          hitSlop={8}
        >
          <MaterialIcons name="share" size={22} color="#434655" />
        </Pressable>
      </View>

      {loadState === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0050D7" />
        </View>
      )}

      {loadState === 'error' && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
            onPress={() => void loadProfile()}
            accessibilityLabel="Tentar novamente"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      )}

      {loadState === 'success' && profile && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Hero section */}
          <View style={styles.heroSection}>
            <View style={styles.avatarWrapper}>
              {profile.avatarUrl ? (
                <Image
                  source={{ uri: profile.avatarUrl }}
                  style={styles.avatar}
                  accessibilityLabel={`Foto de ${profile.name}`}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <MaterialIcons name="person" size={52} color="#FFFFFF" />
                </View>
              )}
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="check-circle" size={14} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.userName}>{profile.name}</Text>

            <View style={styles.actionRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.followButton,
                  isFollowing && styles.followButtonActive,
                  pressed && styles.followButtonPressed,
                ]}
                onPress={handleFollow}
                accessibilityLabel={isFollowing ? 'Deixar de seguir' : 'Seguir'}
                accessibilityRole="button"
              >
                <MaterialIcons
                  name={isFollowing ? 'person-remove' : 'person-add'}
                  size={20}
                  color={isFollowing ? '#0050D7' : '#FFFFFF'}
                />
                <Text style={[styles.followButtonText, isFollowing && styles.followButtonTextActive]}>
                  {isFollowing ? 'Seguindo' : 'Seguir'}
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.messageButton,
                  pressed && styles.messageButtonPressed,
                ]}
                onPress={handleMessage}
                accessibilityLabel="Enviar mensagem"
                accessibilityRole="button"
              >
                <MaterialIcons name="mail-outline" size={22} color="#0050D7" />
              </Pressable>
            </View>
          </View>

          {/* Stats bento grid */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Estatísticas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconWrapper}>
                  <MaterialIcons name="emoji-events" size={24} color="#006D40" />
                </View>
                <Text style={[styles.statValue, styles.statValueSecondary]}>
                  {profile.totalVictories}
                </Text>
                <Text style={styles.statLabel}>Vitórias</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconWrapperTertiary}>
                  <MaterialIcons name="military-tech" size={24} color="#745B00" />
                </View>
                <Text style={[styles.statValue, styles.statValueTertiary]}>
                  {profile.achievementsUnlocked}
                </Text>
                <Text style={styles.statLabel}>Conquistas</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
    backgroundColor: '#F9F9FF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0050D7',
    letterSpacing: -0.25,
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 32,
  },
  // Hero
  heroSection: {
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: '#0050D7',
    backgroundColor: '#E6EEFF',
    shadowColor: '#10233B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarFallback: {
    backgroundColor: '#0050D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#006D40',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#081C34',
    letterSpacing: -0.25,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  followButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#0050D7',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0050D7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  followButtonActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0050D7',
    shadowOpacity: 0,
    elevation: 0,
  },
  followButtonPressed: {
    opacity: 0.85,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.02,
  },
  followButtonTextActive: {
    color: '#0050D7',
  },
  messageButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#737686',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButtonPressed: {
    backgroundColor: '#E6EEFF',
  },
  // Stats
  statsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#081C34',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#10233B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6EEFF',
  },
  statIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,109,64,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconWrapperTertiary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(116,91,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#081C34',
    lineHeight: 40,
    letterSpacing: -0.01,
  },
  statValueSecondary: {
    color: '#006D40',
  },
  statValueTertiary: {
    color: '#745B00',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#434655',
    textAlign: 'center',
    letterSpacing: 0.05,
  },
  // Error
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
