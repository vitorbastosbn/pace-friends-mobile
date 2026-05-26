import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

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
      <Text selectable style={styles.heading}>Próximos Passos</Text>
      <View style={styles.list}>
        <Shortcut
          icon="flag"
          tone="primary"
          title="Desafio individual"
          description="Começar uma meta"
          onPress={onIndividualChallenge}
        />
        <Shortcut
          icon="group"
          tone="secondary"
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
  icon,
  tone,
}: {
  title: string;
  description: string;
  onPress: () => void;
  icon: keyof typeof MaterialIcons.glyphMap;
  tone: 'primary' | 'secondary';
}) {
  const iconColor = tone === 'primary' ? colors.primary : colors.secondary;
  return (
    <Pressable
      style={({ pressed }) => [styles.shortcut, pressed && styles.shortcutPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={[styles.iconBox, tone === 'secondary' && styles.secondaryIconBox]}>
        <MaterialIcons name={icon} size={23} color={iconColor} />
      </View>
      <View style={styles.copy}>
        <Text selectable style={styles.title}>{title}</Text>
        <Text selectable style={styles.description}>{description}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={21} color={colors.outline} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
  heading: {
    color: colors.onSurface,
    fontFamily: fonts.displaySemiBold,
    fontSize: 19,
    lineHeight: 28,
  },
  list: {
    gap: 12,
  },
  shortcut: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.30)',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 16,
    minHeight: 72,
    padding: 16,
  },
  shortcutPressed: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 80, 215, 0.10)',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  secondaryIconBox: {
    backgroundColor: 'rgba(0, 109, 64, 0.10)',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.onSurface,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  description: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    lineHeight: 20,
  },
});
