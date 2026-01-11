import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
          borderTopColor: Colors.dark.tabIconDefault,
          height: Platform.OS === 'android' ? 65 : 90,
          paddingBottom: Platform.OS === 'android' ? 8 : 20,
          paddingTop: 8,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.dark.background,
          borderBottomColor: Colors.dark.tabIconDefault,
        },
        headerTintColor: Colors.dark.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: Colors.light.tint,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          headerTitle: 'Dashboard Trading',
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="list" color={color} />,
          headerTitle: 'Trading Journal',
        }}
      />
      <Tabs.Screen
        name="ai-mentor"
        options={{
          title: 'AI Mentor',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="lightbulb-o" color={color} />,
          headerTitle: 'AI Mentor',
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="calculator" color={color} />,
          headerTitle: 'Risk Calculator',
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="trophy" color={color} />,
          headerTitle: 'Leaderboard',
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Achievements',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="star" color={color} />,
          headerTitle: 'My Achievements',
        }}
      />
    </Tabs>
  );
}
