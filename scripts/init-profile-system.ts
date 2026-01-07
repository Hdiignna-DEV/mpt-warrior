/**
 * Database Migration Script
 * Initialize Profile System Containers in Azure Cosmos DB
 * 
 * Run with: npx tsx scripts/init-profile-system.ts
 */

import { getDatabase } from '@/utils/cosmosdb';

const CONTAINERS = [
  {
    id: 'referrals',
    partitionKey: '/referrerId',
    description: 'Referral codes and tracking for Veteran warriors'
  },
  {
    id: 'discipline-logs',
    partitionKey: '/userId',
    description: 'Discipline score tracking for warriors'
  },
  {
    id: 'global-settings',
    partitionKey: '/id',
    description: 'System-wide settings (SUPER_ADMIN only)'
  }
];

async function initializeProfileSystem() {
  console.log('🚀 Initializing Warrior Profile System...\n');

  try {
    const database = await getDatabase();
    console.log(`✅ Connected to database: ${database.id}\n`);

    // Create containers
    for (const containerConfig of CONTAINERS) {
      console.log(`📦 Creating container: ${containerConfig.id}`);
      console.log(`   Description: ${containerConfig.description}`);
      
      try {
        const { container } = await database.containers.createIfNotExists({
          id: containerConfig.id,
          partitionKey: { paths: [containerConfig.partitionKey] },
          indexingPolicy: {
            automatic: true,
            indexingMode: 'consistent',
            includedPaths: [{ path: '/*' }],
            excludedPaths: [{ path: '/"_etag"/?' }]
          }
        });
        
        console.log(`   ✅ Container created/verified: ${container.id}\n`);
      } catch (error: any) {
        console.error(`   ❌ Error creating container ${containerConfig.id}:`, error.message, '\n');
      }
    }

    // Initialize global settings
    console.log('⚙️  Initializing global settings...');
    const settingsContainer = database.container('global-settings');
    
    const defaultSettings = {
      id: 'system-config',
      flatReferralDiscount: 20, // Default 20% discount
      maxReferralsPerUser: 100,
      warriorIdPrefix: 'MPT',
      currentYear: new Date().getFullYear(),
      lastWarriorIdNumber: 0,
      systemAnnouncement: null,
      maintenanceMode: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await settingsContainer.items.create(defaultSettings);
      console.log('✅ Global settings initialized\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('ℹ️  Global settings already exist\n');
      } else {
        console.error('❌ Error initializing settings:', error.message, '\n');
      }
    }

    // Update users container with sample warrior data (for existing users)
    console.log('👤 Updating existing users with Warrior Profile fields...');
    const usersContainer = database.container('users');
    
    // Note: In production, you'd want to batch update existing users
    console.log('ℹ️  Run user migration separately to add warriorId, badges, etc.\n');

    console.log('🎉 Warrior Profile System initialization complete!');
    console.log('\nNext steps:');
    console.log('1. Run user migration to add warriorId to existing users');
    console.log('2. Deploy updated authentication middleware');
    console.log('3. Test role-based access control');
    console.log('4. Launch Warrior Profile UI\n');

  } catch (error) {
    console.error('💥 Fatal error during initialization:', error);
    throw error;
  }
}

// Helper function to generate Warrior ID
export function generateWarriorId(year: number, sequenceNumber: number): string {
  const paddedNumber = String(sequenceNumber).padStart(5, '0');
  return `MPT-${year}-${paddedNumber}`;
}

// Helper function to calculate badge level
export function calculateBadgeLevel(totalTrades: number, referrals: number): 'RECRUIT' | 'WARRIOR' | 'VETERAN' {
  if (totalTrades >= 50 && referrals > 0) return 'VETERAN';
  if (totalTrades >= 5) return 'WARRIOR';
  return 'RECRUIT';
}

// Run if called directly
if (require.main === module) {
  initializeProfileSystem()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default initializeProfileSystem;
