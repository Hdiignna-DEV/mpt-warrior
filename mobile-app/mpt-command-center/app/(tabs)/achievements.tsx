import { View, Text } from 'react-native';

export default function AchievementsScreen() {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#0f172a' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#b45309', marginBottom: 8 }}>🏅 Achievements</Text>
      <Text style={{ color: '#fff' }}>Achievements Screen</Text>
    </View>
  );
}
        <View style={styles.card}>
          <Text style={styles.title}>🏅 Achievements</Text>
          <Text style={styles.subtitle}>Raih Badge dan Milestone</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🌟 Badge Anda</Text>
          <View style={styles.badgesGrid}>
            {['🚀 First Trade', '💯 10 Trades', '🎯 Win 5', '⭐ 50 Days'].map((badge, i) => (
              <View key={i} style={styles.badgeBox}>
                <Text style={styles.badgeEmoji}>{badge.split(' ')[0]}</Text>
                <Text style={styles.badgeName}>{badge.substring(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🎁 Available Badges</Text>
          {['Master Trader', '100 Trades', 'Discipline King', '1000% Profit'].map((badge, i) => (
            <View key={i} style={styles.achievementItem}>
              <Text style={styles.lockedBadge}>🔒</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{badge}</Text>
                <Text style={styles.achievementDesc}>Belum terbuka - terus berkembang!</Text>
              </View>
            </View>
          ))}
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
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  badgeBox: {
    width: '48%',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.tint + '30',
  },
  badgeEmoji: { fontSize: 32, marginBottom: 4 },
  badgeName: { fontSize: 12, color: Colors.dark.text, textAlign: 'center', fontWeight: '600' },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint + '20',
  },
  lockedBadge: { fontSize: 24, marginRight: 12 },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 14, fontWeight: '600', color: Colors.dark.text },
  achievementDesc: { fontSize: 12, color: Colors.dark.tabIconDefault, marginTop: 2 },
});
