/**
 * Initialize Profile System Containers
 * Creates necessary Cosmos DB containers for the User Management & Profile System
 */

import { CosmosClient } from '@azure/cosmos';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const endpoint = process.env.AZURE_COSMOS_ENDPOINT || '';
const key = process.env.AZURE_COSMOS_KEY || '';
const databaseId = process.env.AZURE_COSMOS_DATABASE || 'MPT';

if (!endpoint || !key) {
  console.error('❌ Missing Azure Cosmos DB credentials');
  console.error('Please set AZURE_COSMOS_ENDPOINT and AZURE_COSMOS_KEY in .env.local');
  process.exit(1);
}

const client = new CosmosClient({ endpoint, key });

async function initializeProfileSystem() {
  console.log('🚀 Initializing Profile System Containers...\n');

  try {
    const database = client.database(databaseId);

    // 1. Create Referrals Container
    console.log('📦 Creating referrals container...');
    try {
      const { container: referralsContainer } = await database.containers.createIfNotExists({
        id: 'referrals',
        partitionKey: {
          paths: ['/referrerId'],
          version: 2
        },
        indexingPolicy: {
          automatic: true,
          indexingMode: 'consistent',
          includedPaths: [
            { path: '/*' }
          ],
          excludedPaths: [
            { path: '/_etag/?' }
          ]
        }
      });
      console.log('✅ Referrals container ready\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('✅ Referrals container already exists\n');
      } else {
        throw error;
      }
    }

    // 2. Create Discipline Logs Container
    console.log('📦 Creating discipline-logs container...');
    try {
      const { container: disciplineContainer } = await database.containers.createIfNotExists({
        id: 'discipline-logs',
        partitionKey: {
          paths: ['/userId'],
          version: 2
        },
        indexingPolicy: {
          automatic: true,
          indexingMode: 'consistent',
          includedPaths: [
            { path: '/*' }
          ],
          excludedPaths: [
            { path: '/_etag/?' }
          ]
        }
      });
      console.log('✅ Discipline logs container ready\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('✅ Discipline logs container already exists\n');
      } else {
        throw error;
      }
    }

    // 3. Create Global Settings Container
    console.log('📦 Creating global-settings container...');
    try {
      const { container: settingsContainer } = await database.containers.createIfNotExists({
        id: 'global-settings',
        partitionKey: {
          paths: ['/id'],
          version: 2
        }
      });

      // Initialize default settings
      console.log('⚙️  Initializing default settings...');
      try {
        await settingsContainer.items.create({
          id: 'system-settings',
          referralDiscountPercent: 20,
          maxReferralsPerVeteran: 50,
          minTradesForVeteran: 100,
          minDisciplineScoreForVeteran: 750,
          enableRegistration: true,
          maintenanceMode: false,
          systemAnnouncement: '',
          updatedAt: new Date().toISOString(),
          updatedBy: 'system'
        });
        console.log('✅ Default settings initialized\n');
      } catch (error: any) {
        if (error.code === 409) {
          console.log('✅ Settings already exist\n');
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      if (error.code === 409) {
        console.log('✅ Global settings container already exists\n');
      } else {
        throw error;
      }
    }

    // 4. Verify Users Container exists
    console.log('📦 Verifying users container...');
    try {
      const { container: usersContainer } = await database.containers.createIfNotExists({
        id: 'users',
        partitionKey: {
          paths: ['/id'],
          version: 2
        },
        indexingPolicy: {
          automatic: true,
          indexingMode: 'consistent',
          includedPaths: [
            { path: '/*' }
          ],
          excludedPaths: [
            { path: '/_etag/?' }
          ]
        }
      });
      console.log('✅ Users container ready\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('✅ Users container already exists\n');
      } else {
        throw error;
      }
    }

    // 5. Create Invitation Codes Container (if not exists)
    console.log('📦 Verifying invitation-codes container...');
    try {
      const { container: invitationContainer } = await database.containers.createIfNotExists({
        id: 'invitation-codes',
        partitionKey: {
          paths: ['/id'],
          version: 2
        },
        indexingPolicy: {
          automatic: true,
          indexingMode: 'consistent',
          includedPaths: [
            { path: '/*' }
          ],
          excludedPaths: [
            { path: '/_etag/?' }
          ]
        }
      });
      console.log('✅ Invitation codes container ready\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('✅ Invitation codes container already exists\n');
      } else {
        throw error;
      }
    }

    console.log('🎉 Profile System Initialization Complete!\n');
    console.log('📋 Summary:');
    console.log('   ✅ referrals - For LEGACY referral codes');
    console.log('   ✅ discipline-logs - For discipline score tracking');
    console.log('   ✅ global-settings - For system configuration');
    console.log('   ✅ users - User profiles with warrior data');
    console.log('   ✅ invitation-codes - Registration invitation codes\n');
    console.log('🚀 You can now use the User Management & Profile System!\n');

  } catch (error) {
    console.error('❌ Error initializing profile system:', error);
    process.exit(1);
  }
}

// Run initialization
initializeProfileSystem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
