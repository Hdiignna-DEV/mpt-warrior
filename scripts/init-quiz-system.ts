/**
 * Initialize Quiz Containers in Cosmos DB
 * Run: npx tsx scripts/init-quiz-system.ts
 */

import { CosmosClient } from '@azure/cosmos';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

const endpoint = process.env.AZURE_COSMOS_ENDPOINT!;
const key = process.env.AZURE_COSMOS_KEY!;
const databaseId = process.env.AZURE_COSMOS_DATABASE || 'MPTDatabase';

if (!endpoint || !key) {
  console.error('❌ Missing AZURE_COSMOS_ENDPOINT or AZURE_COSMOS_KEY in .env.local');
  process.exit(1);
}

const client = new CosmosClient({ endpoint, key });

async function initQuizContainers() {
  console.log('🚀 Initializing Quiz System Containers...\n');
  console.log(`Database: ${databaseId}`);
  console.log(`Endpoint: ${endpoint.substring(0, 30)}...`);
  console.log('');

  try {
    // Get or create database
    const { database } = await client.databases.createIfNotExists({
      id: databaseId,
    });
    console.log(`✅ Database: ${databaseId} ready\n`);

    // Container 1: quiz-questions
    console.log('📝 Creating quiz-questions container...');
    const { container: questionsContainer } = await database.containers.createIfNotExists({
      id: 'quiz-questions',
      partitionKey: {
        paths: ['/moduleId'], // Partition by moduleId
      },
    });

    console.log('✅ Container: quiz-questions');
    console.log('   Partition Key: /moduleId');
    console.log('   Purpose: Store quiz questions for each module');
    console.log('');

    // Container 2: quiz-answers
    console.log('📊 Creating quiz-answers container...');
    const { container: answersContainer } = await database.containers.createIfNotExists({
      id: 'quiz-answers',
      partitionKey: {
        paths: ['/userId'], // Partition by userId
      },
    });

    console.log('✅ Container: quiz-answers');
    console.log('   Partition Key: /userId');
    console.log('   Purpose: Store user quiz submissions and scores');
    console.log('');

    console.log('═'.repeat(60));
    console.log('🎉 Quiz System Containers Initialized Successfully!');
    console.log('═'.repeat(60));
    console.log('\nNext Steps:');
    console.log('1. Run: npx tsx scripts/populate-complete-quiz.ts');
    console.log('2. This will insert 52 quiz questions into the database');
    console.log('');

  } catch (error: any) {
    console.error('\n❌ Error initializing containers:', error.message);
    process.exit(1);
  }
}

initQuizContainers()
  .then(() => {
    console.log('✨ Process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
