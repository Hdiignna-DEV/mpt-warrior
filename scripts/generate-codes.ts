/**
 * Generate Initial Invitation Codes
 * Run this script to create first batch of invitation codes
 */

import { createInvitationCode, generateInvitationCode } from '@/lib/db/code-service';

async function main() {
  console.log('🔑 Generating invitation codes...\n');

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@mpt-warrior.com';
  
  // Generate 5 codes dengan 10 uses each
  const codesCount = 5;
  const maxUsesPerCode = 10;

  try {
    for (let i = 0; i < codesCount; i++) {
      const code = generateInvitationCode();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 3); // Expires in 3 months

      const invitationCode = await createInvitationCode({
        code,
        created_by: ADMIN_EMAIL,
        max_uses: maxUsesPerCode,
        expires_at: expiresAt,
        is_active: true,
        description: `Batch 1 - Code ${i + 1}`,
      });

      console.log(`✅ Created: ${invitationCode.code} (${maxUsesPerCode} uses, expires ${expiresAt.toLocaleDateString()})`);
    }

    console.log(`\n🎉 Successfully created ${codesCount} invitation codes!`);
    console.log('\n📢 Share these codes in your WhatsApp/Telegram groups:');
  } catch (error) {
    console.error('\n❌ Error generating codes:', error);
    process.exit(1);
  }
}

main();
