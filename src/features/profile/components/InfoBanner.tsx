import { StyleSheet, Text, View } from 'react-native';

interface InfoBannerProps {
  message: string;
}

export function InfoBanner({ message }: InfoBannerProps) {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="text"
      accessibilityLabel={message}
    >
      <Text style={styles.icon}>i</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(13,71,161,0.06)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  icon: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D47A1',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#0D47A1',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 1,
  },
  message: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    color: '#546E7A',
    lineHeight: 18,
  },
});
