/**
 * Test Cosmos DB Connection
 * Run: npx tsx scripts/test-cosmos-connection.ts
 */

import { getCosmosClient, getDatabase, getUsersContainer } from '../src/lib/db/cosmos-client';

async function testConnection() {
  console.log('🔍 Testing Azure Cosmos DB Connection...\n');

  try {
    // Test 1: Client initialization
    console.log('1️⃣  Testing client initialization...');
    const client = getCosmosClient();
    console.log('   ✅ Client created successfully\n');

    // Test 2: Database connection
    console.log('2️⃣  Testing database connection...');
    const db = getDatabase();
    const dbInfo = await db.read();
    console.log('   ✅ Connected to database:', dbInfo.resource?.id);
    console.log('   📊 Database details:', {
      id: dbInfo.resource?.id,
      _self: dbInfo.resource?._self,
    });
    console.log('');

    // Test 3: List all containers
    console.log('3️⃣  Listing all containers...');
    const { resources: containers } = await db.containers.readAll().fetchAll();
    console.log('   📦 Found', containers.length, 'container(s):');
    containers.forEach((container, index) => {
      console.log(`      ${index + 1}. ${container.id}`);
    });
    console.log('');

    // Test 4: Get users container
    console.log('4️⃣  Testing users container...');
    const usersContainer = getUsersContainer();
    const containerInfo = await usersContainer.read();
    console.log('   ✅ Users container found');
    console.log('   🔑 Partition key:', JSON.stringify(containerInfo.resource?.partitionKey, null, 2));
    console.log('');

    // Test 5: Count users
    console.log('5️⃣  Counting users...');
    const { resources: users } = await usersContainer.items
      .query('SELECT VALUE COUNT(1) FROM c')
      .fetchAll();
    console.log('   👥 Total users:', users[0]);
    console.log('');

    // Test 6: Get first user (if any)
    console.log('6️⃣  Fetching sample user...');
    const { resources: sampleUsers } = await usersContainer.items
      .query({
        query: 'SELECT TOP 1 c.id, c.email, c.name, c.role FROM c'
      })
      .fetchAll();
    
    if (sampleUsers.length > 0) {
      console.log('   ✅ Sample user found:');
      console.log('   ', JSON.stringify(sampleUsers[0], null, 2));
    } else {
      console.log('   ⚠️  No users found in database');
    }
    console.log('');

    console.log('✅ All tests passed!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error instanceof Error) {
      console.error('\n📋 Error Details:');
      console.error('   Name:', error.name);
      console.error('   Message:', error.message);
      if ('code' in error) {
        console.error('   Code:', (error as any).code);
      }
      if ('substatus' in error) {
        console.error('   Substatus:', (error as any).substatus);
      }
    }
    
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check AZURE_COSMOS_ENDPOINT is set');
    console.error('   2. Check AZURE_COSMOS_KEY is correct');
    console.error('   3. Check AZURE_COSMOS_DATABASE = mpt-warrior');
    console.error('   4. Verify containers exist in Azure Portal');
    console.error('');
    
    process.exit(1);
  }
}

testConnection();
