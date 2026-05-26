import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          hitSlop={8}
        >
          <MaterialIcons name="arrow-back" size={24} color="#0D47A1" />
        </Pressable>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Perfil
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {loadState === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0D47A1" />
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
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.avatarSection}>
            {profile.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatar}
                accessibilityLabel={`Foto de ${profile.name}`}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={48} color="#90A4AE" />
              </View>
            )}
            <Text style={styles.name}>{profile.name}</Text>
          </View>

          <Text style={styles.sectionTitle}>Estatisticas</Text>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Vitorias em desafios</Text>
            <Text
              style={styles.statValue}
              accessibilityLabel={`Vitorias em desafios: ${String(profile.totalVictories)}`}
            >
              {profile.totalVictories}
            </Text>
          </View>

          <View style={[styles.statRow, styles.statRowLast]}>
            <Text style={styles.statLabel}>Conquistas</Text>
            <Text
              style={styles.statValue}
              accessibilityLabel={`Conquistas desbloqueadas: ${String(profile.achievementsUnlocked)}`}
            >
              {profile.achievementsUnlocked}
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
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
  backButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'flex-start',
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 12,
    backgroundColor: '#E8EDF5',
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8EDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0D1B2A',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#546E7A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF5',
  },
  statRowLast: {
    borderBottomWidth: 0,
  },
  statLabel: {
    fontSize: 15,
    color: '#546E7A',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D47A1',
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
