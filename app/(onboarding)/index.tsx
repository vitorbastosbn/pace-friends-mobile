import { StyleSheet, View } from 'react-native';
import { useAuthNavigation } from '../../src/context/auth-navigation-context';
import { markOnboardingComplete } from '../../src/services/onboardingService';
import { StreakSlide } from '../../src/features/onboarding/StreakSlide';
import { SocialSlide } from '../../src/features/onboarding/SocialSlide';
import { TrailsSlide } from '../../src/features/onboarding/TrailsSlide';
import { useState } from 'react';
import { colors } from '../../src/theme/colors';

export default function OnboardingScreen() {
  const [slide, setSlide] = useState<0 | 1 | 2>(0);
  const { completeOnboarding } = useAuthNavigation();

  async function finish() {
    try {
      await markOnboardingComplete();
    } catch (error) {
      console.error('[onboarding] Failed to persist completion:', error);
    }
    completeOnboarding();
  }

  return (
    <View style={styles.container}>
      {slide === 0 && (
        <StreakSlide
          onNext={() => setSlide(1)}
          onSkip={() => { void finish(); }}
        />
      )}
      {slide === 1 && (
        <SocialSlide onNext={() => setSlide(2)} />
      )}
      {slide === 2 && (
        <TrailsSlide onStart={() => { void finish(); }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
