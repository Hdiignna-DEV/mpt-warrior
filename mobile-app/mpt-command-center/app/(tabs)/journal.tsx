import { View, Text } from 'react-native';

export default function JournalScreen() {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#0f172a' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#b45309', marginBottom: 8 }}>📔 Journal</Text>
      <Text style={{ color: '#fff' }}>Trading Journal Screen</Text>
    </View>
  );
}
