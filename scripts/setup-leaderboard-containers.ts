/**
 * Setup script to create leaderboard containers in Cosmos DB
 * Run: npx ts-node scripts/setup-leaderboard-containers.ts
 */

import { getCosmosClient } from '@/lib/db/cosmos-client';

async function setupLeaderboardContainers() {
  try {
    console.log('🚀 Starting leaderboard container setup...');

    const client = getCosmosClient();
    const database = client.database('mpt-warrior');

    // Create user-leaderboard container
    console.log('📦 Creating user-leaderboard container...');
    try {
      const { container: userLeaderboardContainer } = await database.containers.createIfNotExists({
        id: 'user-leaderboard',
        partitionKey: '/userId',
        throughput: 100
      });
      console.log('✅ user-leaderboard container created/exists');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('✅ user-leaderboard container already exists');
      } else {
        throw error;
      }
    }

    // Create leaderboard-history container
    console.log('📦 Creating leaderboard-history container...');
    try {
      const { container: historyContainer } = await database.containers.createIfNotExists({
        id: 'leaderboard-history',
        partitionKey: '/week',
        throughput: 100
      });
      console.log('✅ leaderboard-history container created/exists');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('✅ leaderboard-history container already exists');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Leaderboard containers setup complete!');
    console.log('📊 Containers created:');
    console.log('   - user-leaderboard (100 RU/s)');
    console.log('   - leaderboard-history (100 RU/s)');
    console.log('\n💡 Next step: Call POST /api/leaderboard to initialize rankings');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupLeaderboardContainers();
