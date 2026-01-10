#!/usr/bin/env node

/**
 * Asset Conversion Script: PNG to WebP
 * Converts Arka mascot images from PNG to WebP format
 * 
 * Requirements:
 * - npm install sharp (already in devDependencies)
 * 
 * Usage:
 * - npx node scripts/convert-assets-to-webp.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MASCOT_DIR = path.join(__dirname, '../public/images/mascots');
const POSES = [
  'commander-arka-empty',
  'commander-arka-onboarding',
  'commander-arka-vision',
  'commander-arka-victory',
  'commander-arka-warning',
];

async function convertImageToWebP(imagePath, outputPath) {
  try {
    const stats = fs.statSync(imagePath);
    const originalSize = (stats.size / 1024).toFixed(2);

    await sharp(imagePath)
      .webp({ quality: 85 })
      .toFile(outputPath);

    const webpStats = fs.statSync(outputPath);
    const webpSize = (webpStats.size / 1024).toFixed(2);
    const saved = (100 - (webpSize / originalSize * 100)).toFixed(1);

    console.log(`✅ Converted: ${path.basename(imagePath)}`);
    console.log(`   Original: ${originalSize}KB → WebP: ${webpSize}KB (${saved}% smaller)`);

    return true;
  } catch (error) {
    console.error(`❌ Error converting ${imagePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🎨 Starting PNG to WebP conversion...\n');

  if (!fs.existsSync(MASCOT_DIR)) {
    console.error(`❌ Directory not found: ${MASCOT_DIR}`);
    process.exit(1);
  }

  let successful = 0;
  let failed = 0;

  for (const pose of POSES) {
    const pngPath = path.join(MASCOT_DIR, `${pose}.png`);
    const webpPath = path.join(MASCOT_DIR, `${pose}.webp`);

    if (!fs.existsSync(pngPath)) {
      console.log(`⚠️  PNG not found: ${pose}.png (skipping)`);
      continue;
    }

    const converted = await convertImageToWebP(pngPath, webpPath);
    if (converted) {
      successful++;
    } else {
      failed++;
    }
  }

  console.log(`\n📊 Conversion complete!`);
  console.log(`   ✅ Success: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
