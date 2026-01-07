/**
 * Create Admin User in Cosmos DB
 */
import { config } from 'dotenv';
import { getCosmosClient } from '../src/lib/db/cosmos-client';

config({ path: '.env.local' });

async function createAdminUser() {
  try {
    console.log('🔄 Creating admin user...');
    
    const client = getCosmosClient();
    const database = client.database(process.env.AZURE_COSMOS_DATABASE || 'mpt-warrior');
    const container = database.container('users');

    const adminUser = {
      id: 'user-1767578821404-k6hrod',
      email: 'dedenhadigun@gmail.com',
      password: '$2a$10$YourHashedPasswordHere', // Password sudah di-hash saat register
      name: 'Admin MPT',
      displayName: 'Admin MPT',
      role: 'ADMIN',
      status: 'active',
      warriorId: 'MPT-2026-00001',
      currentBadgeLevel: 'RECRUIT',
      badges: [],
      disciplineScore: 500,
      profileSettings: {
        personalGoal: 'Building MPT Community',
        tradingStrategy: 'SWING_TRADING',
        preferredTimeframe: '4H',
        bio: 'MPT Community Administrator'
      },
      whatsapp: '',
      telegram_id: '',
      avatar: '',
      totalTrades: 0,
      createdAt: new Date('2025-01-04T12:00:21.404Z').toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { resource } = await container.items.create(adminUser);
    console.log('✅ Admin user created successfully!');
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

createAdminUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
