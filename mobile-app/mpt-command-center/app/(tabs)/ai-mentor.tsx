import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Colors from '@/constants/colors';

export default function AIMentorScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>🤖 AI Mentor</Text>
          <Text style={styles.subtitle}>Dapatkan Saran Cerdas dari AI</Text>
          <Text style={styles.placeholder}>Terhubung ke AI Mentor... Analisis trade Anda dan dapatkan insights berharga!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💡 Tip Hari Ini</Text>
          <Text style={styles.tipText}>Manajemen risiko adalah kunci kesuksesan trading jangka panjang. Selalu gunakan stop loss dan jangan over-leverage!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📊 Analisis Terakhir</Text>
          <Text style={styles.placeholder}>Belum ada analisis. Mulai upload chart atau trade Anda!</Text>
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
  tipText: { fontSize: 14, color: Colors.dark.text, lineHeight: 20 },
});
