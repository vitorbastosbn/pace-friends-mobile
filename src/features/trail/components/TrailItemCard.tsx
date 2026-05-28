import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import type { ItemStatus, TrailItem } from '../types/trail.types';

interface TrailItemCardProps {
  item: TrailItem;
}

export function TrailItemCard({ item }: TrailItemCardProps) {
  const isCompleted = item.status === 'COMPLETED';
  const isCurrent = item.status === 'IN_PROGRESS';
  const isLocked = item.status === 'LOCKED';

  const rowContent = (
    <>
      {/* Circle icon */}
      <View
        style={[
          styles.circle,
          isCompleted && styles.circleCompleted,
          isCurrent && styles.circleCurrent,
          isLocked && styles.circleLocked,
        ]}
      >
        {isCompleted && (
          <MaterialIcons name="check" size={24} color={colors.onSecondaryContainer} />
        )}
        {isCurrent && (
          <MaterialIcons name="directions-run" size={24} color={colors.onPrimary} />
        )}
        {isLocked && (
          <MaterialIcons name="lock" size={20} color={colors.outline} />
        )}
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
                <Text style={styles.nextMissionText}>Em andamento</Text>
              </View>
            )}
          </View>

          {/* Inline progress bar for current item */}
          {isCurrent && (
            <View style={styles.itemProgressContainer}>
              <View style={styles.itemProgressLabelRow}>
                <Text style={styles.itemProgressLabel}>Progresso</Text>
                <Text style={styles.itemProgressPct}>0%</Text>
              </View>
              <View style={styles.itemProgressTrack}>
                <View style={styles.itemProgressFill} />
              </View>
            </View>
          )}
        </View>
      </View>
    </>
  );

  if (isLocked) {
    return (
      <View style={[styles.row, styles.rowLocked]}>
        {rowContent}
      </View>
    );
  }

  return <View style={styles.row}>{rowContent}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  rowLocked: {
    opacity: 0.5,
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

  itemProgressContainer: {
    marginTop: 12,
    gap: 6,
  },
  itemProgressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemProgressLabel: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  itemProgressPct: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  itemProgressTrack: {
    height: 6,
    backgroundColor: `rgba(195, 198, 215, 0.3)`,
    borderRadius: 3,
    overflow: 'hidden',
  },
  itemProgressFill: {
    width: '0%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

});
