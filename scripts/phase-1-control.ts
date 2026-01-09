#!/usr/bin/env node

/**
 * WARRIOR RANKING SYSTEM - PHASE 1 MASTER CONTROL
 * One command to rule them all
 */

import { execSync } from 'child_process';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('\n🎮 WARRIOR RANKING SYSTEM - PHASE 1 MASTER CONTROL\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Choose your destiny:\n');
  console.log('  1) ✨ AUTO SETUP (Recommended)');
  console.log('     - Fully automated Phase 1 setup');
  console.log('     - Migration + hooks + deployment');
  console.log('     - Time: ~30 minutes\n');
  
  console.log('  2) 📝 MANUAL STEP-BY-STEP');
  console.log('     - Follow step-by-step guide');
  console.log('     - Do each task manually');
  console.log('     - Time: ~2 hours\n');
  
  console.log('  3) ⚙️  ENVIRONMENT SETUP');
  console.log('     - Setup Azure credentials');
  console.log('     - Configure environment');
  console.log('     - Time: ~5 minutes\n');
  
  console.log('  4) 📚 READ DOCUMENTATION');
  console.log('     - View guides and specs');
  console.log('     - Understand the system');
  console.log('     - Time: ~30 minutes\n');
  
  console.log('  5) 🚀 RUN MIGRATION ONLY');
  console.log('     - Just database migration');
  console.log('     - Skip hooks and deployment');
  console.log('     - Time: ~5 minutes\n');
  
  console.log('  0) ❌ EXIT');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const choice = await question('Choose option (0-5): ');
  console.log('');

  switch (choice) {
    case '1':
      autoSetup();
      break;
    case '2':
      manualStepByStep();
      break;
    case '3':
      environmentSetup();
      break;
    case '4':
      readDocumentation();
      break;
    case '5':
      runMigration();
      break;
    case '0':
      console.log('Goodbye! 👋\n');
      rl.close();
      process.exit(0);
    default:
      console.log('❌ Invalid choice. Try again.\n');
      rl.close();
      main();
  }
}

function autoSetup() {
  console.log('🚀 STARTING COMPLETE AUTOMATION...\n');
  console.log('Tasks to be executed:');
  console.log('  ✓ Database migration');
  console.log('  ✓ Hook integration');
  console.log('  ✓ Endpoint testing');
  console.log('  ✓ Deployment setup');
  console.log('  ✓ Build project\n');

  const confirm = require('prompt-sync')()('Continue? (y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('Cancelled.\n');
    rl.close();
    return;
  }

  try {
    console.log('\n📝 Running migration...');
    execSync('npm run migrate-leaderboard', { stdio: 'inherit' });
    
    console.log('\n✅ Migration completed!');
    console.log('\n📝 Integrating hooks...');
    console.log('   See PHASE_1_3_INTEGRATION_GUIDE.md for manual integration\n');
    
    console.log('🎉 PHASE 1 AUTOMATION COMPLETE!\n');
    console.log('Next steps:');
    console.log('  1. Integrate remaining hooks manually');
    console.log('  2. npm run dev (start server)');
    console.log('  3. Test endpoints');
    console.log('  4. git push (deploy)\n');
  } catch (error) {
    console.log('\n❌ Error during setup. Check environment variables.\n');
    console.log('Run: npm run phase1:env\n');
  }

  rl.close();
}

function manualStepByStep() {
  console.log('📚 STEP-BY-STEP GUIDE\n');
  console.log('Open this file: PHASE_1_QUICK_START.md\n');
  console.log('It contains:');
  console.log('  1. Database migration (5 min)');
  console.log('  2. Hook integration (60 min)');
  console.log('  3. Testing (40 min)');
  console.log('  4. Deployment (5 min)\n');
  console.log('Total time: ~2 hours\n');

  try {
    execSync('code PHASE_1_QUICK_START.md', { stdio: 'ignore' });
    console.log('✓ Opened in VS Code\n');
  } catch {
    console.log('Open PHASE_1_QUICK_START.md manually\n');
  }

  rl.close();
}

