/**
 * Initialize Cosmos DB Containers
 * Run this script once to create all required containers
 */

import { config } from 'dotenv';
import { initializeContainers } from '@/lib/db/cosmos-client';

// Load .env.local
config({ path: '.env.local' });

async function main() {
  console.log('🚀 Initializing Cosmos DB containers...\n');

  try {
    await initializeContainers();
    console.log('\n✅ All containers created successfully!');
    console.log('\n📋 Created containers:');
    console.log('  - users (partition key: /id)');
    console.log('  - trades (partition key: /userId)');
    console.log('  - invitation-codes (partition key: /code)');
    console.log('  - audit-logs (partition key: /performed_by)');
  } catch (error) {
    console.error('\n❌ Error initializing containers:', error);
    process.exit(1);
  }
}

main();
