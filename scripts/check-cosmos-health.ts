/**
 * Check Cosmos DB Health Script
 * 
 * This script checks if Azure Cosmos DB is properly configured and all containers exist
 * Run: npm run db:check
 */

import { checkCosmosDBHealth, initializeContainers } from '../src/lib/db/cosmos-client';

async function checkHealth() {
  console.log('🔍 Checking Azure Cosmos DB health...\n');

  try {
    const health = await checkCosmosDBHealth();

    console.log('📊 Health Check Results:');
    console.log('─'.repeat(50));
    console.log(`Database Connection: ${health.database ? '✅ Connected' : '❌ Failed'}`);
    console.log(`Overall Health: ${health.isHealthy ? '✅ Healthy' : '⚠️  Issues Found'}\n`);

    console.log('📦 Containers Status:');
    console.log('─'.repeat(50));
    console.log(`users:             ${health.containers.users ? '✅' : '❌'}`);
    console.log(`trades:            ${health.containers.trades ? '✅' : '❌'}`);
    console.log(`invitation-codes:  ${health.containers.invitationCodes ? '✅' : '❌'}`);
    console.log(`audit-logs:        ${health.containers.auditLogs ? '✅' : '❌'}\n`);

    if (health.error) {
      console.log('❌ Error:', health.error);
    }

    if (!health.isHealthy) {
      console.log('\n⚠️  Some containers are missing!');
      console.log('💡 Run: npm run db:init');
      console.log('   to create missing containers\n');
      
      // Ask if user wants to auto-initialize
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question('Do you want to initialize missing containers now? (y/N): ', async (answer: string) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          console.log('\n🚀 Initializing containers...\n');
          try {
            await initializeContainers();
            console.log('\n✅ All containers initialized successfully!\n');
            
            // Check again
            const newHealth = await checkCosmosDBHealth();
            console.log('📊 Updated Status:');
            console.log('─'.repeat(50));
            console.log(`Overall Health: ${newHealth.isHealthy ? '✅ Healthy' : '⚠️  Still has issues'}\n`);
          } catch (initError) {
            console.error('❌ Failed to initialize containers:', initError);
          }
        } else {
          console.log('\n⏭️  Skipping auto-initialization');
          console.log('   Run: npm run db:init when ready\n');
        }
        readline.close();
        process.exit(health.isHealthy ? 0 : 1);
      });
    } else {
      console.log('✅ Everything looks good!\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Health check failed:', error);
    console.error('\n💡 Possible issues:');
    console.error('   1. Azure Cosmos DB connection string not set');
    console.error('   2. Database does not exist');
    console.error('   3. Network connectivity issues\n');
    console.error('📚 Check: VERCEL_COSMOS_DB_SETUP.md for setup guide\n');
    process.exit(1);
  }
}

// Run check
checkHealth();
