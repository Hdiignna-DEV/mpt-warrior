/**
 * Create Warrior User in Cosmos DB
 */
import { config } from 'dotenv';
import { getCosmosClient } from '../src/lib/db/cosmos-client';

config({ path: '.env.local' });

async function createWarriorUser() {
  try {
    console.log('🔄 Creating warrior user...');
    
    const client = getCosmosClient();
    const database = client.database(process.env.AZURE_COSMOS_DATABASE || 'mpt-warrior');
    const container = database.container('users');

    const warriorUser = {
      id: 'user-1767761633450-1ocso5',
      email: 'dedenhadiguna180405@gmail.com',
      password: '$2a$10$YourHashedPasswordHere',
      name: 'Warrior Member',
      displayName: 'Warrior Member',
      role: 'WARRIOR',
      status: 'active',
      warriorId: 'MPT-2026-00002',
      currentBadgeLevel: 'RECRUIT',
      badges: [],
      disciplineScore: 500,
      profileSettings: {
        personalGoal: '',
        tradingStrategy: 'DAY_TRADING',
        preferredTimeframe: '',
        bio: ''
      },
      whatsapp: '',
      telegram_id: '',
      avatar: '',
      totalTrades: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { resource } = await container.items.create(warriorUser);
    console.log('✅ Warrior user created successfully!');
    console.log('📋 User ID:', resource?.id);
    console.log('📋 Warrior ID:', resource?.warriorId);
    console.log('📋 Email:', resource?.email);
    console.log('📋 Role:', resource?.role);
  } catch (error: any) {
    if (error.code === 409) {
      console.log('ℹ️ User already exists!');
    } else {
      console.error('❌ Error creating user:', error.message);
      throw error;
    }
  }
}

createWarriorUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
