import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import type { HomeSummary } from '../types/home.types';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

interface TrainingPathCardProps {
  trainingPath: HomeSummary['trainingPath'];
  onPress: () => void;
}

const TRAIL_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBxBj4YUTSUAwsOtFCWamlj6p0IDKIcXShx4NM_c-v24I99rbPdmnD1oFYn7jWM9LmyqugNwBwgyuY4nP73p-ega-IkRe2CV1oBwxyoafgQq_LiaBfp0Nh-EVl6kKDN2V8J7bxeCMPIZyMnKqsjGHwHVkkZ95BsLxDaKlwrfV4Uziao_Zik_EiST39rpjZpoD_kxvlpwCwNYqm7GcDfMBARTx9wcEpAopRO6J87pZgDuQFgp3HpK0yvOJ54grgbjDfLo2_SRPsbDZCi';

export function TrainingPathCard({ trainingPath, onPress }: TrainingPathCardProps) {
  if (!trainingPath.available) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, styles.emptyCard, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Comece sua trilha"
      >
        <Text style={styles.label}>TRILHA</Text>
        <Text style={styles.title}>Comece sua trilha!</Text>
        <Text style={styles.description}>
          Descubra desafios para evoluir no seu ritmo.
        </Text>
      </Pressable>
    );
  }

  const progressPercent = trainingPath.progressPercent ?? 0;
  return (
    <Pressable
      style={({ pressed }) => [styles.heroCard, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir trilha, ${progressPercent} por cento concluida`}
    >
      <ImageBackground source={{ uri: TRAIL_IMAGE }} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <View style={styles.header}>
            <View>
              <Text selectable style={styles.heroLabel}>EM PROGRESSO</Text>
              <Text selectable style={styles.heroTitle}>{trainingPath.currentLevel}</Text>
            </View>
            <Text style={styles.percent} selectable>{progressPercent}%</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondaryContainerLight,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.secondaryContainerLight,
    gap: 13,
  },
  emptyCard: {
    backgroundColor: colors.surfaceContainer,
    borderColor: colors.outlineVariant,
  },
  heroCard: {
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(16, 35, 59, 0.12)',
    height: 192,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(3, 16, 31, 0.43)',
  },
  heroContent: {
    gap: 13,
    padding: 20,
  },
  pressed: {
    opacity: 0.86,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.7,
    marginBottom: 5,
  },
  title: {
    color: colors.onSurface,
    fontFamily: fonts.displayBold,
    fontSize: 18,
  },
  percent: {
    color: colors.onPrimary,
    fontFamily: fonts.displaySemiBold,
    fontSize: 20,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: colors.primaryContainer,
  },
  description: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    lineHeight: 18,
  },
  heroLabel: {
    color: colors.primaryFixed,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.1,
  },
  heroTitle: {
    color: colors.onPrimary,
    fontFamily: fonts.displayBold,
    fontSize: 22,
    lineHeight: 28,
  },
});
