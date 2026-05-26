import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/colors';
import type { ItemStatus, TrailItem } from '../types/trail.types';

interface TrailItemCardProps {
  item: TrailItem;
}

export function TrailItemCard({ item }: TrailItemCardProps) {
  const isCompleted = item.status === 'COMPLETED';
  const isCurrent = item.status === 'IN_PROGRESS';
  const isLocked = item.status === 'LOCKED';

  return (
    <View style={styles.row}>
      {/* Circle icon */}
      <View
        style={[
          styles.circle,
          isCompleted && styles.circleCompleted,
          isCurrent && styles.circleCurrent,
          isLocked && styles.circleLocked,
        ]}
      >
        <Text style={[
          styles.circleIcon,
          isCompleted && styles.circleIconCompleted,
          isCurrent && styles.circleIconCurrent,
          isLocked && styles.circleIconLocked,
        ]}>
          {isCompleted ? '✓' : isCurrent ? '▶' : '🔒'}
        </Text>
      </View>

      {/* Card */}
      <View
        style={[
          styles.card,
          isCompleted && styles.cardCompleted,
          isCurrent && styles.cardCurrent,
          isLocked && styles.cardLocked,
        ]}
      >
        {/* Current mission: left accent bar */}
        {isCurrent && <View style={styles.accentBar} />}

        <View style={styles.cardInner}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.title,
                isCompleted && styles.titleCompleted,
                isCurrent && styles.titleCurrent,
                isLocked && styles.titleLocked,
              ]}
            >
              {item.description}
            </Text>
            {isCurrent && (
              <View style={styles.nextMissionBadge}>
                <Text style={styles.nextMissionText}>Próxima missão</Text>
              </View>
            )}
          </View>

          {/* XP reward */}
          <Text style={[styles.xpLabel, isLocked && styles.xpLabelLocked]}>
            +{item.xpReward} XP
          </Text>

          {/* CTA button for current */}
          {isCurrent && (
            <TouchableOpacity style={styles.startButton} activeOpacity={0.85}>
              <Text style={styles.startButtonText}>Iniciar Missão  ▶</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },

  // --- Circle ---
  circle: {
    flexShrink: 0,
    width: 48,
    height: 48,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  circleCompleted: {
    backgroundColor: colors.secondaryContainer,
  },
  circleCurrent: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 6,
  },
  circleLocked: {
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowOpacity: 0,
    elevation: 0,
  },
  circleIcon: {
    fontSize: 18,
  },
  circleIconCompleted: {
    color: colors.onSecondaryContainer,
    fontWeight: '700',
  },
  circleIconCurrent: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  circleIconLocked: {
    color: colors.outline,
    fontSize: 16,
  },

  // --- Card ---
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: `rgba(195, 198, 215, 0.2)`,
    opacity: 0.7,
  },
  cardCurrent: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  cardLocked: {
    backgroundColor: colors.surfaceContainerLow,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    shadowOpacity: 0,
    elevation: 0,
  },

  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
    borderRadius: 9999,
  },

  cardInner: {
    padding: 16,
    paddingLeft: 20, // extra left padding to clear accent bar on current
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },

  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.02 * 14,
    color: colors.onSurface,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.onSurface,
  },
  titleCurrent: {
    color: colors.primary,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.05 * 14,
  },
  titleLocked: {
    color: colors.outline,
  },

  nextMissionBadge: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  nextMissionText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.onPrimaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  xpLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  xpLabelLocked: {
    color: colors.outlineVariant,
  },

  startButton: {
    marginTop: 12,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.02 * 14,
  },
});
