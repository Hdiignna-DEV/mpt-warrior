import { View, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import Colors from '@/constants/colors';

export default function CalculatorScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>🧮 Risk Calculator</Text>
          <Text style={styles.subtitle}>Hitung Risk & Position Size</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Account Balance ($)</Text>
          <TextInput style={styles.input} placeholder="10000" placeholderTextColor={Colors.dark.tabIconDefault} />

          <Text style={styles.label}>Risk Per Trade (%)</Text>
          <TextInput style={styles.input} placeholder="2" placeholderTextColor={Colors.dark.tabIconDefault} />

          <Text style={styles.label}>Entry Price</Text>
          <TextInput style={styles.input} placeholder="1.2000" placeholderTextColor={Colors.dark.tabIconDefault} />

          <Text style={styles.label}>Stop Loss Price</Text>
          <TextInput style={styles.input} placeholder="1.1950" placeholderTextColor={Colors.dark.tabIconDefault} />

          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Risk Amount</Text>
            <Text style={styles.resultValue}>$0</Text>
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Position Size</Text>
            <Text style={styles.resultValue}>0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: 16 },
  card: {
    backgroundColor: Colors.dark.tint + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.tint + '30',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.light.tint, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.dark.tabIconDefault, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.light.tint, marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: Colors.light.tint + '30',
    marginBottom: 12,
  },
  resultBox: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.light.tint + '50',
  },
  resultLabel: { fontSize: 12, color: Colors.dark.tabIconDefault },
  resultValue: { fontSize: 20, fontWeight: 'bold', color: Colors.light.tint, marginTop: 4 },
});
