import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ItemStatus, TrailItem } from '../types/trail.types';

interface TrailItemCardProps {
  item: TrailItem;
}

const STATUS_CONFIG: Record<ItemStatus, { icon: string; color: string; bgColor: string }> = {
  COMPLETED: { icon: '✓', color: '#16a766', bgColor: '#E8F5E9' },
  IN_PROGRESS: { icon: '●', color: '#3a73ff', bgColor: '#E3F0FF' },
  LOCKED: { icon: '🔒', color: '#9E9E9E', bgColor: '#F5F5F5' },
};

export function TrailItemCard({ item }: TrailItemCardProps) {
  const config = STATUS_CONFIG[item.status];

  return (
    <View style={[styles.card, { backgroundColor: config.bgColor }]}>
      <View style={[styles.iconContainer, { borderColor: config.color }]}>
        <Text style={[styles.icon, { color: config.color }]}>{config.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text
          style={[
            styles.description,
            item.status === 'LOCKED' && styles.lockedText,
          ]}
        >
          {item.description}
        </Text>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{item.xpReward} XP</Text>
        </View>
      </View>
      <Text style={[styles.position, { color: config.color }]}>
        {item.position}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#0D47A1',
    fontWeight: '500',
    marginBottom: 4,
  },
  lockedText: {
    color: '#9E9E9E',
  },
  xpBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffcc00',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D47A1',
  },
  position: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
    opacity: 0.5,
  },
});
