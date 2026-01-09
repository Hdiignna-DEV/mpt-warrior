/**
 * Database Migration - Warrior Ranking System
 * File: scripts/migrate-leaderboard-schema.ts
 * 
 * This script adds ranking fields to users collection and creates new collections
 */

import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.AZURE_COSMOS_ENDPOINT!;
const key = process.env.AZURE_COSMOS_KEY!;
const databaseId = process.env.AZURE_COSMOS_DATABASE || 'mpt-warrior';

async function migrateLeaderboardSchema() {
  console.log('🚀 Starting Warrior Ranking System Database Migration...\n');

  try {
    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);

    // ==================== Step 1: Update Users Collection ====================
    console.log('📝 Step 1: Updating users collection schema...');
    const usersContainer = database.container('users');

    // Get all users (max 1000 for now)
    const { resources: users } = await usersContainer.items
      .query('SELECT * FROM c WHERE c.id IS NOT NULL')
      .fetchAll();

    console.log(`   Found ${users.length} users to update`);

    let updated = 0;
    for (const user of users) {
      try {
        // Add ranking fields if not exists
        const updatedUser = {
          ...user,
          // Ranking fields
          totalPoints: user.totalPoints || 0,
          weeklyPoints: user.weeklyPoints || 0,
          currentRank: user.currentRank || 999999,
          previousRank: user.previousRank || 999999,
          rankChange: user.rankChange || 0,
          tier: user.tier || 'RECRUIT',
          lastRankUpdate: user.lastRankUpdate || new Date().toISOString(),

          // Point breakdown
          pointsBreakdown: user.pointsBreakdown || {
            quizPoints: 0,
            consistencyPoints: 0,
            communityPoints: 0,
          },

          // Badges
          badges: user.badges || [],

          // Journal tracking
          journalEntries: user.journalEntries || {
            lastEntryDate: null,
            entriesThisWeek: 0,
            consecutiveDays: 0,
            allTimeDays: 0,
          },

          // Comment stats
          commentStats: user.commentStats || {
            thisWeek: 0,
            thisMonth: 0,
            allTime: 0,
            lastCommentDate: null,
          },

          // Quiz stats
          quizStats: user.quizStats || {
            modulesCompleted: 0,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
          },

          // System flags
          isTopTenNotified: user.isTopTenNotified || false,
          lastArkaTopTenDate: user.lastArkaTopTenDate || null,
        };

        await usersContainer.item(user.id, user.id).replace(updatedUser);
        updated++;
      } catch (error) {
        console.warn(`   ⚠️  Could not update user ${user.id}:`, (error as any).message);
      }
    }

    console.log(`   ✅ Updated ${updated} users\n`);

    // ==================== Step 2: Create leaderboard_snapshots Collection ====================
    console.log('📝 Step 2: Creating leaderboard_snapshots collection...');

    try {
      await database.containers.createIfNotExists({
        id: 'leaderboard_snapshots',
        partitionKey: { paths: ['/date'] },
      });

      console.log('   ✅ Created leaderboard_snapshots collection\n');

      // Create index
      const snapshotsContainer = database.container('leaderboard_snapshots');
      const snapshotsContainerDef = await snapshotsContainer.read();
      await snapshotsContainer.replace({
        ...snapshotsContainerDef.resource,
        indexingPolicy: {
          indexingMode: 'consistent',
          automatic: true,
          includedPaths: [
            { path: '/*' },
            { path: '/date/*' },
            { path: '/period/*' },
            { path: '/rankings/[]/rank/*' },
          ],
          excludedPaths: [{ path: '/"_etag"/?' }],
        },
      });

      console.log('   ✅ Created indexes on leaderboard_snapshots\n');
    } catch (error) {
      if ((error as any).code !== 409) {
        // 409 = already exists
        throw error;
      }
      console.log('   ℹ️  leaderboard_snapshots already exists\n');
    }

    // ==================== Step 3: Create point_logs Collection ====================
    console.log('📝 Step 3: Creating point_logs collection...');

    try {
      await database.containers.createIfNotExists({
        id: 'point_logs',
        partitionKey: { paths: ['/userId'] },
      });

      console.log('   ✅ Created point_logs collection\n');

      // Create indexes
      const pointLogsContainer = database.container('point_logs');
      const pointLogsContainerDef = await pointLogsContainer.read();
      await pointLogsContainer.replace({
        ...pointLogsContainerDef.resource,
        indexingPolicy: {
          indexingMode: 'consistent',
          automatic: true,
          includedPaths: [
            { path: '/*' },
            { path: '/userId/*' },
            { path: '/timestamp/*' },
            { path: '/action/*' },
          ],
          excludedPaths: [{ path: '/"_etag"/?' }],
        },
      });

      console.log('   ✅ Created indexes on point_logs\n');
    } catch (error) {
      if ((error as any).code !== 409) {
        throw error;
      }
      console.log('   ℹ️  point_logs already exists\n');
    }

    // ==================== Step 4: Create rank_history Collection ====================
    console.log('📝 Step 4: Creating rank_history collection...');

    try {
      await database.containers.createIfNotExists({
        id: 'rank_history',
        partitionKey: { paths: ['/userId'] },
      });

      console.log('   ✅ Created rank_history collection\n');

      // Create indexes
      const rankHistoryContainer = database.container('rank_history');
      const rankHistoryContainerDef = await rankHistoryContainer.read();
      await rankHistoryContainer.replace({
        ...rankHistoryContainerDef.resource,
        indexingPolicy: {
          indexingMode: 'consistent',
          automatic: true,
          includedPaths: [
            { path: '/*' },
            { path: '/userId/*' },
            { path: '/date/*' },
          ],
          excludedPaths: [{ path: '/"_etag"/?' }],
        },
      });

      console.log('   ✅ Created indexes on rank_history\n');
    } catch (error) {
      if ((error as any).code !== 409) {
        throw error;
      }
      console.log('   ℹ️  rank_history already exists\n');
    }

    // ==================== Step 5: Add Indexes to Users Collection ====================
    console.log('📝 Step 5: Creating indexes on users collection...');

    try {
      const usersContainerDef = await usersContainer.read();
      
      // Update indexing policy for users
      await usersContainer.replace({
        ...usersContainerDef.resource,
        indexingPolicy: {
          ...(usersContainerDef.resource?.indexingPolicy || {}),
          includedPaths: [
            { path: '/*' },
            { path: '/totalPoints/?', indexes: [{ kind: 'Range', dataType: 'Number' }] },
            { path: '/currentRank/?', indexes: [{ kind: 'Range', dataType: 'Number' }] },
            { path: '/tier/?', indexes: [{ kind: 'Range', dataType: 'String' }] },
            { path: '/badges/*' },
          ],
        },
      });

      console.log('   ✅ Created indexes on users collection\n');
    } catch (error) {
      console.warn('   ⚠️  Could not create indexes on users:', (error as any).message, '\n');
    }

    // ==================== Summary ====================
    console.log('✅ ===== MIGRATION COMPLETE =====');
    console.log('   ✅ Users collection updated with ranking fields');
    console.log('   ✅ leaderboard_snapshots collection created');
    console.log('   ✅ point_logs collection created');
    console.log('   ✅ rank_history collection created');
    console.log('   ✅ Indexes created for performance');
    console.log('\n🎉 Database migration successful!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateLeaderboardSchema();
