import { View, Text } from 'react-native';

export default function AchievementsScreen() {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#0f172a' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#b45309', marginBottom: 8 }}>🏅 Achievements</Text>
      <Text style={{ color: '#fff' }}>Achievements Screen</Text>
    </View>
  );
}
