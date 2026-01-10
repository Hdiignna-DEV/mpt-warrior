import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';

// Screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChatScreen from '../screens/ChatScreen';
import JournalScreen from '../screens/JournalScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddTradeScreen from '../screens/trades/AddTradeScreen';
import EditTradeScreen from '../screens/trades/EditTradeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcons: Record<string, string> = {
  Dashboard: '📊',
  Journal: '📔',
  Chat: '💬',
  Achievements: '🏆',
  Profile: '👤',
};

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e293b',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="DashboardHome"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function JournalStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e293b',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="JournalHome"
        component={JournalScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTrade"
        component={AddTradeScreen}
        options={{
          title: 'Add Trade',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EditTrade"
        component={EditTradeScreen}
        options={{
          title: 'Edit Trade',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e293b',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="ChatHome"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AchievementsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e293b',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="AchievementsHome"
        component={AchievementsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e293b',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const icon = TabIcons[route.name];
          return (
            <View style={{ fontSize: 20 }}>
              {icon}
            </View>
          );
        },
        tabBarActiveTintColor: '#0284c7',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#334155',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalStack}
        options={{
          tabBarLabel: 'Journal',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="Achievements"
        component={AchievementsStack}
        options={{
          tabBarLabel: 'Achievements',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isLoggedIn, hydrate } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await hydrate();
      setIsLoading(false);
    };
    init();
  }, [hydrate]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#0284c7" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Auth" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
