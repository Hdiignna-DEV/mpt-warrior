import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import apiClient from '../services/api';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
}

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/achievements');
      const { earned, available } = response.data;
      setAchievements([...earned, ...available]);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return '#fbbf24';
      case 'epic':
        return '#a78bfa';
      case 'rare':
        return '#0284c7';
      default:
        return '#64748b';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator color="#0284c7" size="large" />
      </View>
    );
  }

  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>

      <View style={styles.statsSection}>
        <Text style={styles.statsText}>
          Earned: {earnedCount} / {achievements.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(earnedCount / achievements.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <FlatList
        data={achievements}
        renderItem={({ item }) => (
          <View
            style={[
              styles.badgeCard,
              !item.earned && styles.badgeCardLocked,
            ]}
          >
            <View style={styles.badgeContent}>
              <Text
                style={[
                  styles.badgeIcon,
                  { opacity: item.earned ? 1 : 0.5 },
                ]}
              >
                {item.icon}
              </Text>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeName}>{item.name}</Text>
                <Text style={styles.badgeDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.rarityBadge,
                {
                  backgroundColor: getRarityColor(item.rarity) + '20',
                  borderColor: getRarityColor(item.rarity),
                },
              ]}
            >
              <Text
                style={[
                  styles.rarityText,
                  { color: getRarityColor(item.rarity) },
                ]}
              >
                {item.rarity}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
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
  statsSection: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statsText: {
    color: '#cbd5e1',
    marginBottom: 8,
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0284c7',
  },
  badgeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeContent: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  badgeDescription: {
    color: '#94a3b8',
    fontSize: 12,
  },
  rarityBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
