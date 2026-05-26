// mobile/src/features/onboarding/onboardingSharedStyles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export const onboardingSharedStyles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
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
