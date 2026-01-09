#!/usr/bin/env tsx
/**
 * Verify WhatsApp data in leaderboard
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

import { getCosmosClient } from '../src/lib/db/cosmos-client';

async function verifyWhatsApp() {
  console.log('🔍 Verifying WhatsApp data in leaderboard...\n');

  try {
    const client = getCosmosClient();
    const db = client.database('mpt-warrior');
    const leaderboard = db.container('user-leaderboard');

    // Get all leaderboard entries
    const { resources: entries } = await leaderboard.items
      .query('SELECT c.userId, c.userName, c.whatsapp, c.rank, c.totalPoints FROM c ORDER BY c.rank ASC')
      .fetchAll();

    if (entries.length === 0) {
      console.log('❌ No leaderboard entries found!');
      return;
    }

    console.log(`📊 Leaderboard Entries: ${entries.length}\n`);
    console.log('📱 WhatsApp Status:');
    console.log('━'.repeat(70));

    let withWA = 0;
    let withoutWA = 0;

    entries.forEach((entry: any) => {
      const hasWA = entry.whatsapp ? '✅' : '❌';
      const wa = entry.whatsapp || 'NOT SET';
      console.log(`${hasWA} #${entry.rank} ${entry.userName.padEnd(25)} | ${wa.padEnd(15)} | ${entry.totalPoints} pts`);
      
      if (entry.whatsapp) withWA++;
      else withoutWA++;
    });

    console.log('━'.repeat(70));
    console.log(`\n📈 Summary:`);
    console.log(`   ✅ With WhatsApp: ${withWA} users (${((withWA / entries.length) * 100).toFixed(1)}%)`);
    console.log(`   ❌ Without WhatsApp: ${withoutWA} users (${((withoutWA / entries.length) * 100).toFixed(1)}%)`);

    if (withoutWA > 0) {
      console.log(`\n💡 Tip: Users without WhatsApp will show "No WhatsApp" on leaderboard`);
      console.log(`   They can add it by updating their profile at /profile/edit`);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyWhatsApp();
