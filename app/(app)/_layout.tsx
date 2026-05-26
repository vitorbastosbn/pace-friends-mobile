import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View, type ColorValue } from 'react-native';

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

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon name="home" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon name="person" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Desafios',
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon name="emoji-events" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="trails"
        options={{
          title: 'Trilhas',
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon name="map" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="achievements" options={{ href: null }} />
      <Tabs.Screen name="streak" options={{ href: null }} />
      <Tabs.Screen name="challenges/[id]" options={{ href: null }} />
      <Tabs.Screen name="challenges/create" options={{ href: null }} />
      <Tabs.Screen name="challenges/[id]/register-activity" options={{ href: null }} />
      <Tabs.Screen name="challenges/friend-create" options={{ href: null }} />
      <Tabs.Screen name="challenges/join" options={{ href: null }} />
      <Tabs.Screen name="challenges/friend/[id]" options={{ href: null }} />
      <Tabs.Screen name="challenges/friend/[id]/register-check-in" options={{ href: null }} />
      <Tabs.Screen name="profile/[userId]" options={{ href: null }} />
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
});
