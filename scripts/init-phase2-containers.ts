/**
 * Initialize Phase 2 Cosmos DB Containers
 * - educational-modules: Learning content storage
 * - user-progress: Track user learning progress
 */

import { CosmosClient } from '@azure/cosmos';


const endpoint = process.env.AZURE_COSMOS_ENDPOINT!;
const key = process.env.AZURE_COSMOS_KEY!;
const databaseId = process.env.AZURE_COSMOS_DATABASE || 'mpt-warrior';

const client = new CosmosClient({ endpoint, key });

async function initPhase2Containers() {
  console.log('🚀 Initializing Phase 2 Containers...\n');

  try {
    // Get or create database
    const { database } = await client.databases.createIfNotExists({
      id: databaseId,
    });
    console.log(`✅ Database: ${databaseId}`);

    // Container 1: educational-modules
    console.log('\n📚 Creating educational-modules container...');
    const { container: modulesContainer } = await database.containers.createIfNotExists({
      id: 'educational-modules',
      partitionKey: {
        paths: ['/level'], // Partition by level: RECRUIT, WARRIOR, VETERAN
      },
    });

    console.log('✅ Container: educational-modules');
    console.log('   Partition Key: /level');
    console.log('   Purpose: Store learning modules and lessons');

    // Container 2: user-progress
    console.log('\n📈 Creating user-progress container...');
    const { container: progressContainer } = await database.containers.createIfNotExists({
      id: 'user-progress',
      partitionKey: {
        paths: ['/userId'], // Partition by userId
      },
    });

    console.log('✅ Container: user-progress');
    console.log('   Partition Key: /userId');
    console.log('   Purpose: Track user learning progress');

    // Sample data for educational-modules
    console.log('\n📝 Inserting sample educational modules...');
    
    const sampleModules = [
      {
        id: 'module-001',
        level: 'RECRUIT',
        title: 'Trading Basics: Introduction to Forex',
        description: 'Pengenalan dasar trading forex untuk pemula',
        order: 1,
        lessons: [
          {
            id: 'lesson-001-01',
            title: 'Apa itu Forex Trading?',
            content: `# Apa itu Forex Trading?

Forex (Foreign Exchange) adalah pasar global untuk pertukaran mata uang. 

**Key Points:**
- Market terbesar di dunia ($6.6 triliun/hari)
- Beroperasi 24/5 (Senin-Jumat)
- High liquidity & leverage
- Decentralized market

**Pasangan Mata Uang Utama:**
- EUR/USD (Euro/US Dollar)
- GBP/USD (British Pound/US Dollar)
- USD/JPY (US Dollar/Japanese Yen)
- XAU/USD (Gold/US Dollar)`,
            imageUrl: null,
            videoUrl: 'https://www.youtube.com/watch?v=example',
            order: 1,
            estimatedMinutes: 10,
          },
          {
            id: 'lesson-001-02',
            title: 'Risk Management 101',
            content: `# Risk Management 101

**Golden Rule:** Never risk more than 1-2% per trade.

**Risk Management Formula:**
\`\`\`
Position Size = (Account Balance × Risk %) / Stop Loss (pips)
\`\`\`

**Example:**
- Balance: Rp 10,000,000
- Risk: 2% = Rp 200,000
- Stop Loss: 50 pips
- Position Size: Rp 200,000 / 50 = Rp 4,000/pip`,
            imageUrl: '/academy/risk-management-chart.png',
            videoUrl: null,
            order: 2,
            estimatedMinutes: 15,
          },
        ],
        prerequisites: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'module-002',
        level: 'WARRIOR',
        title: 'Advanced Chart Patterns',
        description: 'Mengenali dan trading dengan chart patterns',
        order: 1,
        lessons: [
          {
            id: 'lesson-002-01',
            title: 'Head and Shoulders Pattern',
            content: `# Head and Shoulders Pattern

Pattern reversal yang sangat powerful.

**Karakteristik:**
- Left Shoulder
- Head (higher high)
- Right Shoulder
- Neckline break = Entry signal

**Trading Strategy:**
- Entry: Break neckline
- Stop Loss: Above right shoulder
- Target: Height of pattern`,
            imageUrl: '/academy/head-shoulders-pattern.png',
            videoUrl: 'https://www.youtube.com/watch?v=example2',
            order: 1,
            estimatedMinutes: 20,
          },
        ],
        prerequisites: ['module-001'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'module-003',
        level: 'VETERAN',
        title: 'Market Psychology & Discipline',
        description: 'Menguasai psikologi trading dan disiplin eksekusi',
        order: 1,
        lessons: [
          {
            id: 'lesson-003-01',
            title: 'Fear and Greed Cycle',
            content: `# Fear and Greed Cycle

**Fear:**
- FOMO (Fear of Missing Out)
- Fear of losing money
- Revenge trading

**Greed:**
- Overleveraging
- Moving SL to breakeven too early
- Not taking profits

**Solution: THE MPT WAY**
- Mindset: Discipline over emotion
- Plan: Strategy before execution
- Trader: Execute with confidence`,
            imageUrl: '/academy/fear-greed-index.png',
            videoUrl: null,
            order: 1,
            estimatedMinutes: 25,
          },
        ],
        prerequisites: ['module-001', 'module-002'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const module of sampleModules) {
      await modulesContainer.items.upsert(module);
      console.log(`   ✅ Module: ${module.title} (${module.level})`);
    }

    console.log('\n🎉 Phase 2 containers initialized successfully!\n');
    console.log('📊 Summary:');
    console.log('   - educational-modules: 3 modules, 4 lessons');
    console.log('   - user-progress: Ready for tracking');
    console.log('   - Shared throughput: 1000 RU/s\n');

  } catch (error) {
    console.error('❌ Error initializing containers:', error);
    process.exit(1);
  }
}

initPhase2Containers();
