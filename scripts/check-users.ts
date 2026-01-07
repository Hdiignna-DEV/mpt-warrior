/**
 * Check all users in Cosmos DB
 */
import { config } from 'dotenv';
import { getCosmosClient } from '../src/lib/db/cosmos-client';

config({ path: '.env.local' });

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...\n');
    
    const client = getCosmosClient();
    const database = client.database(process.env.AZURE_COSMOS_DATABASE || 'mpt-warrior');
    const container = database.container('users');

    // Query all users
    const { resources: users } = await container.items.query('SELECT * FROM c').fetchAll();

    console.log(`📊 Total users found: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Warrior ID: ${user.warriorId}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log('');
    });

    // Check specific users
    console.log('🔎 Checking specific user IDs from JWT tokens:\n');
    
    const userIdsToCheck = [
      'user-1767578821404-k6hrod',
      'user-1767761633450-1ocso5',
      'user-1767618189431-agqoa'
    ];

    for (const userId of userIdsToCheck) {
      try {
        const { resource } = await container.item(userId, userId).read();
        if (resource) {
          console.log(`✅ ${userId}: EXISTS (${resource.email})`);
        }
      } catch (error: any) {
        if (error.code === 404) {
          console.log(`❌ ${userId}: NOT FOUND`);
        } else {
          console.log(`⚠️ ${userId}: ERROR - ${error.message}`);
        }
      }
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

checkUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
