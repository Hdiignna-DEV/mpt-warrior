/**
 * Find all Deden users in database
 */
import { config } from 'dotenv';
import { getCosmosClient } from '../src/lib/db/cosmos-client';

config({ path: '.env.local' });

async function findDedenUsers() {
  try {
    console.log('🔍 Searching for Deden Hadiguna in database...\n');
    
    const client = getCosmosClient();
    const database = client.database(process.env.AZURE_COSMOS_DATABASE || 'mpt-warrior');
    const container = database.container('users');

    // Search for any email containing "deden" or name containing "Deden"
    const { resources } = await container.items
      .query(`
        SELECT c.id, c.name, c.email, c.role, c.isFounder, c.status, c.createdAt
        FROM c 
        WHERE LOWER(c.email) LIKE LOWER('%deden%') OR LOWER(c.name) LIKE LOWER('%deden%')
        ORDER BY c.createdAt DESC
      `)
      .fetchAll();

    if (resources.length === 0) {
      console.log('❌ No Deden users found in database\n');
      return;
    }

    console.log(`✓ Found ${resources.length} user(s):\n`);
    resources.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   isFounder: ${user.isFounder || false}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   ID: ${user.id}`);
      console.log();
    });

  } catch (error: any) {
    console.error('❌ Error searching for users:');
    console.error(error.message);
    process.exit(1);
  }
}

findDedenUsers()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
