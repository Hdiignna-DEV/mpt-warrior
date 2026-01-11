import { View, Text } from 'react-native';

export default function LeaderboardScreen() {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#0f172a' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#b45309', marginBottom: 8 }}>🏆 Leaderboard</Text>
      <Text style={{ color: '#fff' }}>Leaderboard Screen</Text>
    </View>
  );
}
