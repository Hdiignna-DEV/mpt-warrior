import { config } from 'dotenv';
import { getCosmosClient } from '../src/lib/db/cosmos-client';

config({ path: '.env.local' });

async function findSuperAdmins() {
  try {
    const client = getCosmosClient();
    const database = client.database(process.env.AZURE_COSMOS_DATABASE || 'mpt-warrior');
    const container = database.container('users');

    const { resources } = await container.items
      .query('SELECT c.id, c.name, c.email, c.role FROM c WHERE c.role = "SUPER_ADMIN"')
      .fetchAll();

    console.log('\n📋 All SUPER_ADMIN users:\n');
    resources.forEach((user: any) => {
      console.log('  👤 Name:', user.name);
      console.log('  📧 Email:', user.email);
      console.log('  🆔 ID:', user.id);
      console.log('  🎖️ Role:', user.role);
      console.log('  ---');
    });

    if (resources.length === 0) {
      console.log('  No SUPER_ADMIN users found');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

findSuperAdmins();
