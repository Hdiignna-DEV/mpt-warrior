import { config } from 'dotenv';
import { getCosmosClient } from '../src/lib/db/cosmos-client';

config({ path: '.env.local' });

async function markFounderById() {
  try {
    console.log('👑 Marking MPT COMMUNITY as Founder...\n');
    
    const client = getCosmosClient();
    const database = client.database(process.env.AZURE_COSMOS_DATABASE || 'mpt-warrior');
    const container = database.container('users');

    // User details we found
    const founderId = 'user-1767618189431-agqoa';
    const founderPartitionKey = founderId; // Assuming id is the partition key

    console.log(`🔍 Fetching user with ID: ${founderId}`);
    
    const { resource: user } = await container
      .item(founderId, founderPartitionKey)
      .read();

    if (!user) {
      console.error(`❌ User not found with ID: ${founderId}`);
      process.exit(1);
    }

    console.log(`✓ Found user: ${user.name} (${user.email})`);
    console.log(`  Current role: ${user.role || 'NONE'}`);
    console.log(`  Current isFounder: ${user.isFounder || false}\n`);

    // Update user to mark as founder
    const updatedUser = {
      ...user,
      role: 'FOUNDER',
      isFounder: true,
      updatedAt: new Date().toISOString(),
    };

    console.log('📝 Updating user document...');
    const { resource } = await container
      .item(founderId, founderPartitionKey)
      .replace(updatedUser);

    console.log('\n✅ Successfully marked as Founder!\n');
    console.log('👑 Name:', resource.name);
    console.log('📧 Email:', resource.email);
    console.log('🎖️ Role:', resource.role);
    console.log('✨ isFounder:', resource.isFounder);
    console.log('\n🎉 FounderShowcase akan langsung muncul di leaderboard!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

markFounderById();