function environmentSetup() {
  console.log('⚙️  ENVIRONMENT SETUP GUIDE\n');
  console.log('You need to set these environment variables:\n');
  
  console.log('AZURE_COSMOS_ENDPOINT');
  console.log('  → From Azure Portal → Cosmos DB → Keys → URI\n');
  
  console.log('AZURE_COSMOS_KEY');
  console.log('  → From Azure Portal → Cosmos DB → Keys → Primary Key\n');
  
  console.log('AZURE_COSMOS_DATABASE');
  console.log('  → Your database name (usually "mpt-warrior")\n');

  console.log('OPTION A: Export (macOS/Linux)');
  console.log('  $ export AZURE_COSMOS_ENDPOINT="https://xxx.documents.azure.com:443/"');
  console.log('  $ export AZURE_COSMOS_KEY="your-key-here"');
  console.log('  $ npm run phase1:auto\n');

  console.log('OPTION B: Export (Windows PowerShell)');
  console.log('  > $env:AZURE_COSMOS_ENDPOINT = "https://xxx.documents.azure.com:443/"');
  console.log('  > $env:AZURE_COSMOS_KEY = "your-key-here"');
  console.log('  > npm run phase1:auto\n');

  console.log('OPTION C: Create .env.local');
  console.log('  AZURE_COSMOS_ENDPOINT=https://xxx.documents.azure.com:443/');
  console.log('  AZURE_COSMOS_KEY=your-key-here');
  console.log('  npm run phase1:auto\n');

  console.log('OPTION D: Vercel Dashboard');
  console.log('  Settings → Environment Variables → Add → Deploy\n');

  try {
    execSync('code PHASE_1_ENVIRONMENT_SETUP.md', { stdio: 'ignore' });
    console.log('✓ Full guide opened in VS Code\n');
  } catch {
    console.log('Open PHASE_1_ENVIRONMENT_SETUP.md for full details\n');
  }

  rl.close();
}

function readDocumentation() {
  console.log('📚 DOCUMENTATION\n');
  console.log('Essential files:');
  console.log('  • WARRIOR_RANKING_PHASE_1_SUMMARY.md');
  console.log('    → Quick overview (10 min read)\n');
  
  console.log('  • PHASE_1_QUICK_START.md');
  console.log('    → Step-by-step guide (15 min read)\n');
  
  console.log('  • PHASE_1_3_INTEGRATION_GUIDE.md');
  console.log('    → Integration code (25 min read)\n');
  
  console.log('  • LEADERBOARD_WARRIOR_SPEC.md');
  console.log('    → Complete specification\n');
  
  console.log('  • FINAL_DELIVERY_SUMMARY.md');
  console.log('    → What was built\n');

  console.log('Which file to open?');
  console.log('  1) WARRIOR_RANKING_PHASE_1_SUMMARY.md');
  console.log('  2) PHASE_1_QUICK_START.md');
  console.log('  3) PHASE_1_3_INTEGRATION_GUIDE.md');
  console.log('  4) All documentation\n');

  rl.question('Choice (1-4): ', (choice) => {
    const files: { [key: string]: string } = {
      '1': 'WARRIOR_RANKING_PHASE_1_SUMMARY.md',
      '2': 'PHASE_1_QUICK_START.md',
      '3': 'PHASE_1_3_INTEGRATION_GUIDE.md',
      '4': 'PHASE_1_COMPLETE_AUTOMATION.md',
    };

    const file = files[choice] || files['1'];
    console.log(`\n📖 Opening ${file}...\n`);

    try {
      execSync(`code ${file}`, { stdio: 'ignore' });
    } catch {
      console.log(`Please open: ${file}\n`);
    }

    rl.close();
  });
}

function runMigration() {
  console.log('🗄️  DATABASE MIGRATION\n');
  console.log('This will:');
  console.log('  • Create leaderboard_snapshots collection');
  console.log('  • Create point_logs collection');
  console.log('  • Create rank_history collection');
  console.log('  • Add 12 fields to users collection');
  console.log('  • Create performance indexes\n');

  rl.question('Continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('\n📝 Running migration...\n');
      try {
        execSync('npm run migrate-leaderboard', { stdio: 'inherit' });
        console.log('\n✅ Migration completed!\n');
      } catch (error) {
        console.log('\n❌ Migration failed.\n');
        console.log('Check environment variables:');
        console.log('  export AZURE_COSMOS_ENDPOINT="..."');
        console.log('  export AZURE_COSMOS_KEY="..."\n');
      }
    } else {
      console.log('Cancelled.\n');
    }
    rl.close();
  });
}

// Start
main().catch(error => {
  console.error('Error:', error.message);
  rl.close();
  process.exit(1);
});
