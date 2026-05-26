import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function AchievementsEmptyState() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="emoji-events" size={64} color="#C5CAE9" />
      <Text style={styles.title}>Sua jornada começa aqui!</Text>
      <Text style={styles.message}>
        Complete desafios, registre atividades e conquiste suas primeiras medalhas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D47A1',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#546E7A',
    textAlign: 'center',
    lineHeight: 20,
  },
});
