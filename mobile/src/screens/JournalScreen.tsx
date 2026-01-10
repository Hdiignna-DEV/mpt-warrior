import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { tradesService, Trade } from '../services/trades';

export default function JournalScreen({ navigation }: any) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTrades();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const data = await tradesService.getTrades(50);
      setTrades(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load trades');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (trades.length === 0) {
      return { wins: 0, losses: 0, winRate: 0, totalPips: 0 };
    }

    const wins = trades.filter((t) => t.hasil === 'WIN').length;
    const losses = trades.filter((t) => t.hasil === 'LOSS').length;
    const totalPips = trades.reduce((sum, t) => sum + t.pip, 0);

    return {
      wins,
      losses,
      winRate: ((wins / trades.length) * 100).toFixed(1),
      totalPips,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator color="#0284c7" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trading Journal</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Wins</Text>
          <Text style={styles.statValue}>{stats.wins}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Losses</Text>
          <Text style={styles.statValue}>{stats.losses}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Win Rate</Text>
          <Text style={styles.statValue}>{stats.winRate}%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Pips</Text>
          <Text style={styles.statValue}>{stats.totalPips}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate('AddTrade', { refreshCallback: fetchTrades })
        }
      >
        <Text style={styles.addButtonText}>+ Add Trade</Text>
      </TouchableOpacity>

      <FlatList
        data={trades}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tradeCard}
            onPress={() =>
              navigation.navigate('TradeDetail', {
                tradeId: item.id,
                trade: item,
              })
            }
          >
            <View style={styles.tradeHeader}>
              <Text style={styles.tradePair}>{item.pair}</Text>
              <Text
                style={[
                  styles.tradeResult,
                  item.hasil === 'WIN'
                    ? styles.resultWin
                    : styles.resultLoss,
                ]}
              >
                {item.hasil}
              </Text>
            </View>
            <View style={styles.tradeDetails}>
              <Text style={styles.tradeDetail}>Position: {item.posisi}</Text>
              <Text style={styles.tradeDetail}>Pips: {item.pip}</Text>
              <Text style={styles.tradeDetail}>
                Date: {new Date(item.tanggal).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No trades yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first trade to get started
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#0284c7',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#0284c7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tradeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tradePair: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  tradeResult: {
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
  },
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  resultWin: {
    backgroundColor: '#10b981',
    color: '#fff',
  },
  resultLoss: {
    backgroundColor: '#ef4444',
    color: '#fff',
  },
  tradeDetails: {
    gap: 4,
  },
  tradeDetail: {
    color: '#cbd5e1',
    fontSize: 12,
  },
});
