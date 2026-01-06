import { CosmosClient } from '@azure/cosmos';
import * as fs from 'fs';
import * as path from 'path';

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

const client = new CosmosClient({ 
  endpoint: process.env.AZURE_COSMOS_ENDPOINT!, 
  key: process.env.AZURE_COSMOS_KEY!
});

async function checkModuleData() {
  const container = client.database('mpt-warrior').container('educational-modules');
  
  console.log('🔍 Checking educational-modules container...\n');
  
  const { resources: allModules } = await container.items
    .query('SELECT * FROM c')
    .fetchAll();
  
  console.log(`📊 Total modules in database: ${allModules.length}\n`);
  
  for (const mod of allModules) {
    console.log(`Module ${mod.moduleNumber}: ${mod.title}`);
    console.log(`  Level: ${mod.level}`);
    console.log(`  Lessons: ${mod.lessons?.length || 0}`);
    console.log(`  Available: ${mod.isAvailable}`);
    
    if (mod.lessons && mod.lessons.length > 0) {
      console.log(`  First lesson: "${mod.lessons[0].title}"`);
      console.log(`  Content size: ${mod.lessons[0].content?.length || 0} chars`);
    }
    console.log('');
  }
}

checkModuleData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
