// Simple test to verify Cosmos DB connection
import { getCosmosClient, getDatabase, initializeContainers } from '@/lib/db/cosmos-client';

async function test() {
  console.log('🔍 Testing Cosmos DB Connection...');
  
  try {
    // Check environment
    console.log('Checking environment variables...');
    console.log('- AZURE_COSMOS_CONNECTION_STRING:', process.env.AZURE_COSMOS_CONNECTION_STRING ? 'SET' : 'MISSING');
    console.log('- AZURE_COSMOS_ENDPOINT:', process.env.AZURE_COSMOS_ENDPOINT ? 'SET' : 'MISSING');
    console.log('- AZURE_COSMOS_KEY:', process.env.AZURE_COSMOS_KEY ? 'SET' : 'MISSING');
    
    // Initialize client
    console.log('\n✓ Getting Cosmos DB client...');
    const client = getCosmosClient();
    console.log('✓ Client created');
    
    // Get database
    console.log('\n✓ Getting database...');
    const db = getDatabase();
    console.log('✓ Database reference obtained');
    
    // Initialize containers
    console.log('\n✓ Initializing containers...');
    const result = await initializeContainers();
    console.log('✓ Containers initialized:', result);
    
    console.log('\n✅ ALL TESTS PASSED!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error(error);
    process.exit(1);
  }
}

test();
