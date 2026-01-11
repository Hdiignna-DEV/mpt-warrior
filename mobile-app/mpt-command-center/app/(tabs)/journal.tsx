import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Colors from '@/constants/colors';

export default function JournalScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>📔 Trading Journal</Text>
          <Text style={styles.subtitle}>Catat dan Analisis Setiap Trade</Text>
          <Text style={styles.placeholder}>Belum ada catatan. Mulai catat trade Anda sekarang!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Filter & Statistik</Text>
          <View style={styles.statsBox}>
            <Text style={styles.statText}>Total Trades: 0</Text>
            <Text style={styles.statText}>Win: 0 | Loss: 0</Text>
            <Text style={styles.statText}>Total P&L: $0</Text>
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
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.light.tint, marginBottom: 8 },
  placeholder: { fontSize: 14, color: Colors.dark.tabIconDefault, fontStyle: 'italic' },
  statsBox: { backgroundColor: Colors.dark.background, borderRadius: 8, padding: 12 },
  statText: { fontSize: 14, color: Colors.dark.tabIconDefault, marginVertical: 4 },
});
