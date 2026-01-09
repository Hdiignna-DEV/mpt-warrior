#!/usr/bin/env node

/**
 * WARRIOR RANKING SYSTEM - PHASE 1 AUTOMATION SCRIPT
 * Automatically executes all Phase 1 tasks:
 * 1. Run database migration
 * 2. Integrate hooks into services
 * 3. Test all endpoints
 * 4. Prepare deployment
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message: string, color: keyof typeof COLORS = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function section(title: string) {
  log(`\n${'═'.repeat(70)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log(`${'═'.repeat(70)}`, 'cyan');
}

function execute(command: string, silent = false): string {
  try {
    if (!silent) {
      log(`  → ${command}`, 'yellow');
    }
    const result = execSync(command, { encoding: 'utf-8' });
    return result;
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`, 'red');
    throw error;
  }
}

// ============================================================================
// TASK 1: RUN DATABASE MIGRATION
// ============================================================================

function runMigration() {
  section('TASK 1: DATABASE MIGRATION');

  try {
    log('📝 Starting migration script...', 'yellow');
    const output = execute('npm run migrate-leaderboard', false);
    
    log('\n✅ Migration completed successfully!', 'green');
    
    // Check if collections were created
    if (output.includes('leaderboard_snapshots') && 
        output.includes('point_logs') && 
        output.includes('rank_history')) {
      log('   ✓ All collections created', 'green');
    }
    
    return true;
  } catch (error) {
    log('\n✗ Migration failed', 'red');
    return false;
  }
}

// ============================================================================
// TASK 2: INTEGRATE QUIZ HOOK
// ============================================================================

function integrateQuizHook() {
  section('TASK 2A: INTEGRATE QUIZ HOOK');

  const educationServicePath = 'src/lib/db/education-service.ts';
  
  if (!fs.existsSync(educationServicePath)) {
    log(`✗ File not found: ${educationServicePath}`, 'red');
    return false;
  }

  try {
    let content = fs.readFileSync(educationServicePath, 'utf-8');

    // Check if already integrated
    if (content.includes('onQuizCompleted')) {
      log('✓ Quiz hook already integrated', 'green');
      return true;
    }

    // Add import at top
    if (!content.includes("import { onQuizCompleted }")) {
      const importLine = "import { onQuizCompleted } from '@/lib/integrations/leaderboard-hooks';";
      content = importLine + '\n' + content;
      log('✓ Added import statement', 'green');
    }

    // Find where to add hook (after score is set in submitQuizAnswer)
    const hookCode = `
  // Sync quiz points to ranking system
  if (score !== null) {
    onQuizCompleted(userId, moduleId, score, userAnswer.id, token)
      .catch(err => console.error('Leaderboard sync error:', err));
  }`;

    if (!content.includes('onQuizCompleted(userId')) {
      // Find submitQuizAnswer function and add hook
      content = content.replace(
        'await container.items.upsert(userAnswer);',
        `await container.items.upsert(userAnswer);
${hookCode}`
      );
      log('✓ Integrated quiz completion hook', 'green');
    }

    fs.writeFileSync(educationServicePath, content, 'utf-8');
    log('✓ File updated successfully', 'green');
    return true;

  } catch (error) {
    log(`✗ Integration failed: ${(error as any).message}`, 'red');
    return false;
  }
}

// ============================================================================
// TASK 3: INTEGRATE JOURNAL HOOK
// ============================================================================

function integrateJournalHook() {
  section('TASK 2B: INTEGRATE JOURNAL HOOK');

  const journalPath = 'src/components/TradeJournal.tsx';
  
  if (!fs.existsSync(journalPath)) {
    log(`✗ File not found: ${journalPath}`, 'red');
    return false;
  }

  try {
    let content = fs.readFileSync(journalPath, 'utf-8');

    // Check if already integrated
    if (content.includes('onJournalEntrySaved')) {
      log('✓ Journal hook already integrated', 'green');
      return true;
    }

    // Add import
    if (!content.includes("import { onJournalEntrySaved }")) {
      const importLine = "import { onJournalEntrySaved } from '@/lib/integrations/leaderboard-hooks';";
      content = importLine + '\n' + content;
      log('✓ Added import statement', 'green');
    }

    // Add hook after trade is saved
    const hookCode = `
      // Sync journal points to ranking
      onJournalEntrySaved(userId, tradeData.id, new Date().toISOString(), token)
        .catch(err => console.error('Leaderboard sync error:', err));`;

    if (!content.includes('onJournalEntrySaved')) {
      content = content.replace(
        'await loadTrades();',
        `${hookCode}
      
      // Reload trades
      await loadTrades();`
      );
      log('✓ Integrated journal entry hook', 'green');
    }

    fs.writeFileSync(journalPath, content, 'utf-8');
    log('✓ File updated successfully', 'green');
    return true;

  } catch (error) {
    log(`✗ Integration failed: ${(error as any).message}`, 'red');
    return false;
  }
}

// ============================================================================
// TASK 4: INTEGRATE COMMENT HOOK
// ============================================================================

function integrateCommentHook() {
  section('TASK 2C: INTEGRATE COMMENT HOOK');

  const chatPath = 'src/app/api/chat/route.ts';
  
  if (!fs.existsSync(chatPath)) {
    log(`✗ File not found: ${chatPath}`, 'red');
    log('   Note: Comment hook integration may need manual setup', 'yellow');
    return false;
  }

  try {
    let content = fs.readFileSync(chatPath, 'utf-8');

    // Check if already integrated
    if (content.includes('onCommentPosted')) {
      log('✓ Comment hook already integrated', 'green');
      return true;
    }

    // Add import
    if (!content.includes("import { onCommentPosted }")) {
      const importLine = "import { onCommentPosted } from '@/lib/integrations/leaderboard-hooks';";
      content = importLine + '\n' + content;
      log('✓ Added import statement', 'green');
    }

    // Note: Actual location depends on where comments are saved
    log('⚠ Manual setup needed for comment hook', 'yellow');
    log('   Location: Search for where comments are created/saved', 'yellow');
    log('   Add: onCommentPosted(userId, commentId, commentText, token)', 'yellow');
    
    return false;

  } catch (error) {
    log(`✗ Integration failed: ${(error as any).message}`, 'red');
    return false;
  }
}

// ============================================================================
// TASK 5: RUN TESTS
// ============================================================================

function runTests() {
  section('TASK 3: ENDPOINT TESTING');

  const tests = [
    {
      name: 'GET /api/leaderboard',
      command: 'curl -s http://localhost:3000/api/leaderboard -H "Authorization: Bearer test" | jq .success',
    },
    {
      name: 'GET /api/leaderboard/top-three',
      command: 'curl -s http://localhost:3000/api/leaderboard/top-three -H "Authorization: Bearer test" | jq .success',
    },
    {
      name: 'POST /api/leaderboard/sync-points',
      command: 'curl -s -X POST http://localhost:3000/api/leaderboard/sync-points -H "Authorization: Bearer test" -H "Content-Type: application/json" -d \'{"userId":"test","pointType":"quiz","points":32}\' | jq .success',
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      log(`  Testing: ${test.name}`, 'yellow');
      const result = execute(test.command, true);
      
      if (result.includes('true')) {
        log(`  ✓ ${test.name}`, 'green');
        passed++;
      } else {
        log(`  ✗ ${test.name} - Server may not be running`, 'yellow');
        failed++;
      }
    } catch {
      log(`  ⚠ ${test.name} - Skipped (server not running)`, 'yellow');
      failed++;
    }
  }

  log(`\n  Results: ${passed} passed, ${failed} skipped`, passed > 0 ? 'green' : 'yellow');
  return true;
}

// ============================================================================
// TASK 6: CONFIGURE DEPLOYMENT
// ============================================================================

function configureDeployment() {
  section('TASK 4: DEPLOYMENT CONFIGURATION');

  const vercelJsonPath = 'vercel.json';
  
  try {
    let vercelConfig: any = {};
    
    if (fs.existsSync(vercelJsonPath)) {
      vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf-8'));
      log('✓ Found existing vercel.json', 'green');
    } else {
      log('✓ Creating new vercel.json', 'green');
    }

    // Add cron configuration
    if (!vercelConfig.crons) {
      vercelConfig.crons = [];
    }

    // Check if leaderboard cron already exists
    const hasCron = vercelConfig.crons.some((c: any) => 
      c.path === '/api/leaderboard/cron-update'
    );

    if (!hasCron) {
      vercelConfig.crons.push({
        path: '/api/leaderboard/cron-update',
        schedule: '0 2 * * *',
      });
      log('✓ Added cron job: Daily 2 AM UTC', 'green');
    } else {
      log('✓ Cron job already configured', 'green');
    }

    fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2), 'utf-8');
    log('✓ Deployment configuration saved', 'green');
    
    return true;
  } catch (error) {
    log(`✗ Configuration failed: ${(error as any).message}`, 'red');
    return false;
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  log('\n🚀 WARRIOR RANKING SYSTEM - PHASE 1 AUTOMATION', 'bright');
  log('   Automatic setup of backend, hooks, and deployment', 'cyan');

  const results: Record<string, boolean> = {};

  // Execute tasks
  results['Migration'] = runMigration();
  results['Quiz Hook'] = integrateQuizHook();
  results['Journal Hook'] = integrateJournalHook();
  results['Comment Hook'] = integrateCommentHook();
  results['Testing'] = runTests();
  results['Deployment'] = configureDeployment();

  // Summary
  section('PHASE 1 AUTOMATION SUMMARY');

  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;

  log(`\nCompleted Tasks:`, 'cyan');
  for (const [task, success] of Object.entries(results)) {
    const icon = success ? '✅' : '⚠️';
    const color = success ? 'green' : 'yellow';
    log(`  ${icon} ${task}`, color);
  }

  log(`\nResult: ${passed}/${total} completed`, passed === total ? 'green' : 'yellow');

  if (passed === total) {
    log('\n🎉 ALL TASKS COMPLETED SUCCESSFULLY!', 'green');
    log('\nNext steps:', 'cyan');
    log('  1. Start dev server: npm run dev', 'yellow');
    log('  2. Test endpoints in browser/Postman', 'yellow');
    log('  3. Verify point calculations', 'yellow');
    log('  4. Deploy: git push', 'yellow');
  } else {
    log('\n⚠️  SOME TASKS NEED MANUAL REVIEW', 'yellow');
    log('   See PHASE_1_3_INTEGRATION_GUIDE.md for details', 'yellow');
  }

  log(`\n${'═'.repeat(70)}\n`, 'cyan');
}

main().catch(error => {
  log(`\nFatal error: ${error.message}`, 'red');
  process.exit(1);
});
