import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../../theme/colors';

interface LevelUpBannerProps {
  isLoading: boolean;
  onLevelUp: () => void;
}

export function LevelUpBanner({ isLoading, onLevelUp }: LevelUpBannerProps) {
  return (
    <View style={styles.banner}>
      {/* Decorative glow blob (simulated) */}
      <View style={styles.decorBlob} />

      <View style={styles.content}>
        <Text style={styles.title}>Pronto para evoluir!</Text>
        <Text style={styles.subtitle}>
          Você completou todos os critérios para avançar de nível.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={onLevelUp}
        disabled={isLoading}
        activeOpacity={0.85}
        accessibilityLabel="Evoluir de nivel"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.onSurface} />
        ) : (
          <Text style={styles.buttonText}>Evoluir ★</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.inverseSurface,
    borderRadius: 16,
    padding: 24,
    overflow: 'hidden',
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    gap: 16,
  },
  decorBlob: {
    position: 'absolute',
    right: -32,
    top: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: `rgba(0, 80, 215, 0.2)`,
  },
  content: {
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.inverseOnSurface,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    color: `rgba(195, 198, 215, 0.8)`,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.tertiaryFixed,
    borderRadius: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.onSurface,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.02 * 14,
  },
});
