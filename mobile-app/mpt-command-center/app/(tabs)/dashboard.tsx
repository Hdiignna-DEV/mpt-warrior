import { View, Text } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#0f172a' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#b45309', marginBottom: 8 }}>📊 Dashboard</Text>
      <Text style={{ color: '#fff' }}>Trading Dashboard Screen</Text>
    </View>
  );
}
