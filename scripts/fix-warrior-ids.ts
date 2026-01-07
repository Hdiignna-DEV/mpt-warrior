/**
 * Fix missing warriorId for all users
 */
import { config } from 'dotenv';
import { getCosmosClient } from '../src/lib/db/cosmos-client';

config({ path: '.env.local' });

function generateWarriorId(index: number): string {
  return `MPT-2026-${String(index).padStart(5, '0')}`;
}

async function fixWarriorIds() {
  try {
    console.log('🔧 Fixing missing warriorIds...\n');
    
    const client = getCosmosClient();
    const database = client.database(process.env.AZURE_COSMOS_DATABASE || 'mpt-warrior');
    const container = database.container('users');

    // Get all users
    const { resources: users } = await container.items.query('SELECT * FROM c').fetchAll();

    console.log(`Found ${users.length} users\n`);

    let counter = 1;
    for (const user of users) {
      if (!user.warriorId) {
        // Generate warriorId based on counter
        const warriorId = generateWarriorId(counter);
        
        const updatedUser = {
          ...user,
          warriorId,
          currentBadgeLevel: user.currentBadgeLevel || 'RECRUIT',
          badges: user.badges || [],
          disciplineScore: user.disciplineScore || 500,
          profileSettings: user.profileSettings || {
            personalGoal: '',
            tradingStrategy: 'DAY_TRADING',
            preferredTimeframe: '',
            bio: ''
          },
          updatedAt: new Date().toISOString()
        };

        await container.item(user.id, user.id).replace(updatedUser);
        console.log(`✅ Updated ${user.email}: ${warriorId}`);
        counter++;
      } else {
        console.log(`⏭️ Skipped ${user.email}: Already has ${user.warriorId}`);
      }
    }

    console.log('\n✅ All users updated!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

fixWarriorIds()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
