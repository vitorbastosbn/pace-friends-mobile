import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

interface XpLevelCardProps {
  totalXp: number;
  currentLevel: number;
  xpForNextLevel: number | null;
}

export function XpLevelCard({ totalXp, currentLevel, xpForNextLevel }: XpLevelCardProps) {
  const missingXp = xpForNextLevel ? Math.max(0, xpForNextLevel - totalXp) : null;
  const progress = xpForNextLevel
    ? Math.min(100, Math.round((totalXp / xpForNextLevel) * 100))
    : 100;

  return (
    <View style={styles.card} accessibilityLabel={`Nível ${currentLevel}, ${totalXp} XP`}>
      <View style={styles.header}>
        <Text selectable style={styles.label}>PROGRESSO</Text>
        <MaterialIcons name="star" size={20} color={colors.tertiaryContainer} />
      </View>
      <View style={styles.body}>
        <Text style={styles.level} selectable>Nível {currentLevel}</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.next} selectable>
          <Text style={styles.xp}>{totalXp.toLocaleString('pt-BR')} XP</Text>
          {missingXp === null ? ' • nível máximo' : ` • faltam ${missingXp}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 148,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.20)',
    boxShadow: '0 4px 12px rgba(16, 35, 59, 0.06)',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 0.7,
  },
  body: {
    gap: 5,
  },
  level: {
    color: colors.onSurface,
    fontFamily: fonts.displayBold,
    fontSize: 22,
    lineHeight: 30,
    fontVariant: ['tabular-nums'],
  },
  xp: {
    color: colors.onSurface,
    fontFamily: fonts.bodyBold,
    fontVariant: ['tabular-nums'],
  },
  track: {
    backgroundColor: 'rgba(195, 198, 215, 0.35)',
    borderRadius: 4,
    height: 7,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.tertiaryContainer,
    borderRadius: 4,
    height: '100%',
  },
  next: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 10,
    lineHeight: 14,
  },
});
