import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Achievement } from '../types/achievement.types';

const ICON_MAP: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  footsteps: 'directions-walk',
  flag: 'flag',
  groups: 'groups',
  trophy: 'emoji-events',
  runner: 'directions-run',
  fire: 'local-fire-department',
  flame: 'local-fire-department',
  arrow_upward: 'arrow-upward',
  map: 'map',
};

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { unlocked, name, description, iconKey, progress } = achievement;
  const iconName = ICON_MAP[iconKey] ?? 'star';

  return (
    <View style={[styles.card, unlocked ? styles.cardUnlocked : styles.cardLocked]}>
      <View style={[styles.iconContainer, unlocked ? styles.iconUnlocked : styles.iconLocked]}>
        <MaterialIcons
          name={iconName}
          size={28}
          color={unlocked ? '#FFFFFF' : '#9E9E9E'}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, unlocked ? styles.nameUnlocked : styles.nameLocked]}>
          {name}
        </Text>
        <Text style={[styles.description, unlocked ? styles.descUnlocked : styles.descLocked]}>
          {description}
        </Text>

        {!unlocked && progress !== null && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min((progress.current / progress.total) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {progress.current}/{progress.total}
            </Text>
          </View>
        )}
      </View>

      {unlocked && (
        <MaterialIcons name="check-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
      )}
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
    borderWidth: 1,
  },
  cardUnlocked: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C5CAE9',
  },
  cardLocked: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EEEEEE',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconUnlocked: {
    backgroundColor: '#0D47A1',
  },
  iconLocked: {
    backgroundColor: '#E0E0E0',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  nameUnlocked: {
    color: '#0D47A1',
  },
  nameLocked: {
    color: '#424242',
  },
  description: {
    fontSize: 13,
  },
  descUnlocked: {
    color: '#5C6BC0',
  },
  descLocked: {
    color: '#757575',
  },
  progressContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D47A1',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#546E7A',
    minWidth: 32,
    textAlign: 'right',
  },
  checkIcon: {
    marginLeft: 8,
  },
});
