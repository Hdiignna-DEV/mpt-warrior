import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { authStore } from '@/store/authStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://mpt-warrior.vercel.app/api';

export default function DashboardScreen() {
  const { token, user } = authStore();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Selamat datang, {user?.name}! 👋</Text>
        <Text style={styles.subtitle}>Platform Trading Profesional</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#1e3a8a' }]}>
          <Text style={styles.statLabel}>Win Rate</Text>
          <Text style={styles.statValue}>{dashboard?.winRate || '0'}%</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#7c2d12' }]}>
          <Text style={styles.statLabel}>Total Trades</Text>
          <Text style={styles.statValue}>{dashboard?.totalTrades || '0'}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#065f46' }]}>
          <Text style={styles.statLabel}>Profit/Loss</Text>
          <Text style={styles.statValue}>
            {dashboard?.profitLoss > 0 ? '+' : ''}{dashboard?.profitLoss || '0'}%
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#4c1d95' }]}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={styles.statValue}>${dashboard?.balance || '0'}</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Trades</Text>
        {dashboard?.recentTrades && dashboard.recentTrades.length > 0 ? (
          dashboard.recentTrades.map((trade: any) => (
            <View key={trade.id} style={styles.tradeItem}>
              <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
              <Text style={[styles.tradePnl, { color: trade.pnl > 0 ? '#10b981' : '#ef4444' }]}>
                {trade.pnl > 0 ? '+' : ''}{trade.pnl}%
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Tidak ada trade terbaru</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 16,
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
    borderBottomWidth: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#d1d5db',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  tradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    marginBottom: 8,
  },
  tradeSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  tradePnl: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
