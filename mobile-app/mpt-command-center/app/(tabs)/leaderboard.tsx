import { View, Text } from 'react-native';

export default function LeaderboardScreen() {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#0f172a' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#b45309', marginBottom: 8 }}>🏆 Leaderboard</Text>
      <Text style={{ color: '#fff' }}>Leaderboard Screen</Text>
    </View>
  );
}
          <Text style={styles.title}>🏆 Leaderboard</Text>
          <Text style={styles.subtitle}>Kompetisi dengan Warrior Lain</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🥇 Top 10 Trader</Text>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.leaderboardItem}>
              <Text style={styles.rank}>#{i}</Text>
              <View style={styles.traderInfo}>
                <Text style={styles.traderName}>Trader {i}</Text>
                <Text style={styles.traderStats}>Win Rate: 65% | P&L: +$5000</Text>
              </View>
              <Text style={styles.points}>{1000 - i * 100}pts</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 Ranking Anda</Text>
          <View style={styles.myRankBox}>
            <Text style={styles.myRankText}>Login untuk melihat ranking Anda</Text>
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
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.light.tint, marginBottom: 12 },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint + '20',
  },
  rank: { fontSize: 16, fontWeight: 'bold', color: Colors.light.tint, width: 40 },
  traderInfo: { flex: 1 },
  traderName: { fontSize: 14, fontWeight: '600', color: Colors.dark.text },
  traderStats: { fontSize: 12, color: Colors.dark.tabIconDefault, marginTop: 2 },
  points: { fontSize: 16, fontWeight: 'bold', color: Colors.light.tint },
  myRankBox: { backgroundColor: Colors.dark.background, borderRadius: 8, padding: 16, alignItems: 'center' },
  myRankText: { fontSize: 14, color: Colors.dark.tabIconDefault, fontStyle: 'italic' },
});
