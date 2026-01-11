import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Colors from '@/constants/colors';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>📊 Dashboard Trading</Text>
          <Text style={styles.subtitle}>Statistik dan Analisis Real-Time</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Win Rate</Text>
              <Text style={styles.statValue}>0%</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Trades</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Profit Loss</Text>
              <Text style={[styles.statValue, { color: '#9ca3af' }]}>$0</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Balance</Text>
              <Text style={styles.statValue}>$0</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📈 Performa Bulan Ini</Text>
          <Text style={styles.placeholder}>Chart akan ditampilkan di sini (integrasi dengan API)</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🎯 Target Trading</Text>
          <Text style={styles.placeholder}>Daily Target: $100 (0%)</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.dark.tint + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.tint + '30',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.tabIconDefault,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint + '20',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.tabIconDefault,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.tint,
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 14,
    color: Colors.dark.tabIconDefault,
    fontStyle: 'italic',
  },
});
