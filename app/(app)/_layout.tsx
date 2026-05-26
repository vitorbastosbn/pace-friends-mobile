import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0D47A1',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8EDF5',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Desafios',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="emoji-events" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trails"
        options={{
          title: 'Trilhas',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="streak" options={{ href: null }} />
      <Tabs.Screen name="challenges/[id]" options={{ href: null }} />
      <Tabs.Screen name="challenges/create" options={{ href: null }} />
      <Tabs.Screen name="challenges/[id]/register-activity" options={{ href: null }} />
      <Tabs.Screen name="challenges/friend-create" options={{ href: null }} />
      <Tabs.Screen name="challenges/join" options={{ href: null }} />
      <Tabs.Screen name="challenges/friend/[id]" options={{ href: null }} />
      <Tabs.Screen name="challenges/friend/[id]/register-check-in" options={{ href: null }} />
    </Tabs>
  );
}
