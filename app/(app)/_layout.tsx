import { Pressable, StyleSheet, View, type ColorValue } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '../../src/theme/colors';
import { fonts } from '../../src/theme/typography';

type TabIconProps = {
  color: ColorValue;
  focused: boolean;
  name: keyof typeof MaterialIcons.glyphMap;
  size: number;
};

function TabIcon({ color, focused, name, size }: TabIconProps) {
  return (
    <View style={styles.iconContainer}>
      <MaterialIcons name={name} size={size} color={color} />
      {focused ? <View style={styles.activeDot} /> : null}
    </View>
  );
}

function BackButton() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.back()}
      style={styles.backButton}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
    >
      <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
    </Pressable>
  );
}

const tabHeaderOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTitleStyle: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: colors.primary,
  },
};

const subHeaderOptions = {
  href: null as null,
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTitleStyle: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.primary,
  },
  headerLeft: () => <BackButton />,
  headerTintColor: colors.primary,
};

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopWidth: 0,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          boxShadow: '0 -4px 16px rgba(16, 35, 59, 0.08)',
          height: 80,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 10,
        },
      }}
    >
      {/* Tab screens — order: Home, Desafios, Trilhas, Perfil */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Pace Friends',
          ...tabHeaderOptions,
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon name="home" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Desafios',
          ...tabHeaderOptions,
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon name="emoji-events" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="trails"
        options={{
          title: 'Trilhas',
          ...tabHeaderOptions,
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon name="map" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          ...tabHeaderOptions,
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon name="person" size={size} color={color} focused={focused} />
          ),
        }}
      />

      {/* Hidden sub-screens */}
      <Tabs.Screen name="achievements" options={{ ...subHeaderOptions, title: 'Conquistas' }} />
      <Tabs.Screen name="streak" options={{ ...subHeaderOptions, title: 'Ofensiva' }} />
      <Tabs.Screen name="challenges/[id]" options={{ ...subHeaderOptions, title: 'Desafio' }} />
      <Tabs.Screen name="challenges/create" options={{ ...subHeaderOptions, title: 'Novo Desafio' }} />
      <Tabs.Screen name="challenges/friend-create" options={{ ...subHeaderOptions, title: 'Novo Desafio' }} />
      <Tabs.Screen name="challenges/history" options={{ ...subHeaderOptions, title: 'Histórico' }} />
      <Tabs.Screen name="challenges/friend/[id]" options={{ ...subHeaderOptions, title: 'Desafio' }} />
      <Tabs.Screen
        name="challenges/[id]/register-activity"
        options={{ ...subHeaderOptions, title: 'Registrar Atividade' }}
      />
      <Tabs.Screen
        name="challenges/friend/[id]/register-check-in"
        options={{ ...subHeaderOptions, title: 'Registrar Check-in' }}
      />
      <Tabs.Screen name="profile/[userId]" options={{ ...subHeaderOptions, title: 'Perfil' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    height: 29,
    justifyContent: 'flex-start',
  },
  activeDot: {
    backgroundColor: colors.primary,
    borderRadius: 2,
    height: 4,
    marginTop: 2,
    width: 4,
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginLeft: 4,
  },
});
