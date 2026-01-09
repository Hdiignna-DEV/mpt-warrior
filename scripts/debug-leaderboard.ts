#!/usr/bin/env tsx
/**
 * Debug script to check leaderboard data
 * Usage: npx tsx scripts/debug-leaderboard.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local FIRST
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

import { getCosmosClient } from '../src/lib/db/cosmos-client';

async function debugLeaderboard() {
  console.log('🔍 Debugging Leaderboard System\n');

  try {
    const client = getCosmosClient();
    const database = client.database('mpt-warrior');

    // 1. Check containers
    console.log('1️⃣ Checking containers...');
    try {
      await database.container('user-leaderboard').read();
      console.log('✅ user-leaderboard container EXISTS');
    } catch (error: any) {
      if (error.code === 404) {
        console.log('❌ user-leaderboard container NOT FOUND');
        return;
      }
    }

    // 2. Count entries in user-leaderboard
    console.log('\n2️⃣ Checking user-leaderboard data...');
    const leaderboardContainer = database.container('user-leaderboard');
    const { resources: entries } = await leaderboardContainer.items
      .query({
        query: `SELECT COUNT(1) as count FROM c`
      })
      .fetchAll();

    const entriesCount = entries[0]?.count || 0;
    console.log(`   Total entries: ${entriesCount}`);

    if (entriesCount === 0) {
      console.log('⚠️  EMPTY! No leaderboard entries found!');
      console.log('\n💡 Solution: Run populate script');
      console.log('   export ADMIN_EMAIL="info.mptcommunity@gmail.com"');
      console.log('   npm run leaderboard:populate\n');
      return;
    }

    // 3. Show sample entries
    console.log('\n3️⃣ Sample entries from leaderboard:');
    const { resources: samples } = await leaderboardContainer.items
      .query({
        query: `SELECT c.rank, c.userName, c.totalPoints, c.badge 
                FROM c ORDER BY c.rank ASC OFFSET 0 LIMIT 5`
      })
      .fetchAll();

    if (samples.length === 0) {
      console.log('❌ No entries found in query');
      return;
    }

    samples.forEach((entry: any) => {
      console.log(`   #${entry.rank}: ${entry.userName || 'Unknown'} - ${entry.totalPoints} pts (${entry.badge})`);
    });

    // 4. Count users in users container
    console.log('\n4️⃣ Checking users in database...');
    const usersContainer = database.container('users');
    const { resources: userCount } = await usersContainer.items
      .query({
        query: `SELECT VALUE COUNT(1) FROM c WHERE c.status = 'active'`
      })
      .fetchAll();

    const activeUsers = userCount[0] || 0;
    console.log(`   Active users: ${activeUsers}`);

    if (activeUsers === 0) {
      console.log('\n⚠️  No active users! Create users first.');
      return;
    }

    // 5. Check if users have role
    console.log('\n5️⃣ Checking user roles...');
    const { resources: roleCounts } = await usersContainer.items
      .query({
        query: `SELECT c.role, COUNT(1) as count FROM c WHERE c.status = 'active' GROUP BY c.role`
      })
      .fetchAll();

    roleCounts.forEach((rc: any) => {
      console.log(`   ${rc.role}: ${rc.count} users`);
    });

    // 6. Check for SUPER_ADMIN
    console.log('\n6️⃣ Checking SUPER_ADMIN user...');
    const { resources: superAdmins } = await usersContainer.items
      .query({
        query: `SELECT c.email, c.name FROM c WHERE c.role = 'SUPER_ADMIN'`
      })
      .fetchAll();

    if (superAdmins.length === 0) {
      console.log('❌ No SUPER_ADMIN user found!');
    } else {
      superAdmins.forEach((admin: any) => {
        console.log(`   ✅ ${admin.email} (${admin.name})`);
      });
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ SUMMARY:');
    console.log(`   - Leaderboard entries: ${entriesCount}`);
    console.log(`   - Active users: ${activeUsers}`);
    console.log(`   - SUPER_ADMIN users: ${superAdmins.length}`);

    if (entriesCount === activeUsers) {
      console.log('\n🎉 ALL LOOKS GOOD! Check /leaderboard page');
    } else {
      console.log(`\n⚠️  Mismatch: ${entriesCount} entries vs ${activeUsers} users`);
      console.log('   Run: npm run leaderboard:populate');
    }

  } catch (error: any) {
    console.error('\n❌ Error during debug:');
    console.error(error.message || error);
  }
}

debugLeaderboard();
