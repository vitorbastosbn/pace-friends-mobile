import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface LevelUpBannerProps {
  isLoading: boolean;
  onLevelUp: () => void;
}

export function LevelUpBanner({ isLoading, onLevelUp }: LevelUpBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.star}>★</Text>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Pronto para evoluir!</Text>
        <Text style={styles.subtitle}>
          Voce completou todos os criterios para avançar de nivel.
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={onLevelUp}
        disabled={isLoading}
        accessibilityLabel="Evoluir de nivel"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Evoluir</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#E3F0FF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#3a73ff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  star: {
    fontSize: 28,
    color: '#ffcc00',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D47A1',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#546E7A',
  },
  button: {
    backgroundColor: '#3a73ff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
