import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAchievements } from '../hooks/useAchievements';
import { AchievementCard } from '../components/AchievementCard';
import { AchievementsEmptyState } from '../components/AchievementsEmptyState';
import type { Achievement } from '../types/achievement.types';

interface AchievementsScreenProps {
  token: string;
}

export function AchievementsScreen({ token }: AchievementsScreenProps) {
  const router = useRouter();
  const { achievements, isLoading, error, reload } = useAchievements(token);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header onBack={() => router.back()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0D47A1" accessibilityLabel="Carregando conquistas" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header onBack={() => router.back()} />
        <View style={styles.centered}>
          <Text style={styles.errorText} accessibilityRole="alert">
            {error}
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
      </SafeAreaView>
    );
  }

  const hasAnyUnlocked = achievements.some((a) => a.unlocked);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header onBack={() => router.back()} />

      <View style={styles.summaryRow}>
        <MaterialIcons name="emoji-events" size={18} color="#0D47A1" />
        <Text style={styles.summaryText}>
          {unlockedCount} de {achievements.length} conquistas desbloqueadas
        </Text>
      </View>

      {achievements.length === 0 || !hasAnyUnlocked ? (
        <FlatList
          data={achievements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Achievement }) => <AchievementCard achievement={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<AchievementsEmptyState />}
        />
      ) : (
        <FlatList
          data={achievements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Achievement }) => <AchievementCard achievement={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        style={styles.backButton}
        accessibilityLabel="Voltar"
        accessibilityRole="button"
        hitSlop={8}
      >
        <MaterialIcons name="arrow-back" size={22} color="#0D47A1" />
      </Pressable>
      <Text style={styles.headerTitle} accessibilityRole="header">
        Conquistas
      </Text>
      <View style={styles.headerSpacer} />
    </View>
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
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF5',
  },
  summaryText: {
    fontSize: 13,
    color: '#546E7A',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },
  centered: {
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
