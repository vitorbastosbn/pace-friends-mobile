import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';

interface HomeShortcutsProps {
  onIndividualChallenge: () => void;
  onFriendChallenges: () => void;
}

export function HomeShortcuts({
  onIndividualChallenge,
  onFriendChallenges,
}: HomeShortcutsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>ATALHOS</Text>
      <View style={styles.row}>
        <Shortcut
          title="Desafio individual"
          description="Comecar uma meta"
          onPress={onIndividualChallenge}
        />
        <Shortcut
          title="Com amigos"
          description="Ver desafios"
          onPress={onFriendChallenges}
        />
      </View>
    </View>
  );
}

function Shortcut({
  title,
  description,
  onPress,
}: {
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.shortcut, pressed && styles.shortcutPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.arrow}>Abrir &gt;</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  label: {
    color: colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  shortcut: {
    flex: 1,
    padding: 15,
    minHeight: 108,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    gap: 5,
  },
  shortcutPressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
  title: {
    color: colors.onSurface,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
  },
  description: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
  },
  arrow: {
    marginTop: 'auto',
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
