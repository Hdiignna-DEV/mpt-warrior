/**
 * Script to populate complete quiz data into Cosmos DB
 * Run: npx tsx scripts/populate-complete-quiz.ts
 */

import { CosmosClient } from '@azure/cosmos';
import { MODULE_1_QUIZ, MODULE_2_QUIZ, MODULE_3_QUIZ } from './complete-quiz-data';
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

async function populateQuizData() {
  console.log('🚀 Starting quiz data population...\n');

  const database = client.database(databaseId);
  const container = database.container(containerId);

  // Combine all quizzes
  const allQuizzes = [
    ...MODULE_1_QUIZ,
    ...MODULE_2_QUIZ,
    ...MODULE_3_QUIZ
  ];

  console.log(`📊 Total questions to insert: ${allQuizzes.length}`);
  console.log(`   - Module 1: ${MODULE_1_QUIZ.length} questions`);
  console.log(`   - Module 2: ${MODULE_2_QUIZ.length} questions`);
  console.log(`   - Module 3: ${MODULE_3_QUIZ.length} questions\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const quiz of allQuizzes) {
    try {
      // Upsert (create or replace) each question
      await container.items.upsert({
        ...quiz,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      successCount++;
      console.log(`✅ [${successCount}/${allQuizzes.length}] ${quiz.id} - ${quiz.question.substring(0, 50)}...`);
    } catch (error: any) {
      errorCount++;
      console.error(`❌ Error inserting ${quiz.id}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📈 POPULATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully inserted: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total: ${allQuizzes.length}`);
  
  if (successCount === allQuizzes.length) {
    console.log('\n🎉 All quiz data populated successfully!');
    
    // Show breakdown
    console.log('\n📊 BREAKDOWN BY MODULE:');
    console.log('─'.repeat(60));
    
    const module1Points = MODULE_1_QUIZ.reduce((sum, q) => sum + q.points, 0);
    const module2Points = MODULE_2_QUIZ.reduce((sum, q) => sum + q.points, 0);
    const module3Points = MODULE_3_QUIZ.reduce((sum, q) => sum + q.points, 0);
    
    console.log(`Module 1: ${MODULE_1_QUIZ.length} questions, ${module1Points} points`);
    console.log(`Module 2: ${MODULE_2_QUIZ.length} questions, ${module2Points} points`);
    console.log(`Module 3: ${MODULE_3_QUIZ.length} questions, ${module3Points} points`);
    console.log(`\nTOTAL: ${allQuizzes.length} questions, ${module1Points + module2Points + module3Points} points`);
    
    // Question type breakdown
    console.log('\n📋 QUESTION TYPES:');
    console.log('─'.repeat(60));
    const mcCount = allQuizzes.filter(q => q.type === 'multiple-choice').length;
    const tfCount = allQuizzes.filter(q => q.type === 'true-false').length;
    const essayCount = allQuizzes.filter(q => q.type === 'essay').length;
    
    console.log(`Multiple Choice: ${mcCount}`);
    console.log(`True/False: ${tfCount}`);
    console.log(`Essay: ${essayCount}`);
  }
}

populateQuizData()
  .then(() => {
    console.log('\n✨ Process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
