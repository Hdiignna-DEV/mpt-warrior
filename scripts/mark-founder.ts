/**
 * Mark MPT COMMUNITY as Founder
 * Updates user document in Cosmos DB to set isFounder=true and role=FOUNDER
 */
import { config } from 'dotenv';
import { getCosmosClient } from '../src/lib/db/cosmos-client';

config({ path: '.env.local' });

async function markFounder() {
  try {
    console.log('👑 Marking MPT COMMUNITY as Founder...\n');
    
    const client = getCosmosClient();
    const database = client.database(process.env.AZURE_COSMOS_DATABASE || 'mpt-warrior');
    const container = database.container('users');

    // Find user by email - case insensitive search
    const founderEmail = 'info.mptcommunity@gmail.com';
    const founderId = 'user-1767618189431-agqoa';
    
    console.log(`🔍 Fetching user with ID: ${founderId}`);
    const { resource: user } = await container
      .item(founderId, founderId)
      .read();

    if (!user) {
      console.error(`❌ User not found: ${founderEmail}`);
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
      .item(founderId, founderId)
      .replace(updatedUser);

    console.log('\n✅ Successfully marked as Founder!\n');
    console.log('📋 Update Summary:');
    console.log(`  Name: ${resource.name}`);
    console.log(`  Email: ${resource.email}`);
    console.log(`  Role: ${resource.role}`);
    console.log(`  isFounder: ${resource.isFounder}`);
    console.log(`  Updated: ${resource.updatedAt}\n`);
    console.log('🎉 Deden Hadiguna is now displayed as Founder on leaderboard!');
    console.log('🌐 Changes will appear at: https://mpt-community.vercel.app/leaderboard\n');

  } catch (error: any) {
    console.error('❌ Error marking founder:');
    console.error(error.message);
    process.exit(1);
  }
}

markFounder()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
