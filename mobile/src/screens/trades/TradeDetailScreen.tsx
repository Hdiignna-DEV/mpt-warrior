import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { Trade } from '../../services/trades';

const TradeDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { trade } = route.params as { trade: Trade };

  const [tradeData, setTradeData] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTradeDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trade]);

  const loadTradeDetail = async () => {
    try {
      setLoading(true);
      // Use the trade data passed from JournalScreen
      if (trade) {
        setTradeData(trade);
      }
    } catch (error) {
      console.error('Error loading trade:', error);
      Alert.alert('Error', 'Failed to load trade details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (tradeData) {
      (navigation.navigate as any)('EditTrade', { 
        tradeId: tradeData.id,
        trade: tradeData 
      });
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN':
        return '#10b981';
      case 'LOSS':
        return '#ef4444';
      case 'BREAK_EVEN':
        return '#f59e0b';
      default:
        return '#9ca3af';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#60a5fa" />
      </View>
    );
  }

  if (!tradeData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trade not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Pair & Result Header */}
      <View style={styles.headerSection}>
        <View style={styles.pairContainer}>
          <Text style={styles.pairText}>{tradeData.pair}</Text>
          <View style={[styles.resultBadge, { backgroundColor: getResultColor(tradeData.hasil) }]}>
            <Text style={styles.resultText}>{tradeData.hasil}</Text>
          </View>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsSection}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Position</Text>
          <Text style={styles.metricValue}>{tradeData.posisi}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Pips</Text>
          <Text style={[styles.metricValue, { color: tradeData.pip >= 0 ? '#10b981' : '#ef4444' }]}>
            {tradeData.pip > 0 ? '+' : ''}{tradeData.pip}
          </Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Trade Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Entry Date</Text>
          <Text style={styles.detailValue}>
            {tradeData.tanggal ? new Date(tradeData.tanggal).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }) : 'N/A'}
          </Text>
        </View>

        {tradeData.catatan && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{tradeData.catatan}</Text>
            </View>
          </View>
        )}

        {/* Additional Info */}
        <View style={styles.additionalSection}>
          <Text style={styles.sectionTitle}>Additional Info</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Trade ID</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {tradeData.id?.substring(0, 20)}...
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>Edit Trade</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerSection: {
    marginBottom: 24,
  },
  pairContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
  },
  pairText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resultText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  metricsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 12,
    marginTop: 16,
  },
  detailRow: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  notesSection: {
    marginTop: 16,
  },
  notesBox: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#60a5fa',
  },
  notesText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  additionalSection: {
    marginTop: 16,
  },
  buttonSection: {
    gap: 12,
    marginVertical: 16,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TradeDetailScreen;
