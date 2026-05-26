import { StyleSheet, Text, View } from 'react-native';
import type { ChallengeType, RankingEntry } from '../types/challenge.types';
import { colors } from '../../../theme/colors';

interface RankingListProps {
  challengeType: ChallengeType;
  entries: RankingEntry[];
}

const MEDALS: Record<number, { tone: string; background: string; border: string }> = {
  1: { tone: colors.tertiary, background: colors.tertiaryFixed, border: colors.tertiaryContainer },
  2: { tone: colors.onSurfaceVariant, background: colors.surfaceContainerHigh, border: colors.outlineVariant },
  3: { tone: '#884A27', background: '#F6D1B5', border: '#E8AA88' },
};

function formatScore(type: ChallengeType, score: number): string {
  if (type === 'DISTANCE') {
    return `${score.toFixed(1)} km`;
  }
  if (type === 'ACTIVITY_TIME') {
    return `${Math.round(score / 60)} min`;
  }
  if (type === 'PACE') {
    const minutes = Math.floor(score / 60);
    const seconds = Math.round(score % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}/km`;
  }
  return `${Math.round(score)} dias`;
}

export function RankingList({ challengeType, entries }: RankingListProps) {
  if (entries.length === 0) {
    return <Text selectable style={styles.empty}>Ainda nao ha pontuacao neste desafio.</Text>;
  }

  return (
    <View style={styles.list}>
      {entries.map((entry) => {
        const medal = MEDALS[entry.position];
        return (
          <View
            key={entry.userId}
            style={[
              styles.row,
              medal && entry.position === 1 ? styles.firstPlace : null,
            ]}
          >
            <View
              style={[
                styles.position,
                medal ? { backgroundColor: medal.background, borderColor: medal.border } : null,
              ]}
            >
              <Text
                selectable
                style={[styles.positionText, medal ? { color: medal.tone } : null]}
              >
                {entry.position}º
              </Text>
            </View>
            <View style={styles.info}>
              <Text selectable style={styles.name}>{entry.name}</Text>
              <Text selectable style={styles.meta}>
                {entry.checkInCount} check-in{entry.checkInCount === 1 ? '' : 's'}
              </Text>
            </View>
            <Text selectable style={styles.score}>{formatScore(challengeType, entry.score)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    shadowColor: colors.onSurface,
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  firstPlace: {
    backgroundColor: colors.surfaceContainerLow,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  position: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  positionText: {
    color: colors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.02,
  },
  meta: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '400',
  },
  score: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  empty: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
});
