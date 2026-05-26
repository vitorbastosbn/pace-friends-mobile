import { StyleSheet, Text, View } from 'react-native';
import type { ChallengeType, RankingEntry } from '../types/challenge.types';

interface RankingListProps {
  challengeType: ChallengeType;
  entries: RankingEntry[];
}

const MEDALS: Record<number, { symbol: string; tone: string; background: string }> = {
  1: { symbol: '1', tone: '#9A6500', background: '#FFE7A7' },
  2: { symbol: '2', tone: '#5C6572', background: '#E4EAF1' },
  3: { symbol: '3', tone: '#884A27', background: '#F6D1B5' },
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
          <View key={entry.userId} style={[styles.row, medal ? styles.topRow : null]}>
            <View style={[styles.position, medal ? { backgroundColor: medal.background } : null]}>
              <Text selectable style={[styles.positionText, medal ? { color: medal.tone } : null]}>
                {medal?.symbol ?? entry.position}
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
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#E7EDF5',
  },
  topRow: {
    backgroundColor: '#FCFDFE',
  },
  position: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#EFF3F7',
  },
  positionText: {
    color: '#5E7186',
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: '#15263B',
    fontSize: 14,
    fontWeight: '700',
  },
  meta: {
    color: '#718397',
    fontSize: 12,
  },
  score: {
    color: '#1B49CE',
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  empty: {
    color: '#718397',
    fontSize: 14,
    lineHeight: 20,
  },
});
