import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

type Props = {
  total: number;
  current: number;
};

export function PaginationDots({ total, current }: Props) {
  return (
    <View style={styles.row} accessibilityElementsHidden>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 4,
    height: 8,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 24,
  },
  inactiveDot: {
    backgroundColor: colors.outlineVariant,
    width: 8,
  },
});
