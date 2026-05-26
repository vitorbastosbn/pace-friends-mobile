// mobile/src/features/onboarding/SocialSlide.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { PaginationDots } from './PaginationDots';

type Props = {
  onNext: () => void;
};

export function SocialSlide({ onNext }: Props) {
  return (
    <View style={styles.screen}>
      <ExpoStatusBar style="dark" />

      <View style={styles.illustrationArea}>
        <View style={styles.imagePlaceholder}>
          <MaterialIcons name="group" size={80} color={colors.primaryContainer} />
        </View>
        <View style={styles.challengeCard}>
          <View style={styles.challengeIcon}>
            <MaterialIcons name="emoji-events" size={16} color={colors.secondary} />
          </View>
          <View>
            <Text style={styles.challengeLabel}>Desafio</Text>
            <Text style={styles.challengeTitle}>10km de Amigos</Text>
          </View>
        </View>
        <View style={styles.participantsChip}>
          <View style={styles.avatarRow}>
            {[colors.primary, colors.secondary].map((c, i) => (
              <View key={i} style={[styles.avatar, { backgroundColor: c, marginLeft: i > 0 ? -8 : 0 }]}>
                <MaterialIcons name="person" size={12} color={colors.onPrimary} />
              </View>
            ))}
          </View>
          <Text style={styles.participantsText}>+4 entraram agora</Text>
        </View>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.heading}>Corra com amigos</Text>
        <Text style={styles.body}>
          Crie desafios privados ou entre com um código. A competição amigável é o melhor combustível para sua evolução.
        </Text>
      </View>

      <PaginationDots total={3} current={1} />

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel="Próximo"
        >
          <Text style={styles.primaryButtonText}>Próximo</Text>
          <MaterialIcons name="arrow-forward" size={20} color={colors.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },
  illustrationArea: {
    alignItems: 'center',
    borderRadius: 24,
    height: 320,
    justifyContent: 'center',
    marginBottom: 32,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    borderRadius: 24,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  challengeCard: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: 'absolute',
    right: 16,
    top: 20,
  },
  challengeIcon: {
    alignItems: 'center',
    backgroundColor: colors.secondaryContainer,
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  challengeLabel: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
  },
  challengeTitle: {
    color: colors.onSurface,
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
  },
  participantsChip: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.outlineVariant,
    borderRadius: 20,
    borderWidth: 1,
    bottom: 20,
    flexDirection: 'row',
    gap: 8,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
  },
  avatarRow: {
    flexDirection: 'row',
  },
  avatar: {
    alignItems: 'center',
    borderColor: colors.surfaceContainerLowest,
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  participantsText: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },
  textBlock: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  heading: {
    color: colors.onSurface,
    fontFamily: fonts.displayBold,
    fontSize: 28,
    letterSpacing: -0.25,
    lineHeight: 36,
    textAlign: 'center',
  },
  body: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    height: 56,
    justifyContent: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    color: colors.onPrimary,
    fontFamily: fonts.displayBold,
    fontSize: 16,
  },
});
