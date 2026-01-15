#!/usr/bin/env npx tsx
/**
 * Quick script to seed ONLY Module 2 quiz questions
 * Run: npm run seed:module2
 * or: npx tsx scripts/seed-module2-quiz.ts
 */

import { CosmosClient } from '@azure/cosmos';
import { MODULE_2_QUIZ } from './complete-quiz-data';
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
const containerId = 'quiz-questions';

if (!endpoint || !key) {
  console.error('❌ Missing AZURE_COSMOS_ENDPOINT or AZURE_COSMOS_KEY in .env.local');
  console.error('Found env vars:', Object.keys(process.env).filter(k => k.includes('COSMOS')));
  process.exit(1);
}

const client = new CosmosClient({ endpoint, key });

async function seedModule2Quiz() {
  console.log('🚀 Starting Module 2 quiz seeding...\n');

  const database = client.database(databaseId);
  const container = database.container(containerId);

  console.log(`📊 Total questions to insert: ${MODULE_2_QUIZ.length}`);
  console.log(`   - Module 2: ${MODULE_2_QUIZ.length} questions\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const quiz of MODULE_2_QUIZ) {
    try {
      // Upsert (create or replace) each question
      await container.items.upsert({
        ...quiz,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      successCount++;
      console.log(`✅ [${successCount}/${MODULE_2_QUIZ.length}] ${quiz.id} - ${quiz.question.substring(0, 50)}...`);
    } catch (error: any) {
      errorCount++;
      console.error(`❌ Error inserting ${quiz.id}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📈 SEEDING SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully inserted: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total: ${MODULE_2_QUIZ.length}`);
  
  if (successCount === MODULE_2_QUIZ.length) {
    console.log('\n🎉 All Module 2 quiz data seeded successfully!');
    
    // Show breakdown
    const module2Points = MODULE_2_QUIZ.reduce((sum, q) => sum + q.points, 0);
    const mcCount = MODULE_2_QUIZ.filter(q => q.type === 'multiple-choice').length;
    const tfCount = MODULE_2_QUIZ.filter(q => q.type === 'true-false').length;
    const essayCount = MODULE_2_QUIZ.filter(q => q.type === 'essay').length;
    
    console.log('\n📊 MODULE 2 STATS:');
    console.log('─'.repeat(60));
    console.log(`Total questions: ${MODULE_2_QUIZ.length}`);
    console.log(`Total points: ${module2Points}`);
    console.log(`Multiple Choice: ${mcCount}`);
    console.log(`True/False: ${tfCount}`);
    console.log(`Essay: ${essayCount}`);
  } else {
    console.log(`\n⚠️ Seeding completed with ${errorCount} error(s)`);
  }
}

seedModule2Quiz()
  .then(() => {
    console.log('\n✨ Process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
