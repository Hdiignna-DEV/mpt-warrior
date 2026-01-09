#!/usr/bin/env tsx
/**
 * Quick script to populate leaderboard with user data
 * Usage: npm run leaderboard:populate
 * 
 * ⚠️ SUPER_ADMIN ONLY - Requires SUPER_ADMIN user account
 * 
 * This script:
 * 1. Verifies Super Admin access
 * 2. Gets all active users from database
 * 3. Calculates leaderboard scores for each
 * 4. Populates user-leaderboard container
 */

import { getCosmosClient } from '../src/lib/db/cosmos-client';
import { updateLeaderboardRanking } from '../src/lib/db/education-service';

async function populateLeaderboard() {
  console.log('🚀 Starting leaderboard population...\n');

  try {
    // Step 0: Verify SUPER_ADMIN access
    console.log('🔐 Verifying SUPER_ADMIN access...');
    const client = getCosmosClient();
    const database = client.database('mpt-warrior');
    const usersContainer = database.container('users');

    // Get current user from environment or use admin user
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.error('\n❌ ERROR: ADMIN_EMAIL environment variable not set');
      console.error('   Set ADMIN_EMAIL to your super admin account email');
      console.error('   Example: export ADMIN_EMAIL="admin@example.com"');
      console.error('\n   Or run via admin panel instead:\n');
      console.error('   1. Login as SUPER_ADMIN at /admin-hq/leaderboard-setup');
      console.error('   2. Click "Initialize Rankings" button\n');
      process.exit(1);
    }

    // Query for admin user
    const { resources: adminUsers } = await usersContainer.items
      .query({
        query: `SELECT * FROM c WHERE c.email = @email AND c.role = 'SUPER_ADMIN'`,
        parameters: [{ name: '@email', value: adminEmail }]
      })
      .fetchAll();

    if (adminUsers.length === 0) {
      console.error('\n❌ ERROR: No SUPER_ADMIN user found with email:', adminEmail);
      console.error('\n📝 Setup SUPER_ADMIN account first:');
      console.error('   1. Create/update user in Cosmos DB users container');
      console.error('   2. Set: {"email": "...","role": "SUPER_ADMIN"}');
      console.error('   3. Re-run this script\n');
      process.exit(1);
    }

    const adminUser = adminUsers[0];
    console.log(`✅ SUPER_ADMIN verified: ${adminUser.name || adminUser.email}\n`);
    
    // Step 1: Verify containers exist
    console.log('📦 Checking containers...');

    // Check user-leaderboard container
    try {
      await database.container('user-leaderboard').read();
      console.log('✅ user-leaderboard container exists');
    } catch (error: any) {
      if (error.code === 404) {
        console.log('⚠️  user-leaderboard container not found, creating...');
        await database.containers.createIfNotExists({
          id: 'user-leaderboard',
          partitionKey: '/userId'
        });
        console.log('✅ user-leaderboard container created');
      } else {
        throw error;
      }
    }

    // Check leaderboard-history container
    try {
      await database.container('leaderboard-history').read();
      console.log('✅ leaderboard-history container exists');
    } catch (error: any) {
      if (error.code === 404) {
        console.log('⚠️  leaderboard-history container not found, creating...');
        await database.containers.createIfNotExists({
          id: 'leaderboard-history',
          partitionKey: '/week'
        });
        console.log('✅ leaderboard-history container created');
      } else {
        throw error;
      }
    }

    // Step 2: Count active users
    console.log('\n📊 Counting active users...');
    const { resources: userCount } = await usersContainer.items
      .query({
        query: `SELECT VALUE COUNT(1) FROM c WHERE c.status = 'active'`
      })
      .fetchAll();

    const activeUserCount = userCount[0] || 0;
    console.log(`📝 Found ${activeUserCount} active users\n`);

    if (activeUserCount === 0) {
      console.log('⚠️  No active users found! Create some users first.\n');
      console.log('User structure should have: {status: "active", role: "WARRIOR", ...}');
      return;
    }

    // Step 3: Trigger ranking calculation
    console.log('🔄 Calculating leaderboard scores for all users...');
    console.log('   Initiated by: SUPER_ADMIN - ' + adminUser.email);
    console.log('   (This may take a moment if there are many users)\n');

    await updateLeaderboardRanking();

    // Step 4: Verify population
    console.log('\n✅ Leaderboard population complete!\n');

    const leaderboardContainer = database.container('user-leaderboard');
    const { resources: leaderboardEntries } = await leaderboardContainer.items
      .query({
        query: `SELECT COUNT(1) as count FROM c`
      })
      .fetchAll();

    const entriesCount = leaderboardEntries[0]?.count || 0;
    console.log(`📊 Leaderboard entries created: ${entriesCount}`);

    // Show top 3
    console.log('\n🏆 Top 3 users:');
    const { resources: topUsers } = await leaderboardContainer.items
      .query({
        query: `SELECT c.rank, c.userName, c.totalPoints, c.badge 
                FROM c ORDER BY c.rank ASC OFFSET 0 LIMIT 3`
      })
      .fetchAll();

    topUsers.forEach((user: any) => {
      console.log(`   #${user.rank}: ${user.userName} - ${user.totalPoints} points (${user.badge})`);
    });

    console.log('\n✨ You can now view the leaderboard at: /leaderboard');
    console.log('🎉 Success!\n');

  } catch (error: any) {
    console.error('\n❌ Error populating leaderboard:');
    console.error(error.message || error);
    
    if (error.message?.includes('SUPER_ADMIN')) {
      console.error('\n💡 Tip: Only SUPER_ADMIN can populate leaderboard');
      console.error('   Please login as SUPER_ADMIN and try again');
    }
    
    process.exit(1);
  }
}

// Run the script
populateLeaderboard();
