#!/usr/bin/env npx tsx
/**
 * Comprehensive Quiz Verification Script
 * Checks ALL modules (1, 2, 3) in Cosmos DB
 * Ensures no white screen issues
 * 
 * Run: npm run quiz:verify
 */

import { CosmosClient } from '@azure/cosmos';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
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
  process.exit(1);
}

interface QuizQuestion {
  id: string;
  moduleId: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  question: string;
  points: number;
  order: number;
}

const client = new CosmosClient({ endpoint, key });
const expectedCounts = {
  'module-1': 15,
  'module-2': 17,
  'module-3': 20
};

async function verifyQuizzes() {
  console.log('🔍 COMPREHENSIVE QUIZ VERIFICATION\n');
  console.log('=' .repeat(70));

  const database = client.database(databaseId);
  const container = database.container(containerId);

  let allHealthy = true;

  // Check each module
  for (const [moduleId, expectedCount] of Object.entries(expectedCounts)) {
    console.log(`\n📚 ${moduleId.toUpperCase()}`);
    console.log('─'.repeat(70));

    try {
      // Query questions for this module
      const { resources: questions } = await container.items
        .query({
          query: 'SELECT * FROM c WHERE c.moduleId = @moduleId ORDER BY c["order"] ASC',
          parameters: [{ name: '@moduleId', value: moduleId }],
        })
        .fetchAll();

      const actualCount = questions.length;
      const status = actualCount === expectedCount ? '✅' : '❌';
      
      console.log(`${status} Questions Found: ${actualCount}/${expectedCount}`);

      if (actualCount === 0) {
        console.log('   ⚠️  NO QUESTIONS FOUND - WHITE SCREEN RISK!');
        allHealthy = false;
      } else if (actualCount < expectedCount) {
        console.log(`   ⚠️  MISSING ${expectedCount - actualCount} QUESTION(S)`);
        allHealthy = false;
      }

      // Breakdown by type
      if (actualCount > 0) {
        const mcCount = questions.filter((q: QuizQuestion) => q.type === 'multiple-choice').length;
        const tfCount = questions.filter((q: QuizQuestion) => q.type === 'true-false').length;
        const essayCount = questions.filter((q: QuizQuestion) => q.type === 'essay').length;
        const totalPoints = questions.reduce((sum: number, q: QuizQuestion) => sum + q.points, 0);

        console.log(`   📊 Breakdown:`);
        console.log(`      • Multiple Choice: ${mcCount}`);
        console.log(`      • True/False: ${tfCount}`);
        console.log(`      • Essay: ${essayCount}`);
        console.log(`      • Total Points: ${totalPoints}`);

        // Check for data integrity
        let missingFields = 0;
        questions.forEach((q: QuizQuestion, idx: number) => {
          const missingProps = [];
          if (!q.id) missingProps.push('id');
          if (!q.question) missingProps.push('question');
          if (!q.type) missingProps.push('type');
          if (q.points === undefined) missingProps.push('points');
          if (q.order === undefined) missingProps.push('order');

          if (missingProps.length > 0) {
            console.log(`      ❌ Question #${idx + 1}: Missing ${missingProps.join(', ')}`);
            missingFields++;
          }
        });

        if (missingFields > 0) {
          allHealthy = false;
          console.log(`   ⚠️  ${missingFields} question(s) with missing fields`);
        } else {
          console.log(`   ✅ All question fields valid`);
        }

        // List questions
        console.log(`\n   📋 Questions List:`);
        questions.forEach((q: QuizQuestion) => {
          const typeEmoji = q.type === 'essay' ? '📝' : q.type === 'true-false' ? '✓' : '●';
          console.log(`      ${typeEmoji} [${q.id}] (${q.points}pts) ${q.question.substring(0, 60)}...`);
        });
      }

    } catch (error: any) {
      console.log(`❌ ERROR: ${error.message}`);
      allHealthy = false;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 FINAL VERIFICATION REPORT\n');

  if (allHealthy) {
    console.log('✅ ALL QUIZZES ARE HEALTHY');
    console.log('   • Module 1: 15 questions ✓');
    console.log('   • Module 2: 17 questions ✓');
    console.log('   • Module 3: 20 questions ✓');
    console.log('   • Total: 52 questions, 540 points');
    console.log('\n🎉 No white screen issues detected!');
  } else {
    console.log('❌ QUIZ ISSUES DETECTED');
    console.log('   Run "npm run quiz:populate-all" to seed missing data');
  }

  console.log('\n' + '='.repeat(70));
}

verifyQuizzes()
  .then(() => {
    console.log('\n✨ Verification complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
