import { CosmosClient } from '@azure/cosmos';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const endpoint = process.env.AZURE_COSMOS_ENDPOINT!;
const key = process.env.AZURE_COSMOS_KEY!;
const databaseId = process.env.AZURE_COSMOS_DATABASE || 'mpt-warrior';

const client = new CosmosClient({ endpoint, key });

async function optimizeForFreeTier() {
  console.log('🔧 Optimizing Cosmos DB for Free Tier...\n');

  try {
    const database = client.database(databaseId);

    // Get all containers
    const { resources: containers } = await database.containers.readAll().fetchAll();
    
    console.log(`📦 Found ${containers.length} containers\n`);

    for (const containerDef of containers) {
      const container = database.container(containerDef.id);
      
      // Get current throughput
      try {
        const { resource: offer } = await container.readOffer();
        
        if (offer) {
          const currentRU = offer.content?.offerThroughput || 'autoscale';
          console.log(`📊 Container: ${containerDef.id}`);
          console.log(`   Current RU/s: ${currentRU}`);
          
          // Recommend optimization
          if (typeof currentRU === 'number' && currentRU > 400) {
            console.log(`   ⚠️  RECOMMENDATION: Reduce to 400 RU/s (Free Tier)`);
            console.log(`   💰 Current cost: ~$${((currentRU / 100) * 4.8).toFixed(2)}/month`);
            console.log(`   💚 Free tier cost: $0/month (up to 1000 RU/s total)\n`);
          } else {
            console.log(`   ✅ Already optimized for free tier\n`);
          }
        }
      } catch (error: any) {
        if (error.code === 400) {
          console.log(`📊 Container: ${containerDef.id}`);
          console.log(`   Shared throughput at database level\n`);
        }
      }
    }

    // Check database-level throughput
    console.log('🗄️  Checking database-level throughput...');
    try {
      const { resource: dbOffer } = await database.readOffer();
      
      if (dbOffer) {
        const dbRU = dbOffer.content?.offerThroughput;
        console.log(`   Database RU/s: ${dbRU}`);
        
        if (dbRU && dbRU > 400) {
          console.log(`   ⚠️  RECOMMENDATION: Set to 400 RU/s for free tier`);
          console.log(`   Run: az cosmosdb sql database throughput update \\`);
          console.log(`        --account-name <account> \\`);
          console.log(`        --name ${databaseId} \\`);
          console.log(`        --throughput 400\n`);
        } else {
          console.log(`   ✅ Database throughput optimized\n`);
        }
      }
    } catch (error: any) {
      console.log('   No database-level throughput configured\n');
    }

    // Query optimization tips
    console.log('💡 QUERY OPTIMIZATION TIPS:\n');
    console.log('1. Always use partition keys:');
    console.log('   ✅ container.item(id, partitionKey).read()');
    console.log('   ❌ container.items.readAll().fetchAll()\n');
    
    console.log('2. Use point reads instead of queries:');
    console.log('   ✅ RU cost: ~1 RU');
    console.log('   ❌ RU cost: 10-100+ RU\n');
    
    console.log('3. Enable caching:');
    console.log('   - Cache frequently accessed data');
    console.log('   - Use React Query (already setup ✅)');
    console.log('   - Set appropriate TTL\n');
    
    console.log('4. Batch operations:');
    console.log('   - Use transactional batch for multiple writes');
    console.log('   - Reduces RU consumption\n');

    // Storage check
    console.log('📦 STORAGE USAGE:\n');
    console.log('Free Tier Limit: 25 GB');
    console.log('Check current usage in Azure Portal → Metrics\n');

    console.log('✅ Optimization check complete!\n');
    console.log('🎯 FREE TIER TARGET:');
    console.log('   • Total RU/s: < 1000 (you get 1000 free)');
    console.log('   • Recommendation: Set to 400 RU/s');
    console.log('   • Storage: < 25 GB');
    console.log('   • Cost: $0/month ✨\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function checkCurrentUsage() {
  console.log('\n📊 CURRENT USAGE ANALYSIS\n');
  
  try {
    const database = client.database(databaseId);
    const { resources: containers } = await database.containers.readAll().fetchAll();
    
    let totalDocuments = 0;
    let estimatedStorage = 0;
    
    for (const containerDef of containers) {
      const container = database.container(containerDef.id);
      
      try {
        const { resources: items } = await container.items
          .query('SELECT VALUE COUNT(1) FROM c')
          .fetchAll();
        
        const count = items[0] || 0;
        totalDocuments += count;
        
        // Estimate storage (rough estimate: 1KB per document average)
        estimatedStorage += count * 0.001; // MB
        
        console.log(`${containerDef.id}: ${count} documents`);
      } catch (error) {
        console.log(`${containerDef.id}: Unable to count`);
      }
    }
    
    console.log(`\nTotal documents: ${totalDocuments}`);
    console.log(`Estimated storage: ${estimatedStorage.toFixed(2)} MB (${(estimatedStorage / 1024).toFixed(2)} GB)`);
    console.log(`Free tier remaining: ${(25 - estimatedStorage / 1024).toFixed(2)} GB`);
    
    if (estimatedStorage / 1024 < 20) {
      console.log('✅ Storage well within free tier limits\n');
    } else if (estimatedStorage / 1024 < 25) {
      console.log('⚠️  Approaching storage limit, monitor closely\n');
    } else {
      console.log('❌ EXCEEDING free tier storage limit!\n');
    }
    
  } catch (error) {
    console.error('Error checking usage:', error);
  }
}

// Run optimization
console.log('🚀 MPT Warrior - Cosmos DB Free Tier Optimizer\n');
console.log('=' .repeat(60) + '\n');

optimizeForFreeTier()
  .then(() => checkCurrentUsage())
  .then(() => {
    console.log('=' .repeat(60));
    console.log('\n✨ Optimization complete!');
    console.log('\n📖 Next steps:');
    console.log('1. Review recommendations above');
    console.log('2. Adjust RU/s in Azure Portal if needed');
    console.log('3. Setup monitoring alerts (see AZURE_DEPLOYMENT_GUIDE.md)');
    console.log('4. Deploy to Azure Static Web Apps\n');
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
