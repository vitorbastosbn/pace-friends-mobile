import { Image, StyleSheet, Text, View } from 'react-native';

interface ProfileCardProps {
  name: string;
  email: string;
  photoUrl: string | null;
}

export function ProfileCard({ name, email, photoUrl }: ProfileCardProps) {
  return (
    <View style={styles.container}>
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={styles.avatar}
          accessibilityLabel={`Foto de perfil de ${name}`}
          accessibilityRole="image"
        />
      ) : (
        <View
          style={[styles.avatar, styles.avatarFallback]}
          accessibilityLabel={`Foto de perfil de ${name}`}
          accessible
        >
          <Text style={styles.avatarInitial}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.name} accessibilityRole="header">
        {name}
      </Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarFallback: {
    backgroundColor: '#0D47A1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D47A1',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontWeight: '400',
    color: '#546E7A',
  },
});
